import shap
import numpy as np

class XaiLayer:
    def __init__(self):
        self.cache = {}

    def explain(self, model, features):
        feats = np.array(features)
        if model not in self.cache:
            self.cache[model] = shap.TreeExplainer(model)
        shap_vals = self.cache[model](feats)
        return {"shap": shap_vals[0].tolist()}
