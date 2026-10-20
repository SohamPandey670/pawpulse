-- ========================================================
-- 🐾 PawPulse - Pet Healthcare Operations Platform
-- Module 3: Advanced PostgreSQL Analytics & Window Functions
-- ========================================================

-- Query 1: Top 3 Veterinarians Per Clinic (Partitioned Dense Rank)
WITH vet_metrics AS (
    SELECT 
        c.name AS clinic_name,
        v.name AS vet_name,
        v.specialization,
        COUNT(a.id) AS total_consultations,
        ROUND(AVG(v.rating), 2) AS doctor_rating,
        COALESCE(SUM(p.amount), 0) AS total_revenue_generated
    FROM vets v
    JOIN clinics c ON v.clinic_id = c.id
    LEFT JOIN appointments a ON v.id = a.vet_id AND a.status = 'completed'
    LEFT JOIN payments p ON a.id = p.appointment_id AND p.status = 'completed'
    GROUP BY c.name, v.name, v.specialization
)
SELECT 
    clinic_name,
    vet_name,
    specialization,
    total_consultations,
    total_revenue_generated,
    DENSE_RANK() OVER (
        PARTITION BY clinic_name 
        ORDER BY total_consultations DESC, total_revenue_generated DESC
    ) AS rank_in_clinic
FROM vet_metrics
QUALIFY DENSE_RANK() OVER (PARTITION BY clinic_name ORDER BY total_consultations DESC) <= 3;


-- Query 2: Month-over-Month (MoM) Revenue & Growth Rate (LAG Window Function)
WITH monthly_revenue AS (
    SELECT 
        DATE_TRUNC('month', paid_at) AS revenue_month,
        COUNT(id) AS total_transactions,
        SUM(amount) AS monthly_revenue_inr
    FROM payments
    WHERE status = 'completed'
    GROUP BY DATE_TRUNC('month', paid_at)
)
SELECT 
    TO_CHAR(revenue_month, 'Mon YYYY') AS period,
    total_transactions,
    monthly_revenue_inr,
    LAG(monthly_revenue_inr, 1) OVER (ORDER BY revenue_month) AS prev_month_revenue,
    ROUND(
        (monthly_revenue_inr - LAG(monthly_revenue_inr, 1) OVER (ORDER BY revenue_month)) /
        NULLIF(LAG(monthly_revenue_inr, 1) OVER (ORDER BY revenue_month), 0) * 100, 2
    ) AS mom_growth_pct
FROM monthly_revenue
ORDER BY revenue_month DESC;


-- Query 3: Cumulative Running Total Revenue
WITH daily_revenue AS (
    SELECT 
        DATE(paid_at) AS payment_date,
        SUM(amount) AS day_revenue
    FROM payments
    WHERE status = 'completed'
    GROUP BY DATE(paid_at)
)
SELECT 
    payment_date,
    day_revenue,
    SUM(day_revenue) OVER (
        ORDER BY payment_date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_running_revenue_inr
FROM daily_revenue
ORDER BY payment_date;


-- Query 4: SLA Turnaround Time Percentiles (Median vs P90)
SELECT 
    c.name AS clinic_name,
    COUNT(r.id) AS total_referrals,
    ROUND(
        PERCENTILE_CONT(0.50) WITHIN GROUP (
            ORDER BY EXTRACT(EPOCH FROM (r.accepted_at - r.referred_at)) / 3600.0
        )::NUMERIC, 2
    ) AS p50_median_tat_hours,
    ROUND(
        PERCENTILE_CONT(0.90) WITHIN GROUP (
            ORDER BY EXTRACT(EPOCH FROM (r.accepted_at - r.referred_at)) / 3600.0
        )::NUMERIC, 2
    ) AS p90_tat_hours,
    4.0 AS sla_threshold_hours
FROM clinics c
JOIN referrals r ON c.id = r.to_clinic_id
WHERE r.accepted_at IS NOT NULL
GROUP BY c.name
ORDER BY p90_tat_hours DESC;


-- Query 5: No-Show Risk by Day of Week & Service Channel
SELECT 
    TO_CHAR(scheduled_at, 'Day') AS day_of_week,
    EXTRACT(ISODOW FROM scheduled_at) AS day_number,
    service_type,
    COUNT(*) AS total_booked,
    COUNT(CASE WHEN status = 'no_show' THEN 1 END) AS no_shows,
    ROUND(
        (COUNT(CASE WHEN status = 'no_show' THEN 1 END)::NUMERIC / COUNT(*) * 100), 2
    ) AS no_show_probability_pct
FROM appointments
GROUP BY TO_CHAR(scheduled_at, 'Day'), EXTRACT(ISODOW FROM scheduled_at), service_type
ORDER BY day_number, no_show_probability_pct DESC;
