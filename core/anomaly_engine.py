# core/anomaly_engine.py
import joblib
import traceback

class AnomalyEngine:
    """
    Performs entropy → Gretel → ML → XAI → final verdict.
    """

    def __init__(self, entropy_engine, baseline_store, xai_layer, model_path, thresholds):
        self.entropy = entropy_engine
        self.baseline = baseline_store
        self.xai = xai_layer
        self.model = joblib.load(model_path)
        self.thresholds = thresholds

    def safe_predict_proba(self, features):
        """
        Wrapper around model.predict_proba to catch errors and return a safe score.
        """
        try:
            return float(self.model.predict_proba(features)[0][1])
        except Exception:
            # log for debugging in future
            traceback.print_exc()
            # conservative fallback
            return 0.0

    def process_event(self, event, logger, responder):
        # Compute entropy
        H = self.entropy.compute(event.path)
        if H is None:
            return

        # Build baseline key and stats
        k = self.baseline.key(event.path)
        s = self.baseline.stats(k)

        # Gretel calculation
        gretel = 0.0
        if s and s.get("std", 0) and s["std"] > 0:
            gretel = abs(H - s["mean"]) / s["std"]

        # entropy_delta = H - last observed (if exists)
        last_val = self.baseline.last(k)
        entropy_delta = (H - last_val) if (last_val is not None) else 0.0

        # update baseline (so future events use this)
        self.baseline.update(k, H)

        # Build features and names for model & XAI
        feature_names = ["entropy", "entropy_delta", "gretel"]
        features = [[H, entropy_delta, gretel]]

        ml_score = self.safe_predict_proba(features)

        # Combined score (configurable weighting)
        combined = (
            0.6 * ml_score +
            0.3 * (gretel / 5.0) +
            0.1 * (H / 8.0)
        )

        verdict = "benign"
        xai_data = None

        if combined >= self.thresholds.get("alert", 0.6):
            verdict = "suspicious"
            # Compute XAI explanation (SHAP) for flagged events
            try:
                xai_data = self.xai.explain(self.model, features, feature_names=feature_names)
            except Exception:
                # fallback: store minimal xai info
                xai_data = {
                    "shap_values": [],
                    "top_features": [],
                    "feature_names": feature_names
                }

            # Execute configured response (quarantine etc.)
            try:
                responder.execute(event)
            except Exception:
                # do not crash engine on response errors
                traceback.print_exc()

        # Log event (ForensicLogger will broadcast over websocket)
        try:
            logger.log_event(event, H, gretel, ml_score, combined, verdict, xai_data)
        except Exception:
            traceback.print_exc()
