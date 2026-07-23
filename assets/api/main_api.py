
from base64 import b64decode, urlsafe_b64decode
from webview import FileDialog
from datetime import datetime
import webview, csv, json

from assets.helperpy.dialer_process import Dialer
from assets.helperpy.rped_files import RpedFile


class MainAPI:
    def __init__(self, config):
        self.config = config
        self.window = None
        self._source_file = None
        with open('./assets/config/rped_config.json') as file:
            self.rped_config = json.load(file)

    def set_window(self, window):
        self.window = window

    def process_file_upload(self, filename, data, business_line):
        decoded_text = b64decode(data).decode("utf-8")

        new_file = Dialer(decoded_text, filename, self.config, business_line)
        return new_file.process_file()

    def process_rped_file(self, filename, data, business_line):
        decoded_text = b64decode(data).decode("utf-8")
        new_file = Dialer(decoded_text, filename, self.config, business_line)
        return new_file.process_file()

    def open_file(self):
        window = webview.active_window()
        self._source_file = window.create_file_dialog(
            dialog_type=FileDialog.OPEN,
            directory='',
            allow_multiple=False,
            save_filename='',
            file_types=()
        )
        if not self._source_file:
            return None

        with open(self._source_file[0], newline='', encoding="UTF-8") as csvfile:
            header = next(csv.reader(csvfile))

        return {"path": self._source_file[0], "header": header}

    def get_canon_synonyms(self):
        return {
            "canon": self.rped_config["canonical_fields"],
            "synonyms": self.rped_config["synonyms"]
        }

    def write_file(self, mapping):
        if not self._source_file:
            return { "result": False }

        target_to_source = {
            canonical: src for canonical, src in mapping.items()
        }

        # out_fields = [c for c in self.rped_config["canonical_fields"] if c in target_to_source]
        out_fields = list(self.rped_config["canonical_fields"])
        window = webview.active_window()
        save_path = window.create_file_dialog(
            webview.SAVE_DIALOG, save_filename=f"Mapped_output_{datetime.now().strftime("%Y%m%d")}.csv"
        )

        with open(self._source_file[0], newline='', encoding="UTF-8") as fin, \
            open(save_path[0], "w", newline='', encoding="UTF-8") as fout:
            reader = csv.DictReader(fin)
            writer = csv.DictWriter(fout, fieldnames=out_fields)
            writer.writeheader()
            for row in reader:
                writer.writerow(
                    {
                        tgt: row.get(target_to_source[tgt].replace("(","").replace(")",""), "") if tgt in target_to_source else "" for tgt in out_fields
                    }
                )

        return {
            "result": True,
            "path": self._source_file[0]
        }