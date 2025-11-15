from core.entropy_engine import EntropyEngine

def test_entropy_basic():
    e = EntropyEngine()
    assert isinstance(e.sample_size, int)
