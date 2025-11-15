import queue

class EventQueue:
    """Thread-safe queue for file events."""

    def __init__(self):
        self.q = queue.Queue()

    def put(self, item):
        self.q.put(item)

    def get(self):
        return self.q.get()
