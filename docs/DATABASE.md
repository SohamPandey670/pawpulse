# Database Schema & Performance Specification (DATABASE.md) — PawPulse

Refer to [BACKEND.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/BACKEND.md) for the complete table specifications, foreign keys, and indexing topologies.

## Database Summary
* **Engine**: PostgreSQL 15 (Production) / H2 in-memory (Local & Test)
* **Tables**: 8 Relational Tables (`clinics`, `vets`, `owners`, `pets`, `appointments`, `payments`, `prescriptions`, `referrals`)
* **Total Initial Seed Rows**: 5,506 appointment records across 6 major Indian metropolitan clinics.
* **Migration Scripts**: Located in `sql/` directory:
  * [01_schema.sql](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/sql/01_schema.sql): DDL tables and constraints.
  * [02_kpi_views.sql](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/sql/02_kpi_views.sql): Analytical views (`v_monthly_revenue`, `v_no_show_analysis`).
  * [03_advanced_analytics.sql](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/sql/03_advanced_analytics.sql): SQL window functions and cohorts.
  * [04_seed_data.sql](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/sql/04_seed_data.sql): Synthetic realistic clinical dataset.
