# ui/ws_manager.py

import asyncio
from typing import Set
from fastapi import WebSocket

class WSManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.loop = None

    def set_event_loop(self, loop):
        """Called from FastAPI startup thread."""
        self.loop = loop

    async def register(self, websocket: WebSocket):
        """Register new websocket client."""
        self.active_connections.add(websocket)

    async def unregister(self, websocket: WebSocket):
        """Remove disconnected websocket."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        """Broadcast asynchronously inside event loop."""
        dead = []
        for ws in self.active_connections:
            try:
                await ws.send_text(message)
            except Exception:
                dead.append(ws)

        for ws in dead:
            await self.unregister(ws)

    def broadcast_sync(self, message: str):
        """Called from threads (logger / anomaly engine)."""
        if self.loop is None:
            print("[WS_MANAGER] No event loop available for sync broadcast.")
            return

        # Schedule coroutine on the FastAPI event loop
        asyncio.run_coroutine_threadsafe(self.broadcast(message), self.loop)


# Singleton instance
ws_manager = WSManager()
