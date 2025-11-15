from core.baseline_store import BaselineStore

def test_gretel_stats():
    b = BaselineStore(5)
    for _ in range(5):
        b.update("txt", 3.0)
    s = b.stats("txt")
    assert s["mean"] == 3.0
