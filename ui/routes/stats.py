# ui/routes/stats.py
from fastapi import APIRouter
import sqlite3
import os

router = APIRouter(prefix="/stats", tags=["Stats"])

# Resolve absolute DB path relative to project root.
# File location: ui/routes/stats.py -> go up three levels to project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DB_PATH = os.path.join(BASE_DIR, "forensic", "events.db")

def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@router.get("/")
def get_stats():
    conn = _connect()
    try:
        cur = conn.execute("SELECT COUNT(*) as cnt FROM events")
        total = cur.fetchone()["cnt"] or 0

        cur = conn.execute("SELECT COUNT(*) as cnt FROM events WHERE verdict = 'suspicious'")
        suspicious = cur.fetchone()["cnt"] or 0

        cur = conn.execute("SELECT AVG(entropy) as avg_entropy, AVG(gretel) as avg_gretel FROM events")
        row = cur.fetchone()
        avg_entropy = row["avg_entropy"] if row else None
        avg_gretel = row["avg_gretel"] if row else None

        # simple entropy trend: last 20 entropy values (oldest -> newest)
        cur = conn.execute("SELECT entropy FROM events ORDER BY id DESC LIMIT 20")
        ent_vals = [r["entropy"] for r in cur.fetchall()][::-1]

        return {
            "total_events": total,
            "suspicious_events": suspicious,
            "benign_events": (total - suspicious),
            "avg_entropy": round(avg_entropy, 3) if avg_entropy is not None else None,
            "avg_gretel": round(avg_gretel, 3) if avg_gretel is not None else None,
            "entropy_trend": ent_vals,
        }
    finally:
        conn.close()
