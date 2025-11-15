# ui/routes/alerts.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ui import ws_manager

router = APIRouter(tags=["Alerts"])

@router.websocket("/ws/alerts")
async def ws_alerts(websocket: WebSocket):
    await websocket.accept()   # ACCEPT ONCE ONLY

    await ws_manager.register(websocket)

    try:
        while True:
            try:
                await websocket.receive_text()
            except WebSocketDisconnect:
                break
            except Exception:
                continue

    finally:
        await ws_manager.unregister(websocket)
