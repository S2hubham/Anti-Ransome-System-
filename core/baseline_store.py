# core/baseline_store.py
import numpy as np
import collections

class BaselineStore:
    def __init__(self, window_size=50):
        self.store = {}
        self.window_size = window_size

    def key(self, path):
        return path.split(".")[-1]

    def update(self, key, entropy):
        if key not in self.store:
            self.store[key] = collections.deque(maxlen=self.window_size)
        self.store[key].append(entropy)

    def stats(self, key):
        if key not in self.store or len(self.store[key]) < 3:
            return None

        arr = np.array(self.store[key])
        return {
            "mean": float(arr.mean()),
            "std": float(arr.std()),
            "count": len(arr)
        }

    def last(self, key):
        """
        Return the most recent entropy value for this key (or None).
        Useful to compute entropy_delta.
        """
        if key not in self.store or len(self.store[key]) == 0:
            return None
        return float(self.store[key][-1])
