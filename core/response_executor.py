import os
import shutil

class ResponseExecutor:
    """
    Executes containment actions like:
    - file quarantine
    - process kill (future)
    """

    def __init__(self, quarantine_dir="forensic/quarantine"):
        self.qdir = quarantine_dir
        os.makedirs(self.qdir, exist_ok=True)

    def execute(self, event):
        """
        Quarantine the file.
        """
        try:
            if os.path.isfile(event.path):
                shutil.copy(event.path, self.qdir)
            print(f"[Response] Quarantined {event.path}")
        except:
            print("[Response] Failed to quarantine")
