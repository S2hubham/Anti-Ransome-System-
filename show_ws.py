import inspect
import ui.ws_manager

print("File path:", ui.ws_manager.__file__)
print("===== FILE CONTENT =====")
print(inspect.getsource(ui.ws_manager))
