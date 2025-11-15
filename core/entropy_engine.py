import numpy as np

class EntropyEngine:
    def __init__(self, sample_size=4096):
        self.sample_size = sample_size

    def compute(self, path):
        try:
            with open(path, "rb") as f:
                data = f.read(self.sample_size)
        except:
            return None

        if not data:
            return 0.0

        counts = np.bincount(np.frombuffer(data, dtype=np.uint8), minlength=256)
        probs = counts / len(data)
        probs = probs[probs > 0]

        entropy = -np.sum(probs * np.log2(probs))
        return float(entropy)
