import webview
from screeninfo import get_monitors
from webview.menu import Menu, MenuAction
from assets.api.config_api import ConfigAPI
from assets.api.tasks_api import TasksApi
from assets.api.vendor_api import VendorAPI


class AppAPI:
    def __init__(self):
        self.config = ConfigAPI()
        self.vendor = VendorAPI(self.config)
        self.task = TasksApi(self.config)

    def close_app(self) -> None:
        webview.windows[0].destroy()

    def print_window(self) -> None:
        webview.windows[0].evaluate_js('window.print();')


api = AppAPI()

def start_app():
    monitors = get_monitors()
    totalWidth = 0
    totalHeight = 0
    # avgWidth = 0
    # avgHeight = 0

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

if "__main__" == __name__:
    start_app()
 

