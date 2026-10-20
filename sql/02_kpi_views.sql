-- ========================================================
-- 🐾 PawPulse - Pet Healthcare Operations Platform
-- Module 3: Analytical SQL KPI Views
-- ========================================================

-- 1. Daily Consultation Trend with 7-Day Moving Average
CREATE OR REPLACE VIEW v_daily_consultation_summary AS
WITH daily_counts AS (
    SELECT 
        DATE(scheduled_at) AS consult_date,
        COUNT(*) AS total_booked,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_count,
        COUNT(CASE WHEN status = 'no_show' THEN 1 END) AS no_show_count
    FROM appointments
    GROUP BY DATE(scheduled_at)
)
SELECT 
    consult_date,
    total_booked,
    completed_count,
    no_show_count,
    ROUND(
        AVG(completed_count) OVER (
            ORDER BY consult_date 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ), 1
    ) AS moving_avg_7d
FROM daily_counts
ORDER BY consult_date DESC;

-- 2. Referral SLA Performance & Turnaround Time (TAT) by Clinic
CREATE OR REPLACE VIEW v_referral_sla_tat AS
SELECT 
    c.id AS clinic_id,
    c.name AS clinic_name,
    c.city,
    COUNT(r.id) AS total_referrals_received,
    COUNT(CASE WHEN r.status IN ('accepted', 'completed') THEN 1 END) AS accepted_count,
    ROUND(
        AVG(
            CASE 
                WHEN r.accepted_at IS NOT NULL 
                THEN EXTRACT(EPOCH FROM (r.accepted_at - r.referred_at)) / 3600.0 
            END
        )::NUMERIC, 2
    ) AS avg_tat_hours,
    COUNT(
        CASE 
            WHEN r.accepted_at IS NOT NULL 
                 AND (EXTRACT(EPOCH FROM (r.accepted_at - r.referred_at)) / 3600.0) > 4.0 
            THEN 1 
        END
    ) AS sla_breach_count,
    ROUND(
        (COUNT(
            CASE 
                WHEN r.accepted_at IS NOT NULL 
                     AND (EXTRACT(EPOCH FROM (r.accepted_at - r.referred_at)) / 3600.0) > 4.0 
                THEN 1 
            END
        )::NUMERIC / NULLIF(COUNT(CASE WHEN r.accepted_at IS NOT NULL THEN 1 END), 0) * 100), 1
    ) AS sla_breach_rate_pct
FROM clinics c
LEFT JOIN referrals r ON c.id = r.to_clinic_id
GROUP BY c.id, c.name, c.city;

-- 3. Weekly Prescription Upload Compliance
CREATE OR REPLACE VIEW v_rx_compliance_weekly AS
SELECT 
    DATE_TRUNC('week', a.scheduled_at) AS week_start,
    COUNT(DISTINCT a.id) AS total_completed_consults,
    COUNT(DISTINCT CASE WHEN p.uploaded = TRUE THEN a.id END) AS consults_with_uploaded_rx,
    ROUND(
        (COUNT(DISTINCT CASE WHEN p.uploaded = TRUE THEN a.id END)::NUMERIC / 
         NULLIF(COUNT(DISTINCT a.id), 0) * 100), 1
    ) AS rx_compliance_pct,
    90.0 AS protocol_target_pct
FROM appointments a
LEFT JOIN prescriptions p ON a.id = p.appointment_id
WHERE a.status = 'completed'
GROUP BY DATE_TRUNC('week', a.scheduled_at)
ORDER BY week_start DESC;

-- 4. Clinic Revenue & Operational Ranking
CREATE OR REPLACE VIEW v_clinic_performance_summary AS
SELECT 
    c.id AS clinic_id,
    c.name AS clinic_name,
    c.city,
    c.type AS clinic_type,
    COUNT(DISTINCT a.id) AS total_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) AS completed_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'no_show' THEN a.id END) AS no_shows,
    ROUND(
        (COUNT(DISTINCT CASE WHEN a.status = 'no_show' THEN a.id END)::NUMERIC / 
         NULLIF(COUNT(DISTINCT a.id), 0) * 100), 1
    ) AS no_show_rate_pct,
    COALESCE(SUM(pay.amount), 0) AS total_revenue_inr,
    ROUND(
        COALESCE(SUM(pay.amount), 0) / 
        NULLIF(COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END), 0), 2
    ) AS avg_revenue_per_completed_visit
FROM clinics c
LEFT JOIN appointments a ON c.id = a.clinic_id
LEFT JOIN payments pay ON a.id = pay.appointment_id AND pay.status = 'completed'
GROUP BY c.id, c.name, c.city, c.type
ORDER BY total_revenue_inr DESC;

-- 5. Pet Parent Retention Rate (Repeat Visits within 90 days)
CREATE OR REPLACE VIEW v_pet_parent_retention_90d AS
WITH pet_consult_counts AS (
    SELECT 
        p.owner_id,
        p.id AS pet_id,
        COUNT(a.id) AS visit_count
    FROM pets p
    JOIN appointments a ON p.id = a.pet_id
    WHERE a.status = 'completed'
      AND a.scheduled_at >= (CURRENT_TIMESTAMP - INTERVAL '90 days')
    GROUP BY p.owner_id, p.id
)
SELECT 
    COUNT(DISTINCT pet_id) AS total_active_pets_90d,
    COUNT(DISTINCT CASE WHEN visit_count >= 2 THEN pet_id END) AS repeat_visitor_pets,
    ROUND(
        (COUNT(DISTINCT CASE WHEN visit_count >= 2 THEN pet_id END)::NUMERIC / 
         NULLIF(COUNT(DISTINCT pet_id), 0) * 100), 1
    ) AS repeat_visit_rate_pct
FROM pet_consult_counts;

-- 6. Species Demographics & Revenue Mix
CREATE OR REPLACE VIEW v_species_revenue_breakdown AS
SELECT 
    p.species,
    COUNT(DISTINCT p.id) AS registered_pets_count,
    COUNT(DISTINCT a.id) AS total_consultations,
    COALESCE(SUM(pay.amount), 0) AS total_revenue_inr,
    ROUND(
        COALESCE(SUM(pay.amount), 0) / 
        NULLIF(COUNT(DISTINCT a.id), 0), 2
    ) AS avg_ticket_size_inr
FROM pets p
LEFT JOIN appointments a ON p.id = a.pet_id AND a.status = 'completed'
LEFT JOIN payments pay ON a.id = pay.appointment_id AND pay.status = 'completed'
GROUP BY p.species
ORDER BY total_revenue_inr DESC;
