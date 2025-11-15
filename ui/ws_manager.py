# ui/ws_manager.py

import asyncio

class WebSocketManager:
    def __init__(self):
        self.active_connections = set()
        self.loop = None

    def set_event_loop(self, loop):
        """Called by FastAPI to register the running event loop."""
        self.loop = loop

    async def register(self, websocket):
        """Add a websocket connection (DO NOT accept here)."""
        self.active_connections.add(websocket)

    async def unregister(self, websocket):
        """Remove a websocket connection if it closed."""
        try:
            self.active_connections.remove(websocket)
        except KeyError:
            pass

    async def broadcast(self, message: dict):
        """Broadcast message to all clients asynchronously."""
        dead_sockets = []

        for ws in list(self.active_connections):
            try:
                await ws.send_json(message)
            except Exception:
                dead_sockets.append(ws)

        for ws in dead_sockets:
            await self.unregister(ws)

    def broadcast_sync(self, message: dict):
        """
        Safe to call from other threads (e.g., ForensicLogger)
        Uses FastAPI event loop to queue the broadcast.
        """
        if not self.loop:
            return

        asyncio.run_coroutine_threadsafe(
            self.broadcast(message),
            self.loop
        )


# Shared singleton used everywhere
ws_manager = WebSocketManager()
