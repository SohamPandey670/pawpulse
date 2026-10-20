# 📑 PawPulse Monthly Operations Pack — Advanced Excel Specification

This guide details the workbook architecture, formula engine, and data validation rules for the **PawPulse Monthly Executive Management Pack (`PawPulse_Monthly_Operations_Pack.xlsx`)**.

---

## 1. Multi-Tab Architecture

The workbook is structured into four specialized worksheets:

1. **`Executive_Summary`**: High-level C-Suite KPI cards, monthly trend tables, and dynamic date switches.
2. **`Clinic_Scorecard`**: Granular performance matrix comparing Mumbai, Pune, Bangalore, Delhi, Chennai, and Hyderabad hubs.
3. **`SLA_Compliance_Tracker`**: Live operational queue tracking referral turnarounds, SLA breach alarms, and prescription follow-ups.
4. **`Raw_Consultations_Data`**: Formatted Excel Table (`tbl_Appointments`) with structured references serving as the single source of truth.

---

## 2. Advanced Formula Specifications

### A. Multi-Criteria Aggregations (`SUMIFS`, `COUNTIFS`, `AVERAGEIFS`)

- **Total Completed Consultations by Clinic**:
  ```excel
  =COUNTIFS(tbl_Appointments[Clinic], B5, tbl_Appointments[Status], "completed")
  ```
- **Revenue Collected for Teleconsultations in Mumbai**:
  ```excel
  =SUMIFS(tbl_Appointments[Amount_INR], tbl_Appointments[Clinic], "PawCare Mumbai", tbl_Appointments[Service_Type], "teleconsult", tbl_Appointments[Status], "completed")
  ```
- **Average Referral Turnaround Time per Facility**:
  ```excel
  =AVERAGEIFS(tbl_Referrals[TAT_Hours], tbl_Referrals[To_Clinic], B5, tbl_Referrals[Status], "accepted")
  ```

### B. Modern Lookup Engine (`XLOOKUP` & `INDEX/MATCH`)

- **Dynamic Doctor Profile Retrieval via `XLOOKUP`**:
  ```excel
  =XLOOKUP(C5, tbl_Vets[Vet_Name], tbl_Vets[Specialization], "Not Found", 0)
  ```
- **Two-Way Matrix Lookup with `INDEX/MATCH`**:
  ```excel
  =INDEX(tbl_RateCard[#Data], MATCH("Home Visit", tbl_RateCard[Service_Type], 0), MATCH("Mumbai", tbl_RateCard[#Headers], 0))
  ```

### C. Dynamic Array Formulas (Excel 365 / Modern Excel)

- **Extracting Unique Registered Cities**:
  ```excel
  =SORT(UNIQUE(tbl_Appointments[City]))
  ```
- **Filtering Active SLA Breaches**:
  ```excel
  =FILTER(tbl_Referrals, (tbl_Referrals[TAT_Hours] > 4.0) * (tbl_Referrals[Status] = "accepted"), "No Active Breaches")
  ```

### D. Logical SLA & Formatting Formulas

- **SLA Breach Flag**:
  ```excel
  =IF(ISBLANK([@Accepted_At]), "Pending Review", IF([@TAT_Hours] > 4.0, "🔴 SLA BREACH", "🟢 SLA MET"))
  ```
- **Rx Compliance Protocol Target Check**:
  ```excel
  =IF([@[Rx_Compliance_Pct]] >= 0.90, "Compliant", "Escalate (" & TEXT(0.90 - [@[Rx_Compliance_Pct]], "0.0%") & " gap)")
  ```

---

## 3. Conditional Formatting Rules

1. **Referral TAT Hours**:
   - Condition: Cell Value `> 4.0`
   - Fill: `#FFE4E6` (Light Rose), Font: `#BE123C` (Dark Rose Bold).
2. **Rx Compliance %**:
   - Condition: Cell Value `>= 90%` -> `#ECFDF5` (Soft Emerald), Font: `#047857`.
   - Condition: Cell Value `< 90%` -> `#FEF2F2` (Soft Amber/Red).
3. **Appointment Status Pill**:
   - "completed" -> Soft Green badge.
   - "no_show" -> Soft Red alert.
   - "booked" -> Soft Cyan tag.

---

## 4. Pivot Table & Slicer Integration

- **Pivot 1**: `Consultations by Channel vs Species` (Rows: `Service_Type`, Columns: `Species`, Values: `Count of Appointment_ID`).
- **Pivot 2**: `Monthly Revenue Trajectory` (Rows: `Month`, Values: `Sum of Amount_INR`, `Average Ticket Size`).
- **Interactive Slicers**:
  - `Clinic Name` (Single/Multi-select visual buttons).
  - `Month / Quarter` timeline slicer.
  - `Service Type` ('teleconsult', 'clinic', 'home_visit').
