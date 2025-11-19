# core/xai_layer.py
import shap
import numpy as np

class XaiLayer:
    """
    XAI wrapper that returns:
    {
      "shap_values": [...],
      "top_features": [...],
      "feature_names": [...]
    }
    """

    def __init__(self):
        # cache explainer per model (use model id as key)
        self.cache = {}

    def _get_explainer(self, model):
        """
        Return a shap explainer for the given model, caching it.
        """
        key = id(model)
        if key in self.cache:
            return self.cache[key]

        # Try TreeExplainer for tree-based models (fast & accurate)
        try:
            expl = shap.TreeExplainer(model)
        except Exception:
            # fallback to generic explainer (may be slower)
            expl = shap.Explainer(model)
        self.cache[key] = expl
        return expl

    def explain(self, model, features, feature_names=None):
        """
        features: a 2D list/np.array (n_samples x n_features) or 1D for single sample
        feature_names: optional list of names for each feature
        Returns: dict with shap_values (list), top_features (list), feature_names
        """
        feats = np.array(features)
        # ensure feats is 2D
        if feats.ndim == 1:
            feats = feats.reshape(1, -1)

        expl = self._get_explainer(model)

        # Use expl(...) which returns an Explanation object in modern SHAP
        try:
            exp = expl(feats)
            # exp.values may be shape (1, n_features) or list (for multi-output)
            # Normalize to a 2D numpy array
            if hasattr(exp, "values"):
                vals = np.array(exp.values)
                # If shape is (n_outputs, n_samples, n_features), try flattening first output
                if vals.ndim == 3:
                    vals = vals[0, 0, :]
                elif vals.ndim == 2:
                    vals = vals[0]
                else:
                    vals = vals.flatten()
            else:
                # fallback: try expl.shap_values
                vals = np.array(expl.shap_values(feats))
                if vals.ndim == 3:
                    vals = vals[0][0]
                elif vals.ndim == 2:
                    vals = vals[0]
        except Exception:
            # final fallback: try shap_values attribute
            try:
                vals = np.array(expl.shap_values(feats))
                if vals.ndim == 3:
                    vals = vals[0][0]
                elif vals.ndim == 2:
                    vals = vals[0]
            except Exception as e:
                # On failure, return empty artifact
                return {"shap_values": [], "top_features": [], "feature_names": feature_names or []}

        shap_values = vals.tolist()

        # Feature names
        if feature_names and len(feature_names) == len(shap_values):
            names = feature_names
        else:
            names = [f"f{i}" for i in range(len(shap_values))]

        # determine top-k by absolute contribution
        abs_vals = [abs(v) for v in shap_values]
        # pair and sort
        pairs = list(zip(names, shap_values, abs_vals))
        pairs_sorted = sorted(pairs, key=lambda x: x[2], reverse=True)
        top_features = [p[0] for p in pairs_sorted]

        return {
            "shap_values": shap_values,
            "top_features": top_features,
            "feature_names": names
        }
