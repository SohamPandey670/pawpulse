#!/usr/bin/env python3
"""
PawPulse Advanced Excel Management Pack Generator
Builds a professional, multi-tab executive workbook: PawPulse_Monthly_Operations_Pack.xlsx
"""

import sys
import os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Colors
HEADER_FILL = PatternFill(start_color="1E1E2E", end_color="1E1E2E", fill_type="solid")
HEADER_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
TITLE_FONT = Font(name="Calibri", size=16, bold=True, color="1E1E2E")
SUBTITLE_FONT = Font(name="Calibri", size=10, italic=True, color="555555")
CARD_LABEL_FONT = Font(name="Calibri", size=9, bold=True, color="666666")
CARD_VAL_FONT = Font(name="Calibri", size=18, bold=True, color="1E1E2E")
BOLD_FONT = Font(name="Calibri", size=11, bold=True)
TOTAL_FILL = PatternFill(start_color="F0F4F8", end_color="F0F4F8", fill_type="solid")
BREACH_FILL = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
BREACH_FONT = Font(name="Calibri", size=11, bold=True, color="991B1B")
MET_FILL = PatternFill(start_color="ECFDF5", end_color="ECFDF5", fill_type="solid")
MET_FONT = Font(name="Calibri", size=11, bold=True, color="065F46")

THIN_BORDER = Border(
    left=Side(style='thin', color='DDDDDD'),
    right=Side(style='thin', color='DDDDDD'),
    top=Side(style='thin', color='DDDDDD'),
    bottom=Side(style='thin', color='DDDDDD')
)

def create_kpi_card(ws, top_row, left_col, label, value, subtext):
    # Merge cells for card
    for r in range(top_row, top_row + 3):
        for c in range(left_col, left_col + 3):
            cell = ws.cell(row=r, column=c)
            cell.fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
            cell.border = THIN_BORDER
    
    ws.cell(row=top_row, column=left_col, value=label).font = CARD_LABEL_FONT
    val_cell = ws.cell(row=top_row + 1, column=left_col, value=value)
    val_cell.font = CARD_VAL_FONT
    val_cell.alignment = Alignment(vertical="center")
    sub_cell = ws.cell(row=top_row + 2, column=left_col, value=subtext)
    sub_cell.font = Font(name="Calibri", size=8, color="888888")

def auto_fit_columns(ws):
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            val = str(cell.value or '')
            if '\n' in val:
                val = val.split('\n')[0]
            if len(val) > max_len and len(val) < 60:
                max_len = len(val)
        ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

def main():
    wb = Workbook()
    
    # --------------------------------------------------------
    # 1. Sheet: Executive_Summary
    # --------------------------------------------------------
    ws1 = wb.active
    ws1.title = "Executive_Summary"
    ws1.views.sheetView[0].showGridLines = True

    # Title
    ws1["B2"] = "🐾 PawPulse Pet Healthcare Operations Pack"
    ws1["B2"].font = TITLE_FONT
    ws1["B3"] = "Executive Monthly Management & SLA Performance Dashboard"
    ws1["B3"].font = SUBTITLE_FONT

    # KPI Cards (Row 5 to 7)
    create_kpi_card(ws1, 5, 2, "CONSULTATIONS (30D)", "1,842", "+12.4% vs Prior Period")
    create_kpi_card(ws1, 5, 5, "AVG REFERRAL TAT", "3.1 hrs", "SLA Target: < 4.0 hrs")
    create_kpi_card(ws1, 5, 8, "RX UPLOAD COMPLIANCE", "78.0%", "Target Protocol: 90.0%")
    create_kpi_card(ws1, 9, 2, "REPEAT VISIT RATE (90D)", "34.0%", "Retention Benchmark: >30%")
    create_kpi_card(ws1, 9, 5, "NO-SHOW RATE", "9.2%", "Reduced by 1.1% MoM")
    create_kpi_card(ws1, 9, 8, "REVENUE (30D)", "₹6,40,000", "Avg ₹347 per consultation")

    # Monthly Summary Table (Row 14)
    ws1["B14"] = "Monthly Consultation & Financial Trajectory"
    ws1["B14"].font = Font(name="Calibri", size=13, bold=True, color="1E1E2E")

    headers1 = ["Month", "Total Booked", "Completed", "No-Shows", "No-Show %", "Revenue (INR)", "Avg Ticket (INR)"]
    for i, h in enumerate(headers1, start=2):
        cell = ws1.cell(row=15, column=i, value=h)
        cell.font = HEADER_FONT
        cell.fill = HEADER_FILL
        cell.alignment = Alignment(horizontal="center" if i > 2 else "left")

    monthly_data = [
        ("May 2026", 1120, 990, 105, 0.094, 346500, 350.0),
        ("Jun 2026", 1280, 1140, 118, 0.092, 399000, 350.0),
        ("Jul 2026", 1450, 1300, 128, 0.088, 455000, 350.0),
        ("Aug 2026", 1620, 1460, 138, 0.085, 511000, 350.0),
        ("Sep 2026", 1790, 1610, 155, 0.087, 563500, 350.0),
        ("Oct 2026 (MTD)", 1842, 1680, 142, 0.077, 640000, 380.95),
    ]

    for row_idx, data in enumerate(monthly_data, start=16):
        ws1.cell(row=row_idx, column=2, value=data[0]).font = BOLD_FONT
        ws1.cell(row=row_idx, column=3, value=data[1]).number_format = "#,##0"
        ws1.cell(row=row_idx, column=4, value=data[2]).number_format = "#,##0"
        ws1.cell(row=row_idx, column=5, value=data[3]).number_format = "#,##0"
        
        # Formula for No-Show %
        p_cell = ws1.cell(row=row_idx, column=6, value=f"=E{row_idx}/C{row_idx}")
        p_cell.number_format = "0.0%"
        
        r_cell = ws1.cell(row=row_idx, column=7, value=data[5])
        r_cell.number_format = "₹#,##0"
        
        # Formula for Avg Ticket
        t_cell = ws1.cell(row=row_idx, column=8, value=f"=G{row_idx}/D{row_idx}")
        t_cell.number_format = "₹#,##0.00"

        for col_idx in range(2, 9):
            ws1.cell(row=row_idx, column=col_idx).border = THIN_BORDER

    # Total Row
    tot_row = 22
    ws1.cell(row=tot_row, column=2, value="TOTAL / YTD").font = BOLD_FONT
    ws1.cell(row=tot_row, column=3, value=f"=SUM(C16:C21)").number_format = "#,##0"
    ws1.cell(row=tot_row, column=4, value=f"=SUM(D16:D21)").number_format = "#,##0"
    ws1.cell(row=tot_row, column=5, value=f"=SUM(E16:E21)").number_format = "#,##0"
    ws1.cell(row=tot_row, column=6, value=f"=E{tot_row}/C{tot_row}").number_format = "0.0%"
    ws1.cell(row=tot_row, column=7, value=f"=SUM(G16:G21)").number_format = "₹#,##0"
    ws1.cell(row=tot_row, column=8, value=f"=G{tot_row}/D{tot_row}").number_format = "₹#,##0.00"

    for col_idx in range(2, 9):
        c = ws1.cell(row=tot_row, column=col_idx)
        c.font = BOLD_FONT
        c.fill = TOTAL_FILL
        c.border = THIN_BORDER

    # --------------------------------------------------------
    # 2. Sheet: Clinic_Scorecard
    # --------------------------------------------------------
    ws2 = wb.create_sheet(title="Clinic_Scorecard")
    ws2.views.sheetView[0].showGridLines = True

    ws2["A1"] = "Clinic Performance Scorecard & SLA Matrix"
    ws2["A1"].font = TITLE_FONT
    ws2["A2"] = "Comparative operational efficiency, revenue collection, and referral SLA tracking by facility"
    ws2["A2"].font = SUBTITLE_FONT

    headers2 = ["Clinic Name", "City", "Facility Type", "Consults", "Revenue (INR)", "Avg TAT (hrs)", "SLA Breaches", "SLA Status", "Rx Compliance %"]
    for i, h in enumerate(headers2, start=1):
        cell = ws2.cell(row=4, column=i, value=h)
        cell.font = HEADER_FONT
        cell.fill = HEADER_FILL
        cell.alignment = Alignment(horizontal="center" if i > 3 else "left")

    clinic_rows = [
        ("PawCare Mumbai", "Mumbai", "Full Service Clinic", 441, 185000, 2.1, 0, 0.82),
        ("VetLife Pune", "Pune", "Specialty Center", 388, 162000, 2.8, 0, 0.80),
        ("PetFirst Bangalore", "Bangalore", "Full Service Clinic", 334, 140000, 3.4, 0, 0.77),
        ("PawCare Delhi", "Delhi", "Full Service Clinic", 298, 125000, 4.6, 12, 0.75),
        ("VetLife Chennai", "Chennai", "Specialty Center", 210, 88000, 5.2, 18, 0.74),
        ("PetFirst Hyderabad", "Hyderabad", "Full Service Clinic", 171, 72000, 3.1, 0, 0.76),
    ]

    for row_idx, cdata in enumerate(clinic_rows, start=5):
        ws2.cell(row=row_idx, column=1, value=cdata[0]).font = BOLD_FONT
        ws2.cell(row=row_idx, column=2, value=cdata[1])
        ws2.cell(row=row_idx, column=3, value=cdata[2])
        ws2.cell(row=row_idx, column=4, value=cdata[3]).number_format = "#,##0"
        ws2.cell(row=row_idx, column=5, value=cdata[4]).number_format = "₹#,##0"
        
        tat_cell = ws2.cell(row=row_idx, column=6, value=cdata[5])
        tat_cell.number_format = "0.0"

        ws2.cell(row=row_idx, column=7, value=cdata[6]).number_format = "#,##0"

        # SLA Status formula: =IF(F5<=4.0, "🟢 MET", "🔴 BREACH")
        sla_cell = ws2.cell(row=row_idx, column=8, value=f'=IF(F{row_idx}<=4.0, "🟢 MET", "🔴 BREACH")')
        sla_cell.alignment = Alignment(horizontal="center")
        if cdata[5] > 4.0:
            sla_cell.fill = BREACH_FILL
            sla_cell.font = BREACH_FONT
        else:
            sla_cell.fill = MET_FILL
            sla_cell.font = MET_FONT

        rx_cell = ws2.cell(row=row_idx, column=9, value=cdata[7])
        rx_cell.number_format = "0.0%"
        rx_cell.alignment = Alignment(horizontal="center")

        for col_idx in range(1, 10):
            ws2.cell(row=row_idx, column=col_idx).border = THIN_BORDER

    # Summary Row
    c_tot = 11
    ws2.cell(row=c_tot, column=1, value="NETWORK TOTAL").font = BOLD_FONT
    ws2.cell(row=c_tot, column=4, value="=SUM(D5:D10)").number_format = "#,##0"
    ws2.cell(row=c_tot, column=5, value="=SUM(E5:E10)").number_format = "₹#,##0"
    ws2.cell(row=c_tot, column=6, value="=AVERAGE(F5:F10)").number_format = "0.0"
    ws2.cell(row=c_tot, column=7, value="=SUM(G5:G10)").number_format = "#,##0"
    ws2.cell(row=c_tot, column=8, value='=IF(F11<=4.0, "🟢 MET", "🔴 BREACH")').alignment = Alignment(horizontal="center")
    ws2.cell(row=c_tot, column=9, value="=AVERAGE(I5:I10)").number_format = "0.0%"

    for col_idx in range(1, 10):
        c = ws2.cell(row=c_tot, column=col_idx)
        c.font = BOLD_FONT
        c.fill = TOTAL_FILL
        c.border = THIN_BORDER

    # --------------------------------------------------------
    # 3. Sheet: SLA_Compliance_Tracker
    # --------------------------------------------------------
    ws3 = wb.create_sheet(title="SLA_Compliance_Tracker")
    ws3.views.sheetView[0].showGridLines = True

    ws3["A1"] = "Care Coordinator Referral SLA Queue"
    ws3["A1"].font = TITLE_FONT
    ws3["A2"] = "Live monitoring of specialist handoffs and turn-around times (Target: < 4.0 hours)"
    ws3["A2"].font = SUBTITLE_FONT

    headers3 = ["Referral ID", "Patient", "Species", "From Doctor", "To Specialist", "Destination Clinic", "TAT (Hours)", "SLA Compliance", "Clinical Reason"]
    for i, h in enumerate(headers3, start=1):
        cell = ws3.cell(row=4, column=i, value=h)
        cell.font = HEADER_FONT
        cell.fill = HEADER_FILL

    referral_samples = [
        ("REF-801", "Bruno", "Dog", "Dr. Ananya Sharma", "Dr. Vikram Patel", "VetLife Pune", 2.1, "Accepted", "Suspected ligament tear - orthopedic review"),
        ("REF-802", "Whiskers", "Cat", "Dr. Rajesh Gowda", "Dr. Priya Nair", "PetFirst Bangalore", 3.4, "Accepted", "Dermatology second opinion for recurring rash"),
        ("REF-803", "Coco", "Dog", "Dr. Rahul Desai", "Dr. Arjun Reddy", "PetFirst Hyderabad", 4.6, "Accepted", "SLA BREACH - Joint dysplasia evaluation delayed"),
        ("REF-804", "Simba", "Cat", "Dr. Sunita Verma", "Dr. Meera Iyer", "VetLife Chennai", 5.2, "Accepted", "SLA BREACH - Oncology mass biopsy handoff"),
        ("REF-805", "Max", "Dog", "Dr. Vikram Patel", "Dr. Sneha Kulkarni", "PawCare Mumbai", 2.8, "Accepted", "Echocardiogram cardiac assessment"),
        ("REF-806", "Polly", "Bird", "Dr. Karthik Menon", "Dr. Ananya Sharma", "PawCare Mumbai", 1.8, "Accepted", "Wing fracture orthopedic stabilization"),
        ("REF-807", "Rocky", "Dog", "Dr. Priya Nair", "Dr. Vikram Patel", "VetLife Pune", 2.5, "Accepted", "Post-op rehabilitation review"),
        ("REF-808", "Milo", "Cat", "Dr. Arjun Reddy", "Dr. Rahul Desai", "PawCare Delhi", 3.2, "Accepted", "Metabolic endocrine diagnostic consultation"),
    ]

    for row_idx, rdata in enumerate(referral_samples, start=5):
        ws3.cell(row=row_idx, column=1, value=rdata[0]).font = BOLD_FONT
        ws3.cell(row=row_idx, column=2, value=rdata[1])
        ws3.cell(row=row_idx, column=3, value=rdata[2])
        ws3.cell(row=row_idx, column=4, value=rdata[3])
        ws3.cell(row=row_idx, column=5, value=rdata[4])
        ws3.cell(row=row_idx, column=6, value=rdata[5])
        
        tat_c = ws3.cell(row=row_idx, column=7, value=rdata[6])
        tat_c.number_format = "0.0"

        # Status formula
        stat_c = ws3.cell(row=row_idx, column=8, value=f'=IF(G{row_idx}<=4.0, "🟢 SLA MET", "🔴 SLA BREACH")')
        if rdata[6] > 4.0:
            stat_c.fill = BREACH_FILL
            stat_c.font = BREACH_FONT
        else:
            stat_c.fill = MET_FILL
            stat_c.font = MET_FONT

        ws3.cell(row=row_idx, column=9, value=rdata[8])

        for col_idx in range(1, 10):
            ws3.cell(row=row_idx, column=col_idx).border = THIN_BORDER

    # Auto-adjust column widths on all sheets
    for ws in [ws1, ws2, ws3]:
        auto_fit_columns(ws)

    output_path = "C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/excel/PawPulse_Monthly_Operations_Pack.xlsx"
    wb.save(output_path)
    print(f"Successfully generated Excel Management Pack at: {output_path}")

if __name__ == "__main__":
    main()
