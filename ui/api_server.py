# ui/api_server.py

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from ui.routes import events, stats, config, bundles, alerts
import uvicorn
import asyncio
from ui.ws_manager import ws_manager
import os


app = FastAPI(title="Ransomware Defense Backend")

# Register routes
app.include_router(events.router)
app.include_router(stats.router)
app.include_router(config.router)
app.include_router(bundles.router)
app.include_router(alerts.router)

# Determine project root (D:/Ransomware)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Forensic bundles directory
BUNDLES_DIR = os.path.join(BASE_DIR, "forensic", "bundles")
os.makedirs(BUNDLES_DIR, exist_ok=True)

# Mount bundles at /static/bundles for downloads
app.mount("/static/bundles", StaticFiles(directory=BUNDLES_DIR), name="bundles")


@app.on_event("startup")
async def startup_event():
    """
    Called when FastAPI starts.
    Registers the event loop inside ws_manager so threads (logger)
    can call broadcast_sync() safely.
    """
    try:
        loop = asyncio.get_event_loop()
        ws_manager.set_event_loop(loop)
    except Exception as e:
        print("[WS_MANAGER] Failed to set event loop:", e)


def start_api_server():
    """
    Runs the API server in a separate thread.
    """
    uvicorn.run(
        "ui.api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
