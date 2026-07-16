
from base64 import b64decode, urlsafe_b64decode

import webview

from assets.helperpy.dialer_process import Dialer
from assets.helperpy.rped_files import RpedFile


class MainAPI:
    def __init__(self, config):
        self.config = config

    def process_file_upload(self, filename, data, business_line):
        decoded_text = b64decode(data).decode("utf-8")

        new_file = Dialer(decoded_text, filename, self.config, business_line)
        return new_file.process_file()

    def process_rped_file(self, filename, data):
        decoded_text = b64decode(data).decode("utf-8")
        new_file = RpedFile(filename,decoded_text)
        return new_file.process_file()

    def open_file(self):
        window = webview.create_window("RPED FILE UPLOAD", "RPED FILE UPLOAD")
        result = window.create_file_dialog(
            webview.OPEN_DIALOG,
            file_types=("Text Files", "*.txt", "Comma Separated Values Files", "*.csv"),
        )