# ui/routes/events.py
from fastapi import APIRouter, Query, HTTPException
import sqlite3
from typing import Optional
import os

router = APIRouter(prefix="/events", tags=["Events"])

# Resolve absolute DB path relative to project root.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DB_PATH = os.path.join(BASE_DIR, "forensic", "events.db")

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 200

def _connect():
    # Each request gets its own SQLite connection
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@router.get("/")
def get_events(
    page: int = Query(1, ge=1),
    page_size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
    verdict: Optional[str] = Query(None),
    min_entropy: Optional[float] = Query(None),
    max_entropy: Optional[float] = Query(None),
    path_contains: Optional[str] = Query(None),
):
    """
    Returns paginated events with optional filtering.
    """
    offset = (page - 1) * page_size
    where_clauses = []
    params = []

    if verdict:
        where_clauses.append("verdict = ?")
        params.append(verdict)
    if min_entropy is not None:
        where_clauses.append("entropy >= ?")
        params.append(min_entropy)
    if max_entropy is not None:
        where_clauses.append("entropy <= ?")
        params.append(max_entropy)
    if path_contains:
        where_clauses.append("path LIKE ?")
        params.append(f"%{path_contains}%")

    where_sql = ("WHERE " + " AND ".join(where_clauses)) if where_clauses else ""

    conn = _connect()
    try:
        total_q = f"SELECT COUNT(*) as cnt FROM events {where_sql}"
        cur = conn.execute(total_q, params)
        total = cur.fetchone()["cnt"] or 0

        q = f"""
            SELECT id, timestamp, path, op_type, entropy, gretel, ml_score, combined, verdict
            FROM events
            {where_sql}
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        """
        cur = conn.execute(q, params + [page_size, offset])
        rows = [dict(r) for r in cur.fetchall()]

        return {
            "page": page,
            "page_size": page_size,
            "total": total,
            "events": rows
        }
    finally:
        conn.close()

@router.get("/{event_id}")
def get_event_details(event_id: int):
    conn = _connect()
    try:
        cur = conn.execute("SELECT * FROM events WHERE id = ?", (event_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Event not found")

        event = dict(row)
        # try to parse xai JSON field if exists
        try:
            import json
            if event.get("xai"):
                event["xai"] = json.loads(event["xai"])
        except Exception:
            pass

        return event
    finally:
        conn.close()
