
from base64 import b64decode, urlsafe_b64decode
from webview import FileDialog
import webview, csv, json

from assets.helperpy.dialer_process import Dialer
from assets.helperpy.rped_files import RpedFile


class MainAPI:
    def __init__(self, config):
        self.config = config
        self.window = None
        with open('./assets/config/rped_config.json') as file:
            self.rped_config = json.load(file)

    def set_window(self, window):
        self.window = window

    def process_file_upload(self, filename, data, business_line):
        decoded_text = b64decode(data).decode("utf-8")

        new_file = Dialer(decoded_text, filename, self.config, business_line)
        return new_file.process_file()

    def process_rped_file(self, filename, data):
        decoded_text = b64decode(data).decode("utf-8")
        new_file = RpedFile(filename,decoded_text)
        return new_file.process_file()

    def open_file(self):
        window = webview.active_window()
        result = window.create_file_dialog(
            dialog_type=FileDialog.OPEN,
            directory='',
            allow_multiple=False,
            save_filename='',
            file_types=()
        )
        if not result:
            return None

        with open(result[0], newline='', encoding="UTF-8") as csvfile:
            header = next(csv.reader(csvfile))

        return {"path": result[0], "header": header}

    def get_canon_synonyms(self):
        return {
            "canon": self.rped_config["canonical_fields"],
            "synonyms": self.rped_config["synonyms"]
        }