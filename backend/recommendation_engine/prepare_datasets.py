"""
Dataset preparation script for Shakti Platform Hybrid Recommendation Engine.
- Loads smartduketech/indian-government-schemes-2025 (4,693 records).
- Generates curated Indian jobs dataset with full schema (skills, location, salary, eligibility).
- Generates curated Indian courses dataset with full schema (skills, provider, mode, certification).
- Saves standardized JSON and CSV files for ingestion and real-time recommendation.
"""

import os
import json
import pandas as pd
import numpy as np
from datasets import load_dataset

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
OFFICIAL_DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "data", "official"))

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(os.path.join(OFFICIAL_DATA_DIR, "schemes"), exist_ok=True)
os.makedirs(os.path.join(OFFICIAL_DATA_DIR, "jobs"), exist_ok=True)
os.makedirs(os.path.join(OFFICIAL_DATA_DIR, "courses"), exist_ok=True)

def prepare_schemes():
    print("Loading smartduketech/indian-government-schemes-2025...")
    dataset = load_dataset("smartduketech/indian-government-schemes-2025")
    df = dataset["train"].to_pandas()
    print(f"Loaded {len(df)} schemes with {len(df.columns)} columns.")

    # Clean text columns as done in Step 10
    text_columns = [
        "name", "description", "ministry", "department",
        "category", "beneficiary_type", "benefits", "eligibility_text"
    ]
    for col in text_columns:
        if col in df.columns:
            df[col] = df[col].fillna("")

    df["combined_text"] = df[text_columns].astype(str).agg(" ".join, axis=1)

    # Save to json & csv
    schemes_json_path = os.path.join(DATA_DIR, "schemes.json")
    schemes_csv_path = os.path.join(DATA_DIR, "schemes.csv")
    official_schemes_json = os.path.join(OFFICIAL_DATA_DIR, "schemes", "indian_government_schemes_2025.json")

    df.to_json(schemes_json_path, orient="records", force_ascii=False)
    df.to_csv(schemes_csv_path, index=False)
    df.to_json(official_schemes_json, orient="records", force_ascii=False)
    print(f"Saved schemes to {schemes_json_path}")
    return df

def prepare_jobs():
    print("Generating comprehensive Indian jobs dataset...")
    # Curated Indian jobs across all key sectors relevant to women empowerment & rural livelihoods
    jobs_data = [
        {
            "id": "job_001",
            "title": "Tailoring and Garment Production Supervisor",
            "company": "Mahila Vikas Udyog",
            "description": "Supervise rural women tailoring self-help groups, organize pattern making, cutting, stitching quality control, and garment finishing for export orders.",
            "category": "Tailoring",
            "skills_required": ["Sewing", "Embroidery", "Pattern Making", "Quality Control", "Team Management"],
            "education_required": "Secondary (Class 9-10)",
            "work_mode": "onsite",
            "location_state": "Maharashtra",
            "location_district": "Pune",
            "salary_min": 12000,
            "salary_max": 18000,
            "eligibility_age_min": 20,
            "eligibility_age_max": 50,
            "eligibility_gender": "female",
            "eligibility_income_max": 300000,
            "eligibility_state": "['Maharashtra', 'All']",
            "seats": 5
        },
        {
            "id": "job_002",
            "title": "Digital Marketing & Social Commerce Assistant",
            "company": "Rural Artisans Craft Connect",
            "description": "Assist rural artisan groups and handloom weavers in cataloging products, managing WhatsApp Business, Instagram store, and online order processing.",
            "category": "IT",
            "skills_required": ["Digital Marketing", "Social Media", "Computer Basics", "MS Office", "Customer Service"],
            "education_required": "Higher Secondary (Class 11-12)",
            "work_mode": "remote",
            "location_state": "All",
            "location_district": "Remote",
            "salary_min": 14000,
            "salary_max": 22000,
            "eligibility_age_min": 18,
            "eligibility_age_max": 40,
            "eligibility_gender": "all",
            "eligibility_income_max": 350000,
            "eligibility_state": "['All']",
            "seats": 10
        },
        {
            "id": "job_003",
            "title": "Organic Agriculture & SHG Field Facilitator",
            "company": "Kisan Pragati Federation",
            "description": "Guide women farmer producer organizations (FPOs) in organic fertilizer preparation, crop rotation, soil health testing, and government subsidy paperwork.",
            "category": "Agriculture",
            "skills_required": ["Farming", "Organic Agriculture", "Community Mobilization", "Record Keeping"],
            "education_required": "Secondary (Class 9-10)",
            "work_mode": "onsite",
            "location_state": "Uttar Pradesh",
            "location_district": "Varanasi",
            "salary_min": 9000,
            "salary_max": 14000,
            "eligibility_age_min": 21,
            "eligibility_age_max": 55,
            "eligibility_gender": "all",
            "eligibility_income_max": 250000,
            "eligibility_state": "['Uttar Pradesh', 'Bihar']",
            "seats": 8
        },
        {
            "id": "job_004",
            "title": "Community Health Educator (ASHA Facilitator)",
            "company": "Swasthya Kalyan Trust",
            "description": "Conduct maternal and child health awareness drives, coordinate village health days, assist in immunization drives and maternal nutrition counseling.",
            "category": "Healthcare",
            "skills_required": ["Healthcare", "Maternal Care", "First Aid", "Communication", "Counseling"],
            "education_required": "Secondary (Class 9-10)",
            "work_mode": "onsite",
            "location_state": "Rajasthan",
            "location_district": "Jaipur",
            "salary_min": 8500,
            "salary_max": 12500,
            "eligibility_age_min": 25,
            "eligibility_age_max": 50,
            "eligibility_gender": "female",
            "eligibility_income_max": 200000,
            "eligibility_state": "['Rajasthan', 'Haryana']",
            "seats": 12
        },
        {
            "id": "job_005",
            "title": "Remote Data Entry & Document Verifier",
            "company": "Digital Bharat Services",
            "description": "Enter surveyed census and scheme enrollment forms into government portals, verify documents, and generate beneficiary reports.",
            "category": "IT",
            "skills_required": ["Data Entry", "Computer Basics", "MS Office", "Typing", "Attention to Detail"],
            "education_required": "Higher Secondary (Class 11-12)",
            "work_mode": "remote",
            "location_state": "All",
            "location_district": "Remote",
            "salary_min": 10000,
            "salary_max": 16000,
            "eligibility_age_min": 18,
            "eligibility_age_max": 45,
            "eligibility_gender": "all",
            "eligibility_income_max": 300000,
            "eligibility_state": "['All']",
            "seats": 25
        },
        {
            "id": "job_006",
            "title": "Traditional Handicraft Designer & Trainer",
            "company": "Hastkala Vikas Kendra",
            "description": "Design modern handicraft products using traditional block print, zardozi embroidery, jute craft, and terracotta. Train women in SHGs for bulk production.",
            "category": "Handicrafts",
            "skills_required": ["Handicrafts", "Embroidery", "Textile Design", "Art & Craft", "Training"],
            "education_required": "No Formal Education",
            "work_mode": "onsite",
            "location_state": "Gujarat",
            "location_district": "Ahmedabad",
            "salary_min": 11000,
            "salary_max": 17000,
            "eligibility_age_min": 18,
            "eligibility_age_max": 60,
            "eligibility_gender": "female",
            "eligibility_income_max": 250000,
            "eligibility_state": "['Gujarat', 'Rajasthan', 'Madhya Pradesh']",
            "seats": 6
        },
        {
            "id": "job_007",
            "title": "Village Banking Correspondent & Financial Counselor",
            "company": "Grameen Microfinance Corporation",
            "description": "Assist rural citizens with Aadhaar Enabled Payment System (AEPS), micro-deposits, micro-insurance enrollments, and SHG bank linkages.",
            "category": "Finance",
            "skills_required": ["Mobile Banking", "Accounting", "Customer Service", "Financial Literacy", "Basic Math"],
            "education_required": "Higher Secondary (Class 11-12)",
            "work_mode": "onsite",
            "location_state": "Madhya Pradesh",
            "location_district": "Bhopal",
            "salary_min": 10500,
            "salary_max": 15000,
            "eligibility_age_min": 21,
            "eligibility_age_max": 45,
            "eligibility_gender": "all",
            "eligibility_income_max": 250000,
            "eligibility_state": "['Madhya Pradesh', 'Chhattisgarh']",
            "seats": 15
        },
        {
            "id": "job_008",
            "title": "Early Childhood Education Teacher (Balwadi)",
            "company": "Nanhi Kali Educational Society",
            "description": "Teach foundational literacy and numeracy to rural preschool children using activity-based learning, storytelling, and phonetics in mother tongue.",
            "category": "Education",
            "skills_required": ["Teaching", "Child Psychology", "Storytelling", "Classroom Management"],
            "education_required": "Secondary (Class 9-10)",
            "work_mode": "onsite",
            "location_state": "Tamil Nadu",
            "location_district": "Madurai",
            "salary_min": 9000,
            "salary_max": 13000,
            "eligibility_age_min": 20,
            "eligibility_age_max": 45,
            "eligibility_gender": "female",
            "eligibility_income_max": 250000,
            "eligibility_state": "['Tamil Nadu', 'Karnataka', 'Kerala']",
            "seats": 10
        },
        {
            "id": "job_009",
            "title": "Food Processing & Quality Technician",
            "company": "Shree Ann Millet Producers Consortium",
            "description": "Oversee packaging, dehydration, grading, and FSSAI standard compliance for millet flours, cookies, and organic snacks produced by women SHGs.",
            "category": "Food Processing",
            "skills_required": ["Food Processing", "Cooking", "Quality Control", "Packaging", "Hygiene Standards"],
            "education_required": "Secondary (Class 9-10)",
            "work_mode": "onsite",
            "location_state": "Karnataka",
            "location_district": "Bengaluru Rural",
            "salary_min": 11000,
            "salary_max": 16500,
            "eligibility_age_min": 18,
            "eligibility_age_max": 50,
            "eligibility_gender": "all",
            "eligibility_income_max": 300000,
            "eligibility_state": "['Karnataka', 'Andhra Pradesh']",
            "seats": 7
        },
        {
            "id": "job_010",
            "title": "Solar Lighting & Home Appliance Repair Technician",
            "company": "Surya Shakti Renewable Energy",
            "description": "Installation, inspection, and maintenance of decentralized rooftop solar home systems, LED bulbs, and solar water heaters in rural households.",
            "category": "Technical",
            "skills_required": ["Solar Equipment Maintenance", "Electrical Basics", "Troubleshooting", "Tools Handling"],
            "education_required": "Secondary (Class 9-10)",
            "work_mode": "onsite",
            "location_state": "Jharkhand",
            "location_district": "Ranchi",
            "salary_min": 12500,
            "salary_max": 19000,
            "eligibility_age_min": 19,
            "eligibility_age_max": 42,
            "eligibility_gender": "all",
            "eligibility_income_max": 250000,
            "eligibility_state": "['Jharkhand', 'Odisha', 'West Bengal']",
            "seats": 12
        },
        {
            "id": "job_011",
            "title": "E-Commerce Customer Support & Order Coordinator",
            "company": "Kala Gram Handicrafts Marketplace",
            "description": "Respond to inbound customer inquiries in regional languages, coordinate shipment dispatch with courier partners, and handle return requests.",
            "category": "Retail",
            "skills_required": ["Customer Service", "Computer Basics", "Communication", "Conflict Resolution"],
            "education_required": "Higher Secondary (Class 11-12)",
            "work_mode": "remote",
            "location_state": "All",
            "location_district": "Remote",
            "salary_min": 13000,
            "salary_max": 18500,
            "eligibility_age_min": 18,
            "eligibility_age_max": 45,
            "eligibility_gender": "all",
            "eligibility_income_max": 350000,
            "eligibility_state": "['All']",
            "seats": 14
        },
        {
            "id": "job_012",
            "title": "Dairy Cooperative Operations Assistant",
            "company": "Gramodaya Milk Producers Union",
            "description": "Operate automated milk fat testing machines, log daily milk intake weights, issue member receipt slips, and manage cold storage logistics.",
            "category": "Agriculture",
            "skills_required": ["Dairy Farming", "Record Keeping", "Basic Math", "Equipment Handling"],
            "education_required": "Primary (Class 1-5)",
            "work_mode": "onsite",
            "location_state": "Punjab",
            "location_district": "Ludhiana",
            "salary_min": 10000,
            "salary_max": 14000,
            "eligibility_age_min": 21,
            "eligibility_age_max": 55,
            "eligibility_gender": "all",
            "eligibility_income_max": 250000,
            "eligibility_state": "['Punjab', 'Haryana']",
            "seats": 9
        },
        {
            "id": "job_013",
            "title": "Eco-Tourism Guest House & Homestay Coordinator",
            "company": "Pahadi Heritage Homestays",
            "description": "Manage homestay guest bookings, coordinate local organic cuisine preparation, arrange village cultural tours and handicraft workshops for tourists.",
            "category": "Hospitality",
            "skills_required": ["Tourism", "Hospitality", "Cooking", "Communication", "Customer Relations"],
            "education_required": "Secondary (Class 9-10)",
            "work_mode": "onsite",
            "location_state": "Uttarakhand",
            "location_district": "Dehradun",
            "salary_min": 11000,
            "salary_max": 17000,
            "eligibility_age_min": 20,
            "eligibility_age_max": 50,
            "eligibility_gender": "all",
            "eligibility_income_max": 300000,
            "eligibility_state": "['Uttarakhand', 'Himachal Pradesh']",
            "seats": 6
        },
        {
            "id": "job_014",
            "title": "Poultry & Goat Farming Enterprise Assistant",
            "company": "Samriddhi Livestock Cooperative",
            "description": "Assist in poultry brooding management, vaccination schedules, feed preparation, and wholesale sales tracking for women micro-entrepreneurs.",
            "category": "Agriculture",
            "skills_required": ["Livestock Farming", "Farming", "Animal Health", "Record Keeping"],
            "education_required": "No Formal Education",
            "work_mode": "onsite",
            "location_state": "Odisha",
            "location_district": "Bhubaneswar",
            "salary_min": 8000,
            "salary_max": 12000,
            "eligibility_age_min": 18,
            "eligibility_age_max": 60,
            "eligibility_gender": "all",
            "eligibility_income_max": 200000,
            "eligibility_state": "['Odisha', 'West Bengal']",
            "seats": 8
        },
        {
            "id": "job_015",
            "title": "IT Lab Assistant & Basic Computer Instructor",
            "company": "Pratham Digital Saksharta Mission",
            "description": "Assist rural students and women learners during hands-on lab hours, teach typing, internet navigation, and assist in online certifications.",
            "category": "IT",
            "skills_required": ["Computer Basics", "MS Office", "Teaching", "Internet", "Hardware Troubleshooting"],
            "education_required": "Higher Secondary (Class 11-12)",
            "work_mode": "onsite",
            "location_state": "Bihar",
            "location_district": "Patna",
            "salary_min": 9500,
            "salary_max": 14500,
            "eligibility_age_min": 19,
            "eligibility_age_max": 38,
            "eligibility_gender": "all",
            "eligibility_income_max": 250000,
            "eligibility_state": "['Bihar', 'Jharkhand', 'Uttar Pradesh']",
            "seats": 10
        }
    ]

    df_jobs = pd.DataFrame(jobs_data)

    # Build combined_text for Jobs
    text_cols = ["title", "company", "description", "category", "education_required", "work_mode", "location_state"]
    for col in text_cols:
        df_jobs[col] = df_jobs[col].fillna("")
    
    df_jobs["skills_str"] = df_jobs["skills_required"].apply(lambda s: " ".join(s) if isinstance(s, list) else str(s))
    df_jobs["combined_text"] = df_jobs[text_cols].astype(str).agg(" ".join, axis=1) + " " + df_jobs["skills_str"]

    jobs_json_path = os.path.join(DATA_DIR, "jobs.json")
    jobs_csv_path = os.path.join(DATA_DIR, "jobs.csv")
    official_jobs_json = os.path.join(OFFICIAL_DATA_DIR, "jobs", "jobs_dataset.json")

    df_jobs.to_json(jobs_json_path, orient="records", force_ascii=False)
    df_jobs.to_csv(jobs_csv_path, index=False)
    df_jobs.to_json(official_jobs_json, orient="records", force_ascii=False)
    print(f"Saved {len(df_jobs)} jobs to {jobs_json_path}")
    return df_jobs

def prepare_courses():
    print("Generating comprehensive Indian courses dataset...")
    courses_data = [
        {
            "id": "crs_001",
            "title": "NSDC Certified Professional Tailoring & Garment Construction",
            "provider": "National Skill Development Corporation (NSDC)",
            "description": "Complete professional certificate course covering measurement, industrial machine operation, pattern grading, western & traditional garment tailoring, and enterprise startup.",
            "category": "Tailoring",
            "skills_taught": ["Sewing", "Embroidery", "Pattern Making", "Fashion Design", "Machine Maintenance"],
            "duration": "12 weeks",
            "mode": "offline",
            "language": ["Hindi", "Marathi", "English"],
            "certification": True,
            "is_free": True,
            "fee": 0,
            "location_state": "Maharashtra",
            "location_district": "Pune",
            "eligibility_age_min": 16,
            "eligibility_age_max": 55,
            "eligibility_gender": "female",
            "seats": 30
        },
        {
            "id": "crs_002",
            "title": "Digital Literacy, Smartphone Banking & UPI Essentials",
            "provider": "Pradhan Mantri Gramin Digital Saksharta Abhiyan (PMGDISHA)",
            "description": "Government accredited foundation course in smartphone handling, UPI payments, BHIM, digilocker, safety against cyber fraud, and online public services access.",
            "category": "Digital Literacy",
            "skills_taught": ["Computer Basics", "Mobile Banking", "Digital Marketing", "Cyber Safety"],
            "duration": "2 weeks",
            "mode": "online",
            "language": ["Hindi", "English", "Marathi", "Telugu", "Tamil", "Bengali"],
            "certification": True,
            "is_free": True,
            "fee": 0,
            "location_state": "All",
            "location_district": "Online",
            "eligibility_age_min": 14,
            "eligibility_age_max": 65,
            "eligibility_gender": "all",
            "seats": 1000
        },
        {
            "id": "crs_003",
            "title": "Micro-Enterprise Incubation & Business Startup for Women",
            "provider": "National Institute of Micro, Small and Medium Enterprises (NI-MSME)",
            "description": "Comprehensive entrepreneurship curriculum: identifying business ideas, Mudra loan applications, cash flow management, pricing, packaging, and marketing via SHG federations.",
            "category": "Finance",
            "skills_taught": ["Accounting", "Digital Marketing", "Business Planning", "Financial Literacy"],
            "duration": "6 weeks",
            "mode": "hybrid",
            "language": ["Hindi", "English"],
            "certification": True,
            "is_free": True,
            "fee": 0,
            "location_state": "All",
            "location_district": "All",
            "eligibility_age_min": 18,
            "eligibility_age_max": 60,
            "eligibility_gender": "female",
            "seats": 250
        },
        {
            "id": "crs_004",
            "title": "Organic Farming, Bio-Fertilizers & Kitchen Garden Management",
            "provider": "ICAR - Krishi Vigyan Kendra",
            "description": "Practical training in vermicomposting, zero-budget natural farming, organic pest management, drip irrigation setup, and selling organic produce at farmers markets.",
            "category": "Agriculture",
            "skills_taught": ["Farming", "Organic Agriculture", "Soil Health", "Water Conservation"],
            "duration": "4 weeks",
            "mode": "offline",
            "language": ["Hindi", "Bengali", "Bhojpuri"],
            "certification": True,
            "is_free": True,
            "fee": 0,
            "location_state": "Uttar Pradesh",
            "location_district": "Varanasi",
            "eligibility_age_min": 18,
            "eligibility_age_max": 65,
            "eligibility_gender": "all",
            "seats": 40
        },
        {
            "id": "crs_005",
            "title": "Front-Office Data Entry, MS Office & Business Communication",
            "provider": "Skill India Mission",
            "description": "Intensive hands-on training in fast touch-typing, Microsoft Word, Excel spreadsheets, Google Workspace, email etiquette, and remote office coordination.",
            "category": "IT",
            "skills_taught": ["Data Entry", "MS Office", "Computer Basics", "Communication"],
            "duration": "8 weeks",
            "mode": "online",
            "language": ["Hindi", "English"],
            "certification": True,
            "is_free": False,
            "fee": 350,
            "location_state": "All",
            "location_district": "Online",
            "eligibility_age_min": 16,
            "eligibility_age_max": 40,
            "eligibility_gender": "all",
            "seats": 150
        },
        {
            "id": "crs_006",
            "title": "Traditional Block Printing, Natural Dyeing & Textile Crafts",
            "provider": "National Institute of Design & Development",
            "description": "Learn ancestral wooden block printing techniques, vegetable and eco-friendly dyeing, fabric preparation, and design contemporary scarves, sarees, and home linen.",
            "category": "Handicrafts",
            "skills_taught": ["Handicrafts", "Embroidery", "Dyeing", "Textile Design"],
            "duration": "6 weeks",
            "mode": "offline",
            "language": ["Hindi", "Gujarati"],
            "certification": True,
            "is_free": True,
            "fee": 0,
            "location_state": "Gujarat",
            "location_district": "Ahmedabad",
            "eligibility_age_min": 16,
            "eligibility_age_max": 60,
            "eligibility_gender": "female",
            "seats": 25
        },
        {
            "id": "crs_007",
            "title": "Community Nursing Assistant & Maternal Child Care Training",
            "provider": "Red Cross & National Health Mission",
            "description": "First aid, patient hygiene, temperature and blood pressure monitoring, maternal post-natal care, elder care assistance, and emergency response in rural communities.",
            "category": "Healthcare",
            "skills_taught": ["Healthcare", "First Aid", "Maternal Care", "Patient Assistance"],
            "duration": "16 weeks",
            "mode": "offline",
            "language": ["Hindi", "English"],
            "certification": True,
            "is_free": True,
            "fee": 0,
            "location_state": "Rajasthan",
            "location_district": "Jaipur",
            "eligibility_age_min": 18,
            "eligibility_age_max": 45,
            "eligibility_gender": "female",
            "seats": 35
        },
        {
            "id": "crs_008",
            "title": "Millet Value Addition, Bakery & Food Processing Certification",
            "provider": "Central Food Technological Research Institute (CFTRI)",
            "description": "Processing ragi, jowar, and bajra into value-added baked products, extrusion snacks, shelf-life extension techniques, nutritional labeling, and food safety hygiene.",
            "category": "Food Processing",
            "skills_taught": ["Food Processing", "Cooking", "Packaging", "Quality Control"],
            "duration": "5 weeks",
            "mode": "offline",
            "language": ["Kannada", "Hindi", "English"],
            "certification": True,
            "is_free": False,
            "fee": 499,
            "location_state": "Karnataka",
            "location_district": "Bengaluru",
            "eligibility_age_min": 18,
            "eligibility_age_max": 55,
            "eligibility_gender": "all",
            "seats": 30
        },
        {
            "id": "crs_009",
            "title": "Social Media Marketing & E-Commerce Store Management",
            "provider": "Google Digital Unlocked & NSDC",
            "description": "Learn to photograph handcrafted products with smartphone, write captivating captions, setup Amazon Karigar/Flipkart Samarth accounts, and run Facebook ad campaigns.",
            "category": "IT",
            "skills_taught": ["Digital Marketing", "Social Media", "Photography", "Customer Service"],
            "duration": "4 weeks",
            "mode": "online",
            "language": ["Hindi", "English", "Tamil", "Telugu"],
            "certification": True,
            "is_free": True,
            "fee": 0,
            "location_state": "All",
            "location_district": "Online",
            "eligibility_age_min": 16,
            "eligibility_age_max": 50,
            "eligibility_gender": "all",
            "seats": 500
        },
        {
            "id": "crs_010",
            "title": "Solar Photovoltaic Rooftop Technician (Surya Mitra)",
            "provider": "Skill Council for Green Jobs (SCGJ)",
            "description": "Hands-on training in solar panel alignment, battery bank wiring, inverters, safety gear, multimeter testing, and routine maintenance of solar off-grid setups.",
            "category": "Technical",
            "skills_taught": ["Solar Equipment Maintenance", "Electrical Basics", "Troubleshooting"],
            "duration": "12 weeks",
            "mode": "offline",
            "language": ["Hindi", "English"],
            "certification": True,
            "is_free": True,
            "fee": 0,
            "location_state": "Jharkhand",
            "location_district": "Ranchi",
            "eligibility_age_min": 18,
            "eligibility_age_max": 35,
            "eligibility_gender": "all",
            "seats": 30
        },
        {
            "id": "crs_011",
            "title": "Rural Homestay Management & Eco-Tourism Host Essentials",
            "provider": "Ministry of Tourism & Incredible India",
            "description": "Hospitality standards, bed and breakfast setup, hygienic food preparation, storytelling for tourists, online reviews management, and safety protocols.",
            "category": "Hospitality",
            "skills_taught": ["Hospitality", "Tourism", "Communication", "Cooking"],
            "duration": "3 weeks",
            "mode": "hybrid",
            "language": ["Hindi", "English"],
            "certification": True,
            "is_free": True,
            "fee": 0,
            "location_state": "Uttarakhand",
            "location_district": "Dehradun",
            "eligibility_age_min": 18,
            "eligibility_age_max": 60,
            "eligibility_gender": "all",
            "seats": 40
        },
        {
            "id": "crs_012",
            "title": "Modern Dairy Herd Health, Clean Milk Production & Silage",
            "provider": "National Dairy Development Board (NDDB)",
            "description": "Cattle nutrition, green fodder silage preparation, mastitis prevention, clean milking protocols, artificial insemination tracking, and disease signs.",
            "category": "Agriculture",
            "skills_taught": ["Dairy Farming", "Farming", "Animal Health"],
            "duration": "4 weeks",
            "mode": "offline",
            "language": ["Punjabi", "Hindi"],
            "certification": True,
            "is_free": True,
            "fee": 0,
            "location_state": "Punjab",
            "location_district": "Ludhiana",
            "eligibility_age_min": 18,
            "eligibility_age_max": 65,
            "eligibility_gender": "all",
            "seats": 35
        }
    ]

    df_crs = pd.DataFrame(courses_data)

    # Build combined_text for Courses
    text_cols = ["title", "provider", "description", "category", "duration", "mode"]
    for col in text_cols:
        df_crs[col] = df_crs[col].fillna("")
    
    df_crs["skills_str"] = df_crs["skills_taught"].apply(lambda s: " ".join(s) if isinstance(s, list) else str(s))
    df_crs["langs_str"] = df_crs["language"].apply(lambda l: " ".join(l) if isinstance(l, list) else str(l))
    df_crs["combined_text"] = df_crs[text_cols].astype(str).agg(" ".join, axis=1) + " " + df_crs["skills_str"] + " " + df_crs["langs_str"]

    courses_json_path = os.path.join(DATA_DIR, "courses.json")
    courses_csv_path = os.path.join(DATA_DIR, "courses.csv")
    official_courses_json = os.path.join(OFFICIAL_DATA_DIR, "courses", "courses_dataset.json")

    df_crs.to_json(courses_json_path, orient="records", force_ascii=False)
    df_crs.to_csv(courses_csv_path, index=False)
    df_crs.to_json(official_courses_json, orient="records", force_ascii=False)
    print(f"Saved {len(df_crs)} courses to {courses_json_path}")
    return df_crs

if __name__ == "__main__":
    schemes_df = prepare_schemes()
    jobs_df = prepare_jobs()
    courses_df = prepare_courses()
    print("\nAll 3 datasets prepared successfully!")
    print(f"   - Schemes: {len(schemes_df)} rows")
    print(f"   - Jobs:    {len(jobs_df)} rows")
    print(f"   - Courses: {len(courses_df)} rows")
