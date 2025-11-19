# forensic/bundle_exporter.py
import json
import zipfile
import os
from datetime import datetime
import shutil

class BundleExporter:
    """
    Exports a forensic bundle containing:
    - DB entry (record)
    - XAI data
    - file snapshot (if available)
    - manifest.json
    """

    def __init__(self, out_dir="forensic/bundles"):
        self.out_dir = out_dir
        os.makedirs(self.out_dir, exist_ok=True)

    def export(self, record):
        """
        record: dict — a single event record (as returned by ForensicLogger.get_event)
        Returns: (bundle_name, bundle_path)
        """
        # canonical name including id and timestamp
        safe_id = str(record.get("id", "unknown"))
        ts = int(datetime.utcnow().timestamp())
        bundle_name = f"bundle_{safe_id}_{ts}.zip"
        bundle_path = os.path.join(self.out_dir, bundle_name)

        # create a temp directory to collect files (optional)
        tmpdir = os.path.join(self.out_dir, f"tmp_bundle_{safe_id}_{ts}")
        os.makedirs(tmpdir, exist_ok=True)

        try:
            # write record.json
            with open(os.path.join(tmpdir, "record.json"), "w", encoding="utf-8") as f:
                json.dump(record, f, indent=2)

            # include xai json if present
            try:
                if record.get("xai"):
                    with open(os.path.join(tmpdir, "xai.json"), "w", encoding="utf-8") as f:
                        json.dump(record["xai"], f, indent=2)
            except Exception:
                pass

            # snapshot file if path exists (copy into tmpdir/evidence/)
            file_path = record.get("path")
            if file_path and os.path.isfile(file_path):
                evid_dir = os.path.join(tmpdir, "evidence")
                os.makedirs(evid_dir, exist_ok=True)
                # copy the file (do not overwrite existing)
                try:
                    shutil.copy2(file_path, os.path.join(evid_dir, os.path.basename(file_path)))
                except Exception:
                    pass

            # zip the tmpdir contents
            with zipfile.ZipFile(bundle_path, "w", zipfile.ZIP_DEFLATED) as z:
                for root, _, files in os.walk(tmpdir):
                    for fname in files:
                        full = os.path.join(root, fname)
                        rel = os.path.relpath(full, tmpdir)
                        z.write(full, arcname=rel)

        finally:
            # cleanup tmpdir
            try:
                shutil.rmtree(tmpdir)
            except Exception:
                pass

        return bundle_name, bundle_path
