# ui/routes/config.py
from fastapi import APIRouter

router = APIRouter(prefix="/config", tags=["Configuration"])

# GET /config
@router.get("/")
def get_config():
    return {
        "monitored_paths": ["C:/Users/Alice/Documents/test_folder"],
        "alert_threshold": 0.60,
        "auto_response": False
    }

# POST /config/update
@router.post("/update")
def update_config(cfg: dict):
    # placeholder (save config to file later)
    return {"message": "config updated", "new_config": cfg}
