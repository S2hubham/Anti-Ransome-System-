"""
Main entry point for the Intelligent Ransomware Defence System.
"""

from core.event_queue import EventQueue
from core.file_watcher import FileWatcher
from core.entropy_engine import EntropyEngine
from core.baseline_store import BaselineStore
from core.anomaly_engine import AnomalyEngine
from core.xai_layer import XaiLayer
from forensic.logger import ForensicLogger
from core.response_executor import ResponseExecutor
from ui.api_server import start_api_server
from config.config_loader import load_config

import threading

def main():
    config = load_config("config/config.yaml")

    event_queue = EventQueue()
    file_watcher = FileWatcher(config["monitored_paths"], event_queue)
    entropy = EntropyEngine(config["entropy_sample_size"])
    baseline = BaselineStore(config["gretel_window"])
    xai = XaiLayer()

    anomaly_engine = AnomalyEngine(
        entropy_engine=entropy,
        baseline_store=baseline,
        xai_layer=xai,
        model_path="models/classifier.pkl",
        thresholds=config["thresholds"]
    )

    logger = ForensicLogger("forensic/events.db")
    responder = ResponseExecutor()

    # Start file watcher thread
    t1 = threading.Thread(target=file_watcher.start, daemon=True)
    t1.start()

    # Start API server thread
    t2 = threading.Thread(target=start_api_server, daemon=True)
    t2.start()

    print("[SYSTEM] Running...")

    # Processing loop
    while True:
        ev = event_queue.get()
        anomaly_engine.process_event(ev, logger, responder)


if __name__ == "__main__":
    main()
