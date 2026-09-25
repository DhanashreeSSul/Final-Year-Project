"""
Core Hybrid Recommendation Engine for Shakti Platform.
Implements:
1. TF-IDF feature extraction on combined_text (stop_words='english', max_features=5000)
2. Cosine similarity calculation between user query/vector and item vectors
3. Multi-factor eligibility matching (Age, Gender, State, Income)
4. Hybrid Scoring: (0.6 * cosine_similarity + 0.4 * eligibility_score)
5. Filtering and ranking for Schemes (4,693 records), Jobs, and Courses
"""

import os
import sys
import ast
import json
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

def state_matches(value, user_state):
    """Checks if the user's state matches the eligibility state list or string."""
    if value is None or pd.isna(value) or str(value).strip().lower() in ["", "none", "nan", "null"]:
        return 1
    
    val_str = str(value).strip()
    states = []
    
    # Try literal eval for python list strings like "['Maharashtra', 'Gujarat']"
    if val_str.startswith("[") and val_str.endswith("]"):
        try:
            parsed = ast.literal_eval(val_str)
            if isinstance(parsed, list):
                states = parsed
            else:
                states = [parsed]
        except:
            try:
                states = json.loads(val_str)
            except:
                states = [s.strip().strip("'\"") for s in val_str[1:-1].split(",")]
    else:
        states = [val_str]
    
    states_clean = [str(s).strip().lower() for s in states if s is not None]
    u_state = str(user_state or "").strip().lower()
    
    if not u_state:
        return 1
    
    return int(
        "all" in states_clean or
        "india" in states_clean or
        "pan-india" in states_clean or
        "central" in states_clean or
        u_state in states_clean or
        any(u_state in s or s in u_state for s in states_clean)
    )

class RecommendationEngine:
    def __init__(self, data_dir=DATA_DIR):
        self.data_dir = data_dir
        self.schemes_df = None
        self.jobs_df = None
        self.courses_df = None

        self.schemes_vectorizer = None
        self.schemes_tfidf_matrix = None

        self.jobs_vectorizer = None
        self.jobs_tfidf_matrix = None

        self.courses_vectorizer = None
        self.courses_tfidf_matrix = None

        self.load_data()
        self.fit_models()

    def load_data(self):
        """Loads schemes, jobs, and courses datasets."""
        schemes_path = os.path.join(self.data_dir, "schemes.json")
        jobs_path = os.path.join(self.data_dir, "jobs.json")
        courses_path = os.path.join(self.data_dir, "courses.json")

        if os.path.exists(schemes_path):
            self.schemes_df = pd.read_json(schemes_path)
            print(f"[Engine] Loaded {len(self.schemes_df)} schemes")
        else:
            raise FileNotFoundError(f"Schemes dataset missing at {schemes_path}. Run prepare_datasets.py first.")

        if os.path.exists(jobs_path):
            self.jobs_df = pd.read_json(jobs_path)
            print(f"[Engine] Loaded {len(self.jobs_df)} jobs")
        else:
            raise FileNotFoundError(f"Jobs dataset missing at {jobs_path}.")

        if os.path.exists(courses_path):
            self.courses_df = pd.read_json(courses_path)
            print(f"[Engine] Loaded {len(self.courses_df)} courses")
        else:
            raise FileNotFoundError(f"Courses dataset missing at {courses_path}.")

    def fit_models(self):
        """Fits TF-IDF vectorizers on combined_text for all 3 datasets."""
        print("[Engine] Fitting TF-IDF Vectorizers...")
        # Schemes
        if "combined_text" not in self.schemes_df.columns:
            text_cols = ["name", "description", "ministry", "department", "category", "beneficiary_type", "benefits", "eligibility_text"]
            for c in text_cols:
                if c in self.schemes_df.columns:
                    self.schemes_df[c] = self.schemes_df[c].fillna("")
            self.schemes_df["combined_text"] = self.schemes_df[text_cols].astype(str).agg(" ".join, axis=1)

        self.schemes_vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        self.schemes_tfidf_matrix = self.schemes_vectorizer.fit_transform(self.schemes_df["combined_text"])

        # Jobs
        if "combined_text" not in self.jobs_df.columns:
            text_cols = ["title", "company", "description", "category", "work_mode", "location_state"]
            for c in text_cols:
                if c in self.jobs_df.columns:
                    self.jobs_df[c] = self.jobs_df[c].fillna("")
            self.jobs_df["combined_text"] = self.jobs_df[text_cols].astype(str).agg(" ".join, axis=1)

        self.jobs_vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        self.jobs_tfidf_matrix = self.jobs_vectorizer.fit_transform(self.jobs_df["combined_text"])

        # Courses
        if "combined_text" not in self.courses_df.columns:
            text_cols = ["title", "provider", "description", "category", "duration", "mode"]
            for c in text_cols:
                if c in self.courses_df.columns:
                    self.courses_df[c] = self.courses_df[c].fillna("")
            self.courses_df["combined_text"] = self.courses_df[text_cols].astype(str).agg(" ".join, axis=1)

        self.courses_vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        self.courses_tfidf_matrix = self.courses_vectorizer.fit_transform(self.courses_df["combined_text"])
        print("[Engine] TF-IDF vectorization complete.")

    def _extract_user_text(self, user):
        """Constructs an information-rich text string from user profile."""
        parts = []
        if user.get("interest"):
            parts.append(str(user["interest"]))
        if isinstance(user.get("interests"), list):
            parts.extend([str(i) for i in user["interests"]])
        if isinstance(user.get("skills"), list):
            parts.extend([str(s) for s in user["skills"]])
        if user.get("education"):
            parts.append(str(user["education"]))
        if user.get("category"):
            parts.append(str(user["category"]))
        return " ".join(parts).strip() or "rural livelihood skill education development"

    def calculate_scheme_eligibility(self, user):
        """Calculates multi-criteria eligibility for schemes as in notebook Step 13."""
        result = self.schemes_df.copy()
        user_age = user.get("age")
        user_income = user.get("income", 200000)
        user_gender = str(user.get("gender", "female")).strip().lower()
        user_state = str(user.get("state", "All")).strip()

        # Age match
        if user_age is not None and not pd.isna(user_age):
            user_age_num = float(user_age)
            age_min_ok = result["eligibility_age_min"].isna() | (user_age_num >= result["eligibility_age_min"])
            age_max_ok = result["eligibility_age_max"].isna() | (user_age_num <= result["eligibility_age_max"])
            age_match = (age_min_ok & age_max_ok).astype(int)
        else:
            age_match = pd.Series(1, index=result.index)

        # Income match
        if user_income is not None and not pd.isna(user_income):
            user_inc_num = float(user_income)
            income_match = (result["eligibility_income_max"].isna() | (user_inc_num <= result["eligibility_income_max"])).astype(int)
        else:
            income_match = pd.Series(1, index=result.index)

        # Gender match
        allowed_genders = ["all", "any", "female", "women", "woman"] if user_gender in ["female", "women", "woman"] else ["all", "any", user_gender]
        gender_match = (
            result["eligibility_gender"].isna() |
            result["eligibility_gender"].astype(str).str.lower().isin(allowed_genders)
        ).astype(int)

        # State match
        state_col = "eligibility_state" if "eligibility_state" in result.columns else "state"
        state_match = result[state_col].apply(lambda x: state_matches(x, user_state))

        result["age_match"] = age_match
        result["income_match"] = income_match
        result["gender_match"] = gender_match
        result["state_match"] = state_match

        # Eligibility score: average of all 4 criteria
        result["eligibility_score"] = (
            result["age_match"] +
            result["income_match"] +
            result["gender_match"] +
            result["state_match"]
        ) / 4.0

        result["fully_eligible"] = (
            (result["age_match"] == 1) &
            (result["income_match"] == 1) &
            (result["gender_match"] == 1) &
            (result["state_match"] == 1)
        ).astype(int)

        return result

    def recommend_schemes(self, user, top_n=10, content_weight=0.6, eligibility_weight=0.4, fully_eligible_only=False):
        """Generates hybrid recommendations for schemes."""
        result = self.calculate_scheme_eligibility(user)
        user_text = self._extract_user_text(user)
        user_vector = self.schemes_vectorizer.transform([user_text])
        similarity_scores = cosine_similarity(user_vector, self.schemes_tfidf_matrix)[0]

        result["cosine_similarity"] = similarity_scores
        result["hybrid_score"] = (
            content_weight * result["cosine_similarity"] +
            eligibility_weight * result["eligibility_score"]
        )

        candidates = result
        if fully_eligible_only:
            eligible_candidates = result[result["fully_eligible"] == 1]
            if len(eligible_candidates) >= top_n:
                candidates = eligible_candidates

        ranked = candidates.sort_values("hybrid_score", ascending=False).head(top_n).copy()

        # Build output records
        recommendations = []
        for _, row in ranked.iterrows():
            reasons = []
            if row["fully_eligible"] == 1:
                reasons.append("Fully Eligible")
            elif row["eligibility_score"] >= 0.75:
                reasons.append("High Eligibility")
            
            if row["cosine_similarity"] > 0.15:
                reasons.append("Matches Your Interests")
            
            if row.get("state") and str(row["state"]).lower() != "all":
                reasons.append(f"State: {row['state']}")

            record = {
                "id": str(row.get("id") or row.get("slug") or _),
                "title": row.get("name") or row.get("title") or "Government Scheme",
                "ministry": row.get("ministry") or row.get("department") or "Government of India",
                "category": row.get("category") or "General",
                "description": row.get("description") or "",
                "benefits": row.get("benefits") or "",
                "eligibility_criteria": row.get("eligibility_text") or row.get("eligibility_criteria") or "",
                "application_link": row.get("apply_url") or row.get("official_url") or row.get("application_link") or "",
                "state": row.get("state") or "All",
                "score": int(round(float(row["hybrid_score"]) * 100)),
                "hybrid_score": float(round(float(row["hybrid_score"]), 4)),
                "cosine_similarity": float(round(float(row["cosine_similarity"]), 4)),
                "eligibility_score": float(round(float(row["eligibility_score"]), 4)),
                "fully_eligible": bool(row["fully_eligible"]),
                "match_reason": " · ".join(reasons) if reasons else "Recommended Scheme",
                "type": "scheme"
            }
            recommendations.append(record)

        return recommendations

    def calculate_job_eligibility(self, user):
        """Calculates eligibility for jobs based on age, gender, and state."""
        result = self.jobs_df.copy()
        user_age = user.get("age")
        user_gender = str(user.get("gender", "female")).strip().lower()
        user_state = str(user.get("state", "All")).strip()

        # Age
        if user_age is not None and not pd.isna(user_age):
            user_age_num = float(user_age)
            age_min_ok = result["eligibility_age_min"].isna() | (user_age_num >= result["eligibility_age_min"])
            age_max_ok = result["eligibility_age_max"].isna() | (user_age_num <= result["eligibility_age_max"])
            age_match = (age_min_ok & age_max_ok).astype(int)
        else:
            age_match = pd.Series(1, index=result.index)

        # Gender
        allowed_genders = ["all", "any", "female", "women", "woman"] if user_gender in ["female", "women", "woman"] else ["all", "any", user_gender]
        gender_match = (
            result["eligibility_gender"].isna() |
            result["eligibility_gender"].astype(str).str.lower().isin(allowed_genders)
        ).astype(int)

        # State / Remote mode
        is_remote = result["work_mode"].astype(str).str.lower() == "remote"
        state_match = result["eligibility_state"].apply(lambda x: state_matches(x, user_state)) | is_remote
        state_match = state_match.astype(int)

        result["age_match"] = age_match
        result["gender_match"] = gender_match
        result["state_match"] = state_match

        result["eligibility_score"] = (age_match + gender_match + state_match) / 3.0
        result["fully_eligible"] = ((age_match == 1) & (gender_match == 1) & (state_match == 1)).astype(int)
        return result

    def recommend_jobs(self, user, top_n=6, content_weight=0.6, eligibility_weight=0.4):
        """Generates hybrid recommendations for jobs."""
        result = self.calculate_job_eligibility(user)
        user_text = self._extract_user_text(user)
        user_vector = self.jobs_vectorizer.transform([user_text])
        similarity_scores = cosine_similarity(user_vector, self.jobs_tfidf_matrix)[0]

        result["cosine_similarity"] = similarity_scores
        result["hybrid_score"] = (
            content_weight * result["cosine_similarity"] +
            eligibility_weight * result["eligibility_score"]
        )

        ranked = result.sort_values("hybrid_score", ascending=False).head(top_n).copy()

        recommendations = []
        for _, row in ranked.iterrows():
            reasons = []
            if row.get("work_mode") == "remote":
                reasons.append("Work from Home")
            elif row.get("location_state") and row["location_state"] != "All":
                reasons.append(f"Location: {row['location_district']}, {row['location_state']}")
            
            if row["cosine_similarity"] > 0.15:
                reasons.append("Matches Your Skills")
            
            if row.get("salary_min"):
                reasons.append(f"₹{int(row['salary_min']):,}+/mo")

            record = {
                "id": str(row.get("id") or _),
                "title": row.get("title") or "Job Opening",
                "org_name": row.get("company") or "Employer Partner",
                "category": row.get("category") or "General",
                "description": row.get("description") or "",
                "work_mode": row.get("work_mode") or "onsite",
                "location_state": row.get("location_state") or "All",
                "location_district": row.get("location_district") or "",
                "salary_min": int(row.get("salary_min") or 0),
                "salary_max": int(row.get("salary_max") or 0),
                "skills_required": row.get("skills_required") if isinstance(row.get("skills_required"), list) else [],
                "education_required": row.get("education_required") or "",
                "score": int(round(float(row["hybrid_score"]) * 100)),
                "hybrid_score": float(round(float(row["hybrid_score"]), 4)),
                "cosine_similarity": float(round(float(row["cosine_similarity"]), 4)),
                "eligibility_score": float(round(float(row["eligibility_score"]), 4)),
                "fully_eligible": bool(row["fully_eligible"]),
                "match_reason": " · ".join(reasons) if reasons else "Recommended Opportunity",
                "type": "job"
            }
            recommendations.append(record)

        return recommendations

    def calculate_course_eligibility(self, user):
        """Calculates eligibility for courses."""
        result = self.courses_df.copy()
        user_age = user.get("age")
        user_gender = str(user.get("gender", "female")).strip().lower()

        if user_age is not None and not pd.isna(user_age):
            user_age_num = float(user_age)
            age_min_ok = result["eligibility_age_min"].isna() | (user_age_num >= result["eligibility_age_min"])
            age_max_ok = result["eligibility_age_max"].isna() | (user_age_num <= result["eligibility_age_max"])
            age_match = (age_min_ok & age_max_ok).astype(int)
        else:
            age_match = pd.Series(1, index=result.index)

        allowed_genders = ["all", "any", "female", "women", "woman"] if user_gender in ["female", "women", "woman"] else ["all", "any", user_gender]
        gender_match = (
            result["eligibility_gender"].isna() |
            result["eligibility_gender"].astype(str).str.lower().isin(allowed_genders)
        ).astype(int)

        result["age_match"] = age_match
        result["gender_match"] = gender_match
        result["eligibility_score"] = (age_match + gender_match) / 2.0
        result["fully_eligible"] = ((age_match == 1) & (gender_match == 1)).astype(int)
        return result

    def recommend_courses(self, user, top_n=6, content_weight=0.6, eligibility_weight=0.4):
        """Generates hybrid recommendations for courses."""
        result = self.calculate_course_eligibility(user)
        user_text = self._extract_user_text(user)
        user_vector = self.courses_vectorizer.transform([user_text])
        similarity_scores = cosine_similarity(user_vector, self.courses_tfidf_matrix)[0]

        result["cosine_similarity"] = similarity_scores
        result["hybrid_score"] = (
            content_weight * result["cosine_similarity"] +
            eligibility_weight * result["eligibility_score"]
        )

        ranked = result.sort_values("hybrid_score", ascending=False).head(top_n).copy()

        recommendations = []
        for _, row in ranked.iterrows():
            reasons = []
            if row.get("is_free"):
                reasons.append("Free Course")
            if row.get("certification"):
                reasons.append("Certificate Included")
            if row.get("mode") == "online":
                reasons.append("Learn Online")
            elif row.get("location_state") and row["location_state"] != "All":
                reasons.append(f"In {row['location_state']}")

            record = {
                "id": str(row.get("id") or _),
                "title": row.get("title") or "Training Course",
                "org_name": row.get("provider") or "Training Institute",
                "category": row.get("category") or "Skill Training",
                "description": row.get("description") or "",
                "duration": row.get("duration") or "Flexible",
                "mode": row.get("mode") or "online",
                "is_free": bool(row.get("is_free")),
                "fee": int(row.get("fee") or 0),
                "certification": bool(row.get("certification")),
                "skills_taught": row.get("skills_taught") if isinstance(row.get("skills_taught"), list) else [],
                "language": row.get("language") if isinstance(row.get("language"), list) else ["Hindi", "English"],
                "score": int(round(float(row["hybrid_score"]) * 100)),
                "hybrid_score": float(round(float(row["hybrid_score"]), 4)),
                "cosine_similarity": float(round(float(row["cosine_similarity"]), 4)),
                "eligibility_score": float(round(float(row["eligibility_score"]), 4)),
                "fully_eligible": bool(row["fully_eligible"]),
                "match_reason": " · ".join(reasons) if reasons else "Recommended Skill Course",
                "type": "course"
            }
            recommendations.append(record)

        return recommendations

    def recommend_all(self, user, top_jobs=6, top_courses=6, top_schemes=5):
        """Returns unified recommendations for all three entity categories."""
        return {
            "jobs": self.recommend_jobs(user, top_n=top_jobs),
            "courses": self.recommend_courses(user, top_n=top_courses),
            "schemes": self.recommend_schemes(user, top_n=top_schemes),
        }

if __name__ == "__main__":
    engine = RecommendationEngine()
    test_user = {
        "user_id": "U1",
        "age": 25,
        "gender": "Female",
        "state": "Maharashtra",
        "income": 150000,
        "interest": "tailoring entrepreneurship skill development handicrafts"
    }
    recs = engine.recommend_all(test_user)
    print("\n--- TEST RECOMMENDATIONS FOR U1 ---")
    print("\nTop Schemes:")
    for s in recs["schemes"]:
        print(f"  [{s['score']}%] {s['title']} ({s['match_reason']})")
    print("\nTop Jobs:")
    for j in recs["jobs"]:
        print(f"  [{j['score']}%] {j['title']} ({j['match_reason']})")
    print("\nTop Courses:")
    for c in recs["courses"]:
        print(f"  [{c['score']}%] {c['title']} ({c['match_reason']})")
