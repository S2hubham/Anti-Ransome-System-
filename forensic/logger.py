# forensic/logger.py
import sqlite3
import os
import json
from datetime import datetime
from typing import Optional

DB_DIR = "forensic"
DB_PATH = os.path.join(DB_DIR, "events.db")

# ws_manager may not yet have event loop during import, but that's OK.
try:
    from ui import ws_manager
except Exception:
    ws_manager = None

class ForensicLogger:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or DB_PATH
        self._init()

    def _init(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                path TEXT,
                op_type TEXT,
                entropy REAL,
                gretel REAL,
                ml_score REAL,
                combined REAL,
                verdict TEXT,
                xai TEXT
            )
        """)
        conn.commit()
        conn.close()

    def log_event(self, event, entropy, gretel, ml_score, combined, verdict, xai_data):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO events (timestamp, path, op_type, entropy, gretel, ml_score, combined, verdict, xai)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.utcnow().isoformat(),
            getattr(event, "path", None),
            getattr(event, "op_type", None),
            entropy,
            gretel,
            ml_score,
            combined,
            verdict,
            json.dumps(xai_data) if xai_data else None
        ))
        conn.commit()
        inserted_id = cur.lastrowid

        # build payload to broadcast
        payload = {
            "id": inserted_id,
            "timestamp": datetime.utcnow().isoformat(),
            "path": getattr(event, "path", None),
            "op_type": getattr(event, "op_type", None),
            "entropy": entropy,
            "gretel": gretel,
            "ml_score": ml_score,
            "combined": combined,
            "verdict": verdict,
        }

        conn.close()

        # broadcast (if ws_manager available and event loop set)
        try:
            if ws_manager:
                ws_manager.broadcast_sync(payload)
        except Exception:
            pass

        return inserted_id

    # optional: helper to fetch single event record (used by other modules)
    def get_event(self, event_id):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cur = conn.execute("SELECT * FROM events WHERE id = ?", (event_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return None
        rec = dict(row)
        try:
            rec["xai"] = json.loads(rec["xai"]) if rec.get("xai") else None
        except Exception:
            pass
        return rec
