"""
Evaluation Script reproducing Steps 16–34 from the Research Notebook:
- Ground truth evaluation for 15 test users (U1 - U15)
- Precision@5, Recall@5, F1@5 computation
- Paired t-tests between Content-Based vs Hybrid models
- Hybrid weighting experiments (effect of alpha / beta weights)
"""

import sys
import numpy as np
import pandas as pd
from scipy.stats import ttest_rel
from engine import RecommendationEngine

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# 15 Test Users from Step 12 of Notebook
test_users = [
    {
        "user_id": "U1",
        "age": 25,
        "gender": "Female",
        "state": "Maharashtra",
        "income": 150000,
        "interest": "tailoring entrepreneurship skill development handicrafts"
    },
    {
        "user_id": "U2",
        "age": 30,
        "gender": "Female",
        "state": "Karnataka",
        "income": 200000,
        "interest": "entrepreneurship business startup financial assistance"
    },
    {
        "user_id": "U3",
        "age": 22,
        "gender": "Male",
        "state": "Tamil Nadu",
        "income": 100000,
        "interest": "education scholarship skill training employment"
    },
    {
        "user_id": "U4",
        "age": 35,
        "gender": "Female",
        "state": "Gujarat",
        "income": 250000,
        "interest": "handicrafts business marketing entrepreneurship"
    },
    {
        "user_id": "U5",
        "age": 28,
        "gender": "Male",
        "state": "Rajasthan",
        "income": 180000,
        "interest": "skill development employment vocational training"
    },
    {
        "user_id": "U6",
        "age": 40,
        "gender": "Female",
        "state": "Kerala",
        "income": 300000,
        "interest": "women entrepreneurship financial assistance business"
    },
    {
        "user_id": "U7",
        "age": 26,
        "gender": "Female",
        "state": "Madhya Pradesh",
        "income": 120000,
        "interest": "education scholarship skill development"
    },
    {
        "user_id": "U8",
        "age": 32,
        "gender": "Male",
        "state": "Goa",
        "income": 220000,
        "interest": "tourism handicrafts business entrepreneurship"
    },
    {
        "user_id": "U9",
        "age": 24,
        "gender": "Female",
        "state": "Odisha",
        "income": 90000,
        "interest": "employment training skill development"
    },
    {
        "user_id": "U10",
        "age": 29,
        "gender": "Male",
        "state": "Haryana",
        "income": 175000,
        "interest": "business entrepreneurship financial support startup"
    },
    {
        "user_id": "U11",
        "age": 45,
        "gender": "Female",
        "state": "Punjab",
        "income": 100000,
        "interest": "women welfare pension financial assistance"
    },
    {
        "user_id": "U12",
        "age": 19,
        "gender": "Male",
        "state": "West Bengal",
        "income": 80000,
        "interest": "student scholarship education training"
    },
    {
        "user_id": "U13",
        "age": 50,
        "gender": "Female",
        "state": "Maharashtra",
        "income": 350000,
        "interest": "women entrepreneurship business development"
    },
    {
        "user_id": "U14",
        "age": 27,
        "gender": "Male",
        "state": "Jharkhand",
        "income": 100000,
        "interest": "rural employment skill development training"
    },
    {
        "user_id": "U15",
        "age": 31,
        "gender": "Female",
        "state": "Uttarakhand",
        "income": 180000,
        "interest": "rural business entrepreneurship handicrafts"
    }
]

# Ground Truth Dictionary from Step 16 of Notebook
ground_truth = {
    "U1": [
        "Entrepreneurship and Skill Development Programme",
        "National Handicrafts Development Programme: Infrastructure And Technology Support: EMPORIA",
        "Comprehensive Handicrafts Cluster Development Scheme"
    ],
    "U2": [
        "Entrepreneurship and Skill Development Programme",
        "Skill Loan Scheme",
        "Credit Guarantee Scheme for Startups"
    ],
    "U3": [
        "National Action Plan for Skill Development of Persons with Disabilities",
        "Skill Loan Scheme",
        "Vocational Education and Training Loan Scheme"
    ],
    "U4": [
        "Comprehensive Handicrafts Cluster Development Scheme",
        "National Handicrafts Development Programme: Infrastructure And Technology Support: EMPORIA",
        "Financial Assistance for Setting Up of Sales Emporia by Industrial Associations, Handicrafts Societies and Re"
    ],
    "U5": [
        "Skill Loan Scheme",
        "Craftsmen Training Scheme",
        "Deen Dayal Upadhyay Grameen Kaushalya Yojana"
    ],
    "U6": [
        "Entrepreneurship and Skill Development Programme",
        "Women Self Employment Scheme",
        "Technology Development And Utilization Programme For Women"
    ],
    "U7": [
        "National Action Plan for Skill Development of Persons with Disabilities",
        "Skill Loan Scheme",
        "Building And Other Construction Scholarship"
    ],
    "U8": [
        "National Handicrafts Development Programme: Infrastructure And Technology Support: EMPORIA",
        "Comprehensive Handicrafts Cluster Development Scheme",
        "Investment Promotion Assistance To Setup Large/Mega/Ultra-Mega Tourism Projects"
    ],
    "U9": [
        "Deen Dayal Upadhyay Grameen Kaushalya Yojana",
        "Skill Loan Scheme",
        "Craftsmen Training Scheme"
    ],
    "U10": [
        "Entrepreneurship and Skill Development Programme",
        "Credit Guarantee Scheme for Startups",
        "Skill Loan Scheme"
    ],
    "U11": [
        "Women Self Employment Scheme",
        "Mahila Samriddhi Yojana",
        "Old Age Pension Scheme - Punjab"
    ],
    "U12": [
        "AICTE-Swanath Scholarship Scheme For Students",
        "Vocational Education Programme",
        "Skill Loan Scheme"
    ],
    "U13": [
        "Entrepreneurship and Skill Development Programme",
        "Women Self Employment Scheme",
        "Technology Development And Utilization Programme For Women"
    ],
    "U14": [
        "Deen Dayal Upadhyay Grameen Kaushalya Yojana",
        "Block Level Institute for Rural Skill Acquisition (BIRSA)",
        "Mukhymantri Sarthi Yojana - Jharkhand"
    ],
    "U15": [
        "Rural Business Incubators - Uttarakhand",
        "Mukhyamantri Swarozgar Yojana - Uttarakhand",
        "National Handicrafts Development Programme: Infrastructure And Technology Support: EMPORIA"
    ]
}

def precision_at_k(recommended_titles, relevant_schemes, k=5):
    top_k = recommended_titles[:k]
    matches = 0
    for rec in top_k:
        rec_clean = rec.strip().lower()
        if any(gt.strip().lower() in rec_clean or rec_clean in gt.strip().lower() for gt in relevant_schemes):
            matches += 1
    return matches / float(k)

def recall_at_k(recommended_titles, relevant_schemes, k=5):
    if len(relevant_schemes) == 0:
        return 0.0
    top_k = recommended_titles[:k]
    matches = 0
    for gt in relevant_schemes:
        gt_clean = gt.strip().lower()
        if any(gt_clean in rec.strip().lower() or rec.strip().lower() in gt_clean for rec in top_k):
            matches += 1
    return matches / float(len(relevant_schemes))

def f1_at_k(precision, recall):
    if precision + recall == 0:
        return 0.0
    return 2.0 * precision * recall / (precision + recall)

def run_evaluation():
    print("=" * 70)
    print("RUNNING RECOMMENDATION SYSTEM EVALUATION (Steps 16-34)")
    print("=" * 70)
    
    engine = RecommendationEngine()
    results = []

    for user in test_users:
        uid = user["user_id"]
        rel = ground_truth.get(uid, [])

        # Content-based only (weight: 1.0 content, 0.0 eligibility)
        content_recs = engine.recommend_schemes(user, top_n=10, content_weight=1.0, eligibility_weight=0.0)
        c_titles = [r["title"] for r in content_recs]
        c_p5 = precision_at_k(c_titles, rel, 5)
        c_r5 = recall_at_k(c_titles, rel, 5)
        c_f1 = f1_at_k(c_p5, c_r5)

        # Hybrid model (weight: 0.6 content, 0.4 eligibility)
        hybrid_recs = engine.recommend_schemes(user, top_n=10, content_weight=0.6, eligibility_weight=0.4)
        h_titles = [r["title"] for r in hybrid_recs]
        h_p5 = precision_at_k(h_titles, rel, 5)
        h_r5 = recall_at_k(h_titles, rel, 5)
        h_f1 = f1_at_k(h_p5, h_r5)

        results.append({
            "User": uid,
            "Content_Precision@5": c_p5,
            "Content_Recall@5": c_r5,
            "Content_F1@5": c_f1,
            "Hybrid_Precision@5": h_p5,
            "Hybrid_Recall@5": h_r5,
            "Hybrid_F1@5": h_f1
        })

    results_df = pd.DataFrame(results)
    print("\n--- INDIVIDUAL USER EVALUATION ---")
    print(results_df.to_string(index=False))

    avg_df = pd.DataFrame({
        "Metric": ["Precision@5", "Recall@5", "F1@5"],
        "Content-Based": [
            results_df["Content_Precision@5"].mean(),
            results_df["Content_Recall@5"].mean(),
            results_df["Content_F1@5"].mean()
        ],
        "Hybrid": [
            results_df["Hybrid_Precision@5"].mean(),
            results_df["Hybrid_Recall@5"].mean(),
            results_df["Hybrid_F1@5"].mean()
        ]
    })
    print("\n--- AVERAGE PERFORMANCE COMPARISON ---")
    print(avg_df.to_string(index=False))

    # Paired t-tests
    print("\n--- STATISTICAL TESTS (PAIRED T-TEST) ---")
    alpha = 0.05
    for metric in ["Precision@5", "Recall@5", "F1@5"]:
        c_col = f"Content_{metric}"
        h_col = f"Hybrid_{metric}"
        t_stat, p_val = ttest_rel(results_df[c_col], results_df[h_col])
        sig = p_val < alpha
        print(f"[{metric}] t-statistic: {t_stat:.4f} | p-value: {p_val:.4f} | Significant (p < 0.05): {sig}")

    # Step 29: Weight Experiments
    print("\n--- HYBRID WEIGHT EXPERIMENT (Step 29) ---")
    weights = [
        (1.0, 0.0),
        (0.8, 0.2),
        (0.6, 0.4),
        (0.4, 0.6),
        (0.2, 0.8)
    ]
    weight_results = []
    for c_w, e_w in weights:
        f1_scores = []
        for user in test_users:
            rel = ground_truth.get(user["user_id"], [])
            recs = engine.recommend_schemes(user, top_n=5, content_weight=c_w, eligibility_weight=e_w)
            titles = [r["title"] for r in recs]
            p5 = precision_at_k(titles, rel, 5)
            r5 = recall_at_k(titles, rel, 5)
            f1_scores.append(f1_at_k(p5, r5))
        
        weight_results.append({
            "Content Weight": c_w,
            "Eligibility Weight": e_w,
            "Mean F1@5": np.mean(f1_scores)
        })

    w_df = pd.DataFrame(weight_results)
    print(w_df.to_string(index=False))
    best_row = w_df.loc[w_df["Mean F1@5"].idxmax()]
    print(f"\n🏆 Best Hybrid Weight: Content={best_row['Content Weight']}, Eligibility={best_row['Eligibility Weight']} (Mean F1@5 = {best_row['Mean F1@5']:.4f})")
    print("=" * 70)

if __name__ == "__main__":
    run_evaluation()
