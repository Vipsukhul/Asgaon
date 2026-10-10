@REM ==============================================================================
@REM Asgaon — MAVEN WRAPPER FOR JAVA 21 & SPRING BOOT 3
@REM ==============================================================================
@echo off
setlocal

set "DIR=%~dp0"
if exist "C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot" (
    set "JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"
)

"%DIR%apache-maven-3.9.6\bin\mvn.cmd" %*
