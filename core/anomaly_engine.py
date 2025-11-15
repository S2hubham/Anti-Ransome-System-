import joblib

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

    def process_event(self, event, logger, responder):
        H = self.entropy.compute(event.path)
        if H is None:
            return

        k = self.baseline.key(event.path)
        s = self.baseline.stats(k)

        gretel = 0
        if s and s["std"] > 0:
            gretel = abs(H - s["mean"]) / s["std"]

        self.baseline.update(k, H)

        features = [[H, gretel]]
        ml_score = float(self.model.predict_proba(features)[0][1])

        combined = (
            0.6 * ml_score +
            0.3 * (gretel / 5) +
            0.1 * (H / 8)
        )

        verdict = "benign"
        xai_data = None

        if combined >= self.thresholds["alert"]:
            verdict = "suspicious"
            xai_data = self.xai.explain(self.model, features)
            responder.execute(event)

        logger.log_event(event, H, gretel, ml_score, combined, verdict, xai_data)
