"""
Creates a dummy ML model for anomaly detection.
We'll replace this with real training later.
"""

import joblib
from sklearn.ensemble import RandomForestClassifier
import numpy as np

def create_dummy_model():
    X = np.random.rand(200, 2)  # [entropy, gretel]
    y = (X[:,0] + X[:,1] > 1).astype(int)

    model = RandomForestClassifier()
    model.fit(X, y)

    joblib.dump(model, "classifier.pkl")
    print("[Model] Dummy model saved.")

if __name__ == "__main__":
    create_dummy_model()
