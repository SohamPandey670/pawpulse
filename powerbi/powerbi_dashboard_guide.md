# 🐾 PawPulse Power BI Dashboard Implementation Manual

This manual provides the step-by-step procedure to construct the **PawPulse Pet Healthcare Operations Report** in Power BI Desktop, matching the enterprise KPI dashboard specifications.

---

## 1. Connecting Data Sources

### Option A: PostgreSQL Direct Connection (Production)
1. Open **Power BI Desktop**.
2. Select **Get Data** -> **PostgreSQL database**.
3. **Server**: Enter your PostgreSQL host (e.g., Railway host or `localhost:5432`).
4. **Database**: `pawpulse`.
5. **Data Connectivity Mode**: Select **Import** (recommended for VertiPaq performance) or **DirectQuery** (for real-time live database updates).
6. Under **Advanced Options**, you can optionally paste the SQL queries from `sql/02_kpi_views.sql`.
7. Enter username and password credentials when prompted and click **Connect**.

### Option B: CSV Export Import (Fast Local Testing)
1. Select **Get Data** -> **Text/CSV**.
2. Point to the CSV datasets exported from the database or synthetic data scripts.

---

## 2. Star Schema Relationship Configuration

In Power BI **Model View**, establish the following 1-to-Many single-direction relationships:

| From Dimension (1) | To Fact Table (*) | Key Column | Cross Filter Direction |
|---|---|---|---|
| `DimDate[FullDate]` | `FactAppointments[ScheduledDate]` | Date | Single |
| `DimClinics[ClinicID]` | `FactAppointments[ClinicID]` | ClinicID | Single |
| `DimVets[VetID]` | `FactAppointments[VetID]` | VetID | Single |
| `DimPets[PetID]` | `FactAppointments[PetID]` | PetID | Single |
| `DimOwners[OwnerID]` | `DimPets[OwnerID]` | OwnerID | Single |
| `FactAppointments[AppointmentID]` | `FactPayments[AppointmentID]` | AppointmentID | Single |
| `FactAppointments[AppointmentID]` | `FactReferrals[AppointmentID]` | AppointmentID | Single |
| `FactAppointments[AppointmentID]` | `FactPrescriptions[AppointmentID]` | AppointmentID | Single |

---

## 3. Importing DAX Measures

1. Create a dedicated Measure Table named `_Measures`.
2. Copy and paste each measure from [`dax_measures.dax`](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/powerbi/dax_measures.dax).
3. Ensure numerical formats are configured:
   - Currency: `₹#,##0` for Revenue measures.
   - Percentage: `0.0%` for Compliance, No-Show, Repeat Visit, and MoM Growth measures.
   - Decimals: `0.0` for TAT hours.

---

## 4. Report Visual Canvas Layout (3-Page Architecture)

### Page 1: Executive Operations Cockpit (Hero Dashboard)
- **Top Header**: Logo, Title "PawPulse Operations Cockpit", Date Range Slicer (Relative Date: Last 30 Days), Clinic Slicer (Dropdown).
- **KPI Cards Row (6 Cards)**:
  1. `[Consultations (Last 30 Days)]` with comparison to prior period.
  2. `[Average Referral TAT (Hours)]` with SLA benchmark line (<4h).
  3. `[Rx Upload Compliance %]` with conditional formatting (Green >=90%, Red <90%).
  4. `[Repeat Visit Retention Rate %]` (Target >30%).
  5. `[No-Show Rate %]` (Target <10%).
  6. `[Revenue (Last 30 Days)]` formatted in Lakhs (`₹#,##0.0,, "Lakh"`).
- **Main Visuals (2x2 Grid)**:
  - **Visual 1**: Line Chart — `[Total Completed Consultations]` and `[7-Day Moving Average Consultations]` over `DimDate[FullDate]`.
  - **Visual 2**: Clustered Horizontal Bar Chart — `[Total Completed Consultations]` by `FactAppointments[ServiceType]`.
  - **Visual 3**: Donut Chart — `[Dog Patient Share %]` vs `[Cat Patient Share %]` vs Other by `DimPets[Species]`.
  - **Visual 4**: Bar Chart with Reference Line — `[Average Referral TAT (Hours)]` by `DimClinics[ClinicName]` with Constant Line at `4.0` hours.

### Page 2: Care Coordination & Referral SLA Pipeline
- **Decomposition Tree**: Root `[Total Referrals Handed Off]` -> Explain by `DimClinics[ClinicName]` -> Explain by `FactReferrals[ReferralStatus]` -> Explain by `DimVets[VetName]`.
- **Scatter Plot**: X-axis `[Total Referrals Handed Off]`, Y-axis `[Average Referral TAT (Hours)]`, Bubble Size `[SLA Breached Referrals Count]`.
- **SLA Breach Matrix**: Columns for Originating Clinic, Receiving Clinic, Doctor, Reason, TAT Hours, SLA Status.

### Page 3: Veterinary Performance & Clinical Quality
- **Matrix Visual**: Rows `DimClinics[ClinicName]` and `DimVets[VetName]`.
  - Columns: Consultations Count, Avg Rating, Revenue Generated, Rx Compliance %, Average Consultation Duration.
- **Top 5 Ranking**: Ranked list of doctors by consultation volume.
- **Weekly Trend Ribbon Chart**: `[Rx Upload Compliance %]` over week intervals with target benchmark.

---

## 5. Publishing & Automated Refresh

1. Select **Publish** -> Select Power BI Workspace (e.g. "PawPulse Healthcare Analytics").
2. In Power BI Service, navigate to **Dataset Settings** -> **Scheduled Refresh**.
3. Set gateway connection for PostgreSQL or configure daily refresh at 06:00 AM IST.
4. Setup Power BI Mobile layout for smartphone monitoring by hospital executives.
