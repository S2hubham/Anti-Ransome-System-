import uuid
from datetime import datetime
import hashlib

class FileEvent:
    """
    A normalized representation of any filesystem event.
    """

    def __init__(self, path, op_type):
        self.id = str(uuid.uuid4())
        self.timestamp = datetime.utcnow().isoformat()
        self.path = path
        self.op_type = op_type
        self.pid = None
        self.process_name = None
        self.file_hash = None

    @staticmethod
    def from_watchdog_event(event):
        if event.is_directory:
            return None

        if event.event_type == "created":
            op = "create"
        elif event.event_type == "modified":
            op = "modify"
        elif event.event_type == "deleted":
            op = "delete"
        elif event.event_type == "moved":
            op = "rename"
        else:
            op = "unknown"

        return FileEvent(event.src_path, op)

    def compute_hash(self):
        try:
            with open(self.path, "rb") as f:
                self.file_hash = hashlib.sha256(f.read()).hexdigest()
        except:
            self.file_hash = None
