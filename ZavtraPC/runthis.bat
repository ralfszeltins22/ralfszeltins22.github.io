@echo off
title ZavtraPC
color 05
echo Copying files...
copy "startup.vbs" "C:\Users\%username%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"
copy "sound.wav" "%appdata%"
copy "startup.bat" "%appdata%"
echo Finished!
pause
cd "C:\Users\%username%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"
start startup.vbs
exit