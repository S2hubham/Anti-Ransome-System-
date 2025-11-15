import json
import zipfile
import os
from datetime import datetime

class BundleExporter:
    """
    Exports a forensic bundle containing:
    - DB entry
    - XAI data
    - file snapshot (if available)
    """

    def export(self, record, out_dir="forensic/bundles"):
        os.makedirs(out_dir, exist_ok=True)

        bundle_name = f"bundle_{record['id']}_{datetime.utcnow().timestamp()}.zip"
        bundle_path = os.path.join(out_dir, bundle_name)

        with zipfile.ZipFile(bundle_path, "w") as z:
            z.writestr("record.json", json.dumps(record, indent=4))

        return bundle_path
