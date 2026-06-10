import webview
from screeninfo import get_monitors

from assets.api.config_api import ConfigAPI
from assets.api.vendor_api import VendorAPI


class AppAPI:
    def __init__(self):
        self.config = ConfigAPI()
        self.vendor = VendorAPI(self.config)
    def close_app(self) -> None:
        webview.windows[0].destroy()


api = AppAPI()


if "__main__" == __name__:
    monitors = get_monitors()
    totalWidth = 0
    totalHeight = 0
    avgWidth = 0
    avgHeight = 0

    for monitor in monitors:
        totalWidth += monitor.width
        totalHeight += monitor.height

    avgWidth = totalWidth / len(monitors)
    avgHeight = totalHeight / len(monitors)

    window = webview.create_window(
        title="Work All",
        url="index.html",
        js_api=api,
        width=avgWidth / 2,
        height=avgHeight - 50, )
    webview.start(debug=True)