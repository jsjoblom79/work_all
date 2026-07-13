import json, importlib.util
from pathlib import Path

PLUGIN_DIR = Path(__file__).parent / "assets/plugins"

class PluginHost:
    def __init__(self):
        self.plugins = {}

    def discover(self):
        for manifest_path in PLUGIN_DIR.glob("*.json"):
            manifest = json.loads(manifest_path.read_text())
            folder = manifest_path.parent
            spec = importlib.util.spec_from_file_location(
                f"plugins.{manifest['name']}", folder / manifest["entry_py"])
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)

            handlers = module.register(self)
            self.plugins[manifest["name"]] = {
                "manifest": manifest, "handlers": handlers
            }

