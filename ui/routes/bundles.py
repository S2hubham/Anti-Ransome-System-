# ui/routes/bundles.py
from fastapi import APIRouter, HTTPException
import os

router = APIRouter(prefix="/bundles", tags=["Forensic Bundles"])

# Resolve absolute bundles directory relative to project root.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
BUNDLES_DIR = os.path.join(BASE_DIR, "forensic", "bundles")

@router.get("/")
def get_bundles():
    os.makedirs(BUNDLES_DIR, exist_ok=True)
    items = []
    # list files newest first
    for fname in sorted(os.listdir(BUNDLES_DIR), reverse=True):
        if fname.endswith(".zip"):
            path = os.path.join(BUNDLES_DIR, fname)
            items.append({
                "id": fname.replace(".zip", ""),
                "timestamp": os.path.getmtime(path),
                # frontend expects file under /static/bundles/<fname>
                "file": f"/static/bundles/{fname}",
                "path": path
            })
    return {"bundles": items}

@router.get("/{bundle_id}")
def download_bundle(bundle_id: str):
    # the frontend expects a download_url; static server will serve the file
    fname = f"{bundle_id}.zip"
    path = os.path.join(BUNDLES_DIR, fname)
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Bundle not found")
    return {"id": bundle_id, "download_url": f"/static/bundles/{fname}"}
