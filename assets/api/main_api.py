
from base64 import b64decode, urlsafe_b64decode
from assets.helperpy.dialer_process import Dialer

class MainAPI:
    def __init__(self, config):
        self.config = config

    def process_file_upload(self, filename, data, business_line):
        decoded_text = b64decode(data).decode("utf-8")

        new_file = Dialer(decoded_text, filename, self.config, business_line)
        new_file.process_file()