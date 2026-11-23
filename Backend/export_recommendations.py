import json
from pathlib import Path
import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "best_svd_model.pkl"
RATINGS_PATH = BASE_DIR / "data" / "processed" / "ratings_clean.csv"
OUTPUT_PATH = BASE_DIR.parent / "react-movie-master" / "public" / "recommendations.json"

if not RATINGS_PATH.exists():
    raise FileNotFoundError(f"Missing ratings file: {RATINGS_PATH}")

ratings_df = pd.read_csv(RATINGS_PATH)
ratings_df = ratings_df[["userId", "movieId", "rating"]].dropna().copy()
ratings_df["rating"] = pd.to_numeric(ratings_df["rating"], errors="coerce")
ratings_df = ratings_df.dropna(subset=["rating"])

movie_ids = [int(mid) for mid in ratings_df["movieId"].unique()]
sample_user_id = int(ratings_df["userId"].iloc[0])

model = joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None

recommendations = []

if model is not None:
    try:
        for mid in movie_ids:
            pred = model.predict(sample_user_id, mid)
            recommendations.append({
                "movieId": mid,
                "predictedRating": round(float(pred.est), 4),
            })
    except Exception:
        model = None

# Fallback if `surprise` isn't installed in this Python environment:
# rank movies by average rating and rating count from ratings_clean.csv
if model is None:
    stats = (
        ratings_df.groupby("movieId")["rating"]
        .agg(["mean", "count"])
        .reset_index()
    )
    stats = stats.sort_values(by=["mean", "count"], ascending=[False, False])
    for row in stats.itertuples(index=False):
        recommendations.append({
            "movieId": int(row.movieId),
            "predictedRating": round(float(row.mean), 4),
            "ratingCount": int(row.count),
        })

recommendations.sort(key=lambda x: x["predictedRating"], reverse=True)

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
OUTPUT_PATH.write_text(json.dumps(recommendations[:200], indent=2), encoding="utf-8")
print(f"Saved {len(recommendations[:200])} items to {OUTPUT_PATH}")