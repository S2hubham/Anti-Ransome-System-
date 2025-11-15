from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from core.file_event import FileEvent
import time

class FileWatcher:
    def __init__(self, monitored_paths, event_queue):
        self.monitored_paths = monitored_paths
        self.queue = event_queue
        self.observer = Observer()

    def start(self):
        handler = _WatchdogHandler(self.queue)
        for p in self.monitored_paths:
            self.observer.schedule(handler, p, recursive=True)

        self.observer.start()
        print("[Watcher] Started")

        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.observer.stop()

        self.observer.join()


class _WatchdogHandler(FileSystemEventHandler):
    def __init__(self, q):
        self.queue = q

    def on_any_event(self, event):
        file_event = FileEvent.from_watchdog_event(event)
        if file_event:
            self.queue.put(file_event)
