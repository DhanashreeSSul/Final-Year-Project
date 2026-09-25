"""
Flask REST API for Shakti Platform Recommendation Engine.
Serves real-time hybrid recommendations on port 5001.
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from engine import RecommendationEngine

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

app = Flask(__name__)
CORS(app)

print("[API] Initializing Recommendation Engine...")
engine = RecommendationEngine()
print("[API] Engine initialized and ready to serve requests.")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "Shakti Recommendation Engine",
        "schemes_count": len(engine.schemes_df) if engine.schemes_df is not None else 0,
        "jobs_count": len(engine.jobs_df) if engine.jobs_df is not None else 0,
        "courses_count": len(engine.courses_df) if engine.courses_df is not None else 0,
    })

@app.route("/recommend/all", methods=["POST"])
def recommend_all():
    user = request.get_json() or {}
    top_jobs = int(request.args.get("top_jobs", 6))
    top_courses = int(request.args.get("top_courses", 6))
    top_schemes = int(request.args.get("top_schemes", 5))

    recs = engine.recommend_all(
        user,
        top_jobs=top_jobs,
        top_courses=top_courses,
        top_schemes=top_schemes
    )
    return jsonify({
        "success": True,
        "data": recs
    })

@app.route("/recommend/schemes", methods=["POST"])
def recommend_schemes():
    user = request.get_json() or {}
    limit = int(request.args.get("limit", 10))
    fully_eligible = request.args.get("fully_eligible", "false").lower() == "true"
    
    schemes = engine.recommend_schemes(
        user,
        top_n=limit,
        fully_eligible_only=fully_eligible
    )
    return jsonify({
        "success": True,
        "data": schemes,
        "total": len(schemes)
    })

@app.route("/recommend/jobs", methods=["POST"])
def recommend_jobs():
    user = request.get_json() or {}
    limit = int(request.args.get("limit", 8))
    
    jobs = engine.recommend_jobs(
        user,
        top_n=limit
    )
    return jsonify({
        "success": True,
        "data": jobs,
        "total": len(jobs)
    })

@app.route("/recommend/courses", methods=["POST"])
def recommend_courses():
    user = request.get_json() or {}
    limit = int(request.args.get("limit", 8))
    
    courses = engine.recommend_courses(
        user,
        top_n=limit
    )
    return jsonify({
        "success": True,
        "data": courses,
        "total": len(courses)
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"[API] Starting recommendation server on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
