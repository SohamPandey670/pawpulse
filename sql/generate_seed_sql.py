#!/usr/bin/env python3
"""
PawPulse Synthetic Data Seed Generator
Generates 5,000+ realistic SQL rows matching all dashboard metrics and KPIs.
Outputs:
- sql/04_seed_data.sql (PostgreSQL dialect)
- backend/src/main/resources/data.sql (H2/Postgres compatible)
"""

import uuid
import random
from datetime import datetime, timedelta

random.seed(42)

def gen_uuid():
    return str(uuid.uuid4())

# Reference Data
CLINICS = [
    {"id": gen_uuid(), "name": "PawCare Mumbai", "city": "Mumbai", "state": "Maharashtra", "type": "clinic"},
    {"id": gen_uuid(), "name": "VetLife Pune", "city": "Pune", "state": "Maharashtra", "type": "clinic"},
    {"id": gen_uuid(), "name": "PetFirst Bangalore", "city": "Bangalore", "state": "Karnataka", "type": "clinic"},
    {"id": gen_uuid(), "name": "PawCare Delhi", "city": "Delhi", "state": "Delhi", "type": "clinic"},
    {"id": gen_uuid(), "name": "VetLife Chennai", "city": "Chennai", "state": "Tamil Nadu", "type": "clinic"},
    {"id": gen_uuid(), "name": "PetFirst Hyderabad", "city": "Hyderabad", "state": "Telangana", "type": "clinic"},
]

VETS = [
    {"id": gen_uuid(), "clinic_id": CLINICS[0]["id"], "name": "Dr. Ananya Sharma", "email": "ananya.sharma@pawpulse.in", "spec": "General & Surgery", "rating": 4.9},
    {"id": gen_uuid(), "clinic_id": CLINICS[0]["id"], "name": "Dr. Sneha Kulkarni", "email": "sneha.kulkarni@pawpulse.in", "spec": "Cardiology", "rating": 4.7},
    {"id": gen_uuid(), "clinic_id": CLINICS[1]["id"], "name": "Dr. Vikram Patel", "email": "vikram.patel@pawpulse.in", "spec": "Surgery", "rating": 4.8},
    {"id": gen_uuid(), "clinic_id": CLINICS[1]["id"], "name": "Dr. Karthik Menon", "email": "karthik.menon@pawpulse.in", "spec": "Internal Medicine", "rating": 4.5},
    {"id": gen_uuid(), "clinic_id": CLINICS[2]["id"], "name": "Dr. Priya Nair", "email": "priya.nair@pawpulse.in", "spec": "Dermatology", "rating": 4.8},
    {"id": gen_uuid(), "clinic_id": CLINICS[2]["id"], "name": "Dr. Rajesh Gowda", "email": "rajesh.gowda@pawpulse.in", "spec": "General", "rating": 4.6},
    {"id": gen_uuid(), "clinic_id": CLINICS[3]["id"], "name": "Dr. Rahul Desai", "email": "rahul.desai@pawpulse.in", "spec": "Internal Medicine", "rating": 4.7},
    {"id": gen_uuid(), "clinic_id": CLINICS[3]["id"], "name": "Dr. Sunita Verma", "email": "sunita.verma@pawpulse.in", "spec": "General", "rating": 4.6},
    {"id": gen_uuid(), "clinic_id": CLINICS[4]["id"], "name": "Dr. Meera Iyer", "email": "meera.iyer@pawpulse.in", "spec": "Oncology", "rating": 4.9},
    {"id": gen_uuid(), "clinic_id": CLINICS[5]["id"], "name": "Dr. Arjun Reddy", "email": "arjun.reddy@pawpulse.in", "spec": "Orthopedics", "rating": 4.6},
]

FIRST_NAMES = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
               "Saanvi", "Aanya", "Aadhya", "Aaradhya", "Ananya", "Pari", "Anika", "Navya", "Diya", "Myra",
               "Rahul", "Rohan", "Sneha", "Pooja", "Vikram", "Neha", "Amit", "Priya", "Kunal", "Tanvi"]
LAST_NAMES = ["Sharma", "Verma", "Patel", "Mehta", "Nair", "Iyer", "Reddy", "Rao", "Desai", "Kulkarni",
              "Joshi", "Gowda", "Singh", "Gupta", "Malhotra", "Kapoor", "Chatterjee", "Bose", "Mukherjee", "Pillai"]

CITIES = [
    ("Mumbai", "Maharashtra"),
    ("Bangalore", "Karnataka"),
    ("Delhi", "Delhi"),
    ("Pune", "Maharashtra"),
    ("Chennai", "Tamil Nadu"),
    ("Hyderabad", "Telangana"),
    ("Kolkata", "West Bengal"),
    ("Ahmedabad", "Gujarat"),
    ("Jaipur", "Rajasthan"),
    ("Lucknow", "Uttar Pradesh"),
]

DOG_BREEDS = ["Golden Retriever", "German Shepherd", "Labrador", "Beagle", "Pug", "Shih Tzu", "Indie", "Rottweiler"]
CAT_BREEDS = ["Persian", "Siamese", "Indie / Domestic Shorthair", "Maine Coon", "Bengal"]
MEDICATIONS = [
    ("Amoxicillin 250mg", "1 capsule twice daily", 7),
    ("Cephalexin 500mg", "2 tablets daily after meals", 14),
    ("Multivitamin & Mineral Syrup", "5ml once daily", 30),
    ("Medicated Anti-Fungal Shampoo", "Bathe twice weekly", 21),
    ("Prednisolone 5mg", "1 tablet daily morning", 5),
    ("Omega-3 Fatty Acid Supplement", "1 softgel daily", 60),
    ("Deworming Tablet (Drontal)", "Single dose", 1),
    ("Eye Drops (Tobramycin)", "2 drops in each eye 3 times daily", 10),
]

def main():
    print("Generating PawPulse seed data...")
    now = datetime(2026, 10, 18, 12, 0, 0)
    
    # 1. Generate Owners
    owners = []
    for i in range(250):
        city, state = random.choice(CITIES)
        fn = random.choice(FIRST_NAMES)
        ln = random.choice(LAST_NAMES)
        name = f"{fn} {ln}"
        email = f"{fn.lower()}.{ln.lower()}{random.randint(10, 999)}@example.com"
        phone = f"+91 {random.randint(70000, 99999)} {random.randint(10000, 99999)}"
        created_at = now - timedelta(days=random.randint(90, 360))
        owners.append({
            "id": gen_uuid(),
            "name": name,
            "email": email,
            "phone": phone,
            "password_hash": "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
            "city": city,
            "state": state,
            "created_at": created_at.isoformat()
        })
    
    # Add demo owner
    demo_owner_id = gen_uuid()
    owners.insert(0, {
        "id": demo_owner_id,
        "name": "Rahul Mehta",
        "email": "owner@pawpulse.in",
        "phone": "+91 98200 12345",
        "password_hash": "$2a$10$ownerhashhere123456789012345678",
        "city": "Mumbai",
        "state": "Maharashtra",
        "created_at": (now - timedelta(days=180)).isoformat()
    })

    # 2. Generate Pets
    pets = []
    pet_names = ["Bruno", "Max", "Charlie", "Bella", "Luna", "Rocky", "Milo", "Coco", "Simba", "Leo", 
                 "Daisy", "Zoe", "Buddy", "Oscar", "Toby", "Ruby", "Shadow", "Penny", "Lily", "Bailey"]
    
    # Demo pets for Rahul Mehta
    pets.append({"id": gen_uuid(), "owner_id": demo_owner_id, "name": "Bruno", "species": "dog", "breed": "Golden Retriever", "dob": "2022-03-15", "weight_kg": 32.5, "created_at": (now - timedelta(days=170)).isoformat()})
    pets.append({"id": gen_uuid(), "owner_id": demo_owner_id, "name": "Whiskers", "species": "cat", "breed": "Persian", "dob": "2023-07-22", "weight_kg": 4.5, "created_at": (now - timedelta(days=160)).isoformat()})

    for owner in owners[1:]:
        num_pets = random.choices([1, 2, 3], weights=[0.75, 0.20, 0.05])[0]
        for _ in range(num_pets):
            species = random.choices(["dog", "cat", "bird", "rabbit", "other"], weights=[0.62, 0.31, 0.04, 0.02, 0.01])[0]
            if species == "dog":
                breed = random.choice(DOG_BREEDS)
                weight = round(random.uniform(5.0, 42.0), 1)
            elif species == "cat":
                breed = random.choice(CAT_BREEDS)
                weight = round(random.uniform(3.0, 7.5), 1)
            else:
                breed = "Exotic"
                weight = round(random.uniform(0.1, 2.5), 2)
            
            p_name = random.choice(pet_names)
            dob_year = random.randint(2018, 2025)
            dob = f"{dob_year}-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
            pets.append({
                "id": gen_uuid(),
                "owner_id": owner["id"],
                "name": p_name,
                "species": species,
                "breed": breed,
                "dob": dob,
                "weight_kg": weight,
                "created_at": (now - timedelta(days=random.randint(60, 200))).isoformat()
            })

    # 3. Generate Appointments (5,000+ appointments over 180 days)
    appointments = []
    prescriptions = []
    referrals = []
    payments = []

    print(f"Creating appointments for {len(pets)} pets...")
    # Generate distribution over 180 days with heavier weight in last 30 days
    # Target: ~1840 consults in last 30 days
    for day_offset in range(180, 0, -1):
        target_date = now - timedelta(days=day_offset)
        # In last 30 days, average 60 consults/day -> 1800+
        # In older days, average 20-30 consults/day
        if day_offset <= 30:
            daily_appts = random.randint(45, 75)
        else:
            daily_appts = random.randint(18, 32)
        
        for _ in range(daily_appts):
            pet = random.choice(pets)
            vet = random.choice(VETS)
            clinic_id = vet["clinic_id"]
            
            # Service type weights: teleconsult (50%), clinic (28%), home_visit (22%)
            service_type = random.choices(["teleconsult", "clinic", "home_visit"], weights=[0.50, 0.28, 0.22])[0]
            
            # Status: completed (82%), booked (7%), no_show (9%), cancelled (2%)
            if day_offset == 1:
                status = random.choices(["booked", "completed", "no_show"], weights=[0.60, 0.35, 0.05])[0]
            else:
                status = random.choices(["completed", "no_show", "cancelled"], weights=[0.88, 0.09, 0.03])[0]
            
            hour = random.randint(9, 19)
            minute = random.choice([0, 15, 30, 45])
            scheduled_at = target_date.replace(hour=hour, minute=minute, second=0)
            booked_at = scheduled_at - timedelta(hours=random.randint(2, 72))
            completed_at = scheduled_at + timedelta(minutes=random.randint(20, 45)) if status == "completed" else None
            
            notes = ""
            if status == "completed":
                notes = random.choice([
                    "Patient presented with minor lethargy. Vital signs normal. Prescribed dietary supplement.",
                    "Routine checkup and physical exam. Coat and dental hygiene satisfactory.",
                    "Ear infection treated with topical antibacterial drops. Follow-up in 2 weeks.",
                    "Skin allergy flare-up. Recommended switch to hypoallergenic diet and medicated bath.",
                    "Post-op routine evaluation. Incision healing cleanly without erythema.",
                    "Vaccination booster administered. Patient well tolerated."
                ])

            appt_id = gen_uuid()
            appointments.append({
                "id": appt_id,
                "pet_id": pet["id"],
                "vet_id": vet["id"],
                "clinic_id": clinic_id,
                "service_type": service_type,
                "status": status,
                "booked_at": booked_at.isoformat(),
                "scheduled_at": scheduled_at.isoformat(),
                "completed_at": completed_at.isoformat() if completed_at else None,
                "notes": notes
            })

            # Prescription for completed appointments (~85% of consults)
            if status == "completed" and random.random() < 0.85:
                med, dos, dur = random.choice(MEDICATIONS)
                # 78% compliance (uploaded = true)
                uploaded = random.random() < 0.78
                uploaded_at = completed_at + timedelta(minutes=random.randint(5, 60)) if uploaded else None
                prescriptions.append({
                    "id": gen_uuid(),
                    "appointment_id": appt_id,
                    "vet_id": vet["id"],
                    "medication": med,
                    "dosage": dos,
                    "duration_days": dur,
                    "uploaded": uploaded,
                    "prescribed_at": completed_at.isoformat(),
                    "uploaded_at": uploaded_at.isoformat() if uploaded_at else None
                })

            # Referrals (~12% of appointments)
            if status == "completed" and random.random() < 0.12:
                to_clinic = random.choice([c for c in CLINICS if c["id"] != clinic_id])
                to_vets = [v for v in VETS if v["clinic_id"] == to_clinic["id"]]
                to_vet = random.choice(to_vets) if to_vets else random.choice(VETS)
                
                ref_time = completed_at
                # Target TAT avg ~3.1 hours, some breaches (>4h)
                tat_hours = round(random.expovariate(1 / 3.1), 1)
                if tat_hours < 0.5:
                    tat_hours = 0.8
                
                ref_status = "accepted" if random.random() < 0.85 else "referred"
                accepted_time = ref_time + timedelta(hours=tat_hours) if ref_status == "accepted" else None
                
                referrals.append({
                    "id": gen_uuid(),
                    "appointment_id": appt_id,
                    "from_vet_id": vet["id"],
                    "to_vet_id": to_vet["id"],
                    "to_clinic_id": to_clinic["id"],
                    "status": ref_status,
                    "referred_at": ref_time.isoformat(),
                    "accepted_at": accepted_time.isoformat() if accepted_time else None,
                    "completed_at": (accepted_time + timedelta(hours=random.randint(12, 48))).isoformat() if accepted_time and random.random() < 0.6 else None,
                    "reason": random.choice([
                        "Suspected ligament tear - specialist orthopedic evaluation requested.",
                        "Persistent cardiac murmur detected on auscultation. Echocardiogram recommended.",
                        "Chronic dermatological lesion unresponsive to first-line antibiotics.",
                        "Abdominal mass palpated. Oncology consultation required."
                    ])
                })

            # Payments for completed appointments
            if status == "completed":
                prices = {"teleconsult": 300, "clinic": 450, "home_visit": 650}
                amt = prices.get(service_type, 350)
                payments.append({
                    "id": gen_uuid(),
                    "appointment_id": appt_id,
                    "owner_id": pet["owner_id"],
                    "amount": amt,
                    "currency": "INR",
                    "status": "completed",
                    "paid_at": completed_at.isoformat()
                })

    print(f"Total Generated:")
    print(f"  Clinics: {len(CLINICS)}")
    print(f"  Vets: {len(VETS)}")
    print(f"  Owners: {len(owners)}")
    print(f"  Pets: {len(pets)}")
    print(f"  Appointments: {len(appointments)}")
    print(f"  Prescriptions: {len(prescriptions)}")
    print(f"  Referrals: {len(referrals)}")
    print(f"  Payments: {len(payments)}")

    # Write sql/04_seed_data.sql
    with open("C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/sql/04_seed_data.sql", "w", encoding="utf-8") as f:
        f.write("-- PawPulse Synthetic Seed Script\n")
        f.write("-- Auto-generated 5,000+ Clinical & Financial Records\n\n")

        # Clinics
        f.write("-- CLINICS\n")
        for c in CLINICS:
            f.write(f"INSERT INTO clinics (id, name, city, state, type) VALUES ('{c['id']}', '{c['name']}', '{c['city']}', '{c['state']}', '{c['type']}');\n")
        f.write("\n")

        # Vets
        f.write("-- VETS\n")
        for v in VETS:
            f.write(f"INSERT INTO vets (id, clinic_id, name, email, specialization, password_hash, rating) VALUES ('{v['id']}', '{v['clinic_id']}', '{v['name']}', '{v['email']}', '{v['spec']}', '$2a$10$demoHashVet12345678901234567890', {v['rating']});\n")
        f.write("\n")

        # Owners
        f.write("-- OWNERS\n")
        for o in owners:
            f.write(f"INSERT INTO owners (id, name, email, phone, password_hash, city, state, created_at) VALUES ('{o['id']}', '{o['name']}', '{o['email']}', '{o['phone']}', '{o['password_hash']}', '{o['city']}', '{o['state']}', '{o['created_at']}');\n")
        f.write("\n")

        # Pets
        f.write("-- PETS\n")
        for p in pets:
            f.write(f"INSERT INTO pets (id, owner_id, name, species, breed, dob, weight_kg, created_at) VALUES ('{p['id']}', '{p['owner_id']}', '{p['name']}', '{p['species']}', '{p['breed']}', '{p['dob']}', {p['weight_kg']}, '{p['created_at']}');\n")
        f.write("\n")

        # Appointments
        f.write("-- APPOINTMENTS\n")
        for a in appointments:
            comp_sql = f"'{a['completed_at']}'" if a['completed_at'] else "NULL"
            note_esc = a['notes'].replace("'", "''")
            f.write(f"INSERT INTO appointments (id, pet_id, vet_id, clinic_id, service_type, status, booked_at, scheduled_at, completed_at, notes) VALUES ('{a['id']}', '{a['pet_id']}', '{a['vet_id']}', '{a['clinic_id']}', '{a['service_type']}', '{a['status']}', '{a['booked_at']}', '{a['scheduled_at']}', {comp_sql}, '{note_esc}');\n")
        f.write("\n")

        # Prescriptions
        f.write("-- PRESCRIPTIONS\n")
        for pr in prescriptions:
            up_sql = f"'{pr['uploaded_at']}'" if pr['uploaded_at'] else "NULL"
            f.write(f"INSERT INTO prescriptions (id, appointment_id, vet_id, medication, dosage, duration_days, uploaded, prescribed_at, uploaded_at) VALUES ('{pr['id']}', '{pr['appointment_id']}', '{pr['vet_id']}', '{pr['medication']}', '{pr['dosage']}', {pr['duration_days']}, {str(pr['uploaded']).upper()}, '{pr['prescribed_at']}', {up_sql});\n")
        f.write("\n")

        # Referrals
        f.write("-- REFERRALS\n")
        for r in referrals:
            acc_sql = f"'{r['accepted_at']}'" if r['accepted_at'] else "NULL"
            comp_r_sql = f"'{r['completed_at']}'" if r['completed_at'] else "NULL"
            reason_esc = r['reason'].replace("'", "''")
            f.write(f"INSERT INTO referrals (id, appointment_id, from_vet_id, to_vet_id, to_clinic_id, status, referred_at, accepted_at, completed_at, reason) VALUES ('{r['id']}', '{r['appointment_id']}', '{r['from_vet_id']}', '{r['to_vet_id']}', '{r['to_clinic_id']}', '{r['status']}', '{r['referred_at']}', {acc_sql}, {comp_r_sql}, '{reason_esc}');\n")
        f.write("\n")

        # Payments
        f.write("-- PAYMENTS\n")
        for pay in payments:
            f.write(f"INSERT INTO payments (id, appointment_id, owner_id, amount, currency, status, paid_at) VALUES ('{pay['id']}', '{pay['appointment_id']}', '{pay['owner_id']}', {pay['amount']}, '{pay['currency']}', '{pay['status']}', '{pay['paid_at']}');\n")
        f.write("\n")

    print("Wrote sql/04_seed_data.sql successfully!")

    # Write compact seed for Spring Boot H2 dev mode
    with open("C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/backend/src/main/resources/data.sql", "w", encoding="utf-8") as f:
        f.write("-- Spring Boot Dev Initializer Seed\n")
        # Write clinics & vets & owners & sample pets/appointments (top 300)
        for c in CLINICS:
            f.write(f"INSERT INTO clinics (id, name, city, state, type) VALUES ('{c['id']}', '{c['name']}', '{c['city']}', '{c['state']}', '{c['type']}');\n")
        for v in VETS:
            f.write(f"INSERT INTO vets (id, clinic_id, name, email, specialization, password_hash, rating) VALUES ('{v['id']}', '{v['clinic_id']}', '{v['name']}', '{v['email']}', '{v['spec']}', '$2a$10$demoHashVet12345678901234567890', {v['rating']});\n")
        for o in owners[:50]:
            f.write(f"INSERT INTO owners (id, name, email, phone, password_hash, city, state, created_at) VALUES ('{o['id']}', '{o['name']}', '{o['email']}', '{o['phone']}', '{o['password_hash']}', '{o['city']}', '{o['state']}', '{o['created_at']}');\n")
        for p in pets[:80]:
            f.write(f"INSERT INTO pets (id, owner_id, name, species, breed, dob, weight_kg, created_at) VALUES ('{p['id']}', '{p['owner_id']}', '{p['name']}', '{p['species']}', '{p['breed']}', '{p['dob']}', {p['weight_kg']}, '{p['created_at']}');\n")
        for a in appointments[:300]:
            comp_sql = f"'{a['completed_at']}'" if a['completed_at'] else "NULL"
            note_esc = a['notes'].replace("'", "''")
            f.write(f"INSERT INTO appointments (id, pet_id, vet_id, clinic_id, service_type, status, booked_at, scheduled_at, completed_at, notes) VALUES ('{a['id']}', '{a['pet_id']}', '{a['vet_id']}', '{a['clinic_id']}', '{a['service_type']}', '{a['status']}', '{a['booked_at']}', '{a['scheduled_at']}', {comp_sql}, '{note_esc}');\n")
        for pr in prescriptions[:200]:
            up_sql = f"'{pr['uploaded_at']}'" if pr['uploaded_at'] else "NULL"
            f.write(f"INSERT INTO prescriptions (id, appointment_id, vet_id, medication, dosage, duration_days, uploaded, prescribed_at, uploaded_at) VALUES ('{pr['id']}', '{pr['appointment_id']}', '{pr['vet_id']}', '{pr['medication']}', '{pr['dosage']}', {pr['duration_days']}, {str(pr['uploaded']).upper()}, '{pr['prescribed_at']}', {up_sql});\n")
        for r in referrals[:50]:
            acc_sql = f"'{r['accepted_at']}'" if r['accepted_at'] else "NULL"
            comp_r_sql = f"'{r['completed_at']}'" if r['completed_at'] else "NULL"
            reason_esc = r['reason'].replace("'", "''")
            f.write(f"INSERT INTO referrals (id, appointment_id, from_vet_id, to_vet_id, to_clinic_id, status, referred_at, accepted_at, completed_at, reason) VALUES ('{r['id']}', '{r['appointment_id']}', '{r['from_vet_id']}', '{r['to_vet_id']}', '{r['to_clinic_id']}', '{r['status']}', '{r['referred_at']}', {acc_sql}, {comp_r_sql}, '{reason_esc}');\n")
        for pay in payments[:250]:
            f.write(f"INSERT INTO payments (id, appointment_id, owner_id, amount, currency, status, paid_at) VALUES ('{pay['id']}', '{pay['appointment_id']}', '{pay['owner_id']}', {pay['amount']}, '{pay['currency']}', '{pay['status']}', '{pay['paid_at']}');\n")
    print("Wrote backend/src/main/resources/data.sql successfully!")

if __name__ == "__main__":
    main()
