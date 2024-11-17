Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c ""%appdata%\startup.bat""", 0, False
