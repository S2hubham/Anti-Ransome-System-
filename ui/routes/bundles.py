# ui/routes/bundles.py
from fastapi import APIRouter, HTTPException
import os

# local imports
from forensic.bundle_exporter import BundleExporter
from forensic.logger import ForensicLogger

router = APIRouter(prefix="/bundles", tags=["Forensic Bundles"])

# Resolve absolute base dir
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
BUNDLES_DIR = os.path.join(BASE_DIR, "forensic", "bundles")
os.makedirs(BUNDLES_DIR, exist_ok=True)

# instantiate exporter and logger (lightweight)
_exporter = BundleExporter(out_dir=BUNDLES_DIR)
_logger = ForensicLogger(os.path.join(BASE_DIR, "forensic", "events.db"))

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


@router.post("/export/{event_id}")
def export_bundle(event_id: int):
    """
    Create a forensic bundle for the given event id and return a download URL.
    """
    # fetch event record from DB via ForensicLogger helper
    rec = _logger.get_event(event_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Event not found")

    # create bundle
    bundle_name, bundle_path = _exporter.export(rec)

    # return id and download url (served from static mount /static/bundles)
    download_url = f"/static/bundles/{bundle_name}"
    return {"bundle_name": bundle_name, "download_url": download_url}
