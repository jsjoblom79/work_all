
from base64 import b64decode, urlsafe_b64decode


class MainAPI:
    def __init__(self, config):
        self.config = config


    def process_cri_file_upload(self, filename, data):
        print(filename)
        decoded_text = b64decode(data).decode("utf-8")
        print(decoded_text)
