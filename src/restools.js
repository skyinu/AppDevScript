const path = require('path');
const childProcess = require('child_process');
const APK_TOOL_PATH = path.join(__dirname, "..", "res", path.sep, "apktool_2.4.1.jar")
const ARSC_BLAMER_PATH = path.join(__dirname, "..", "res", path.sep, "android-arscblamer.jar")
let callApkTool = (command) => {
    let realComand = "java -jar " + APK_TOOL_PATH + command
    console.log("callApkTool : " + realComand + "\n")
    let log = childProcess.execSync(realComand)
    console.log(`callApkTool stdout: ${log}`);
}

let callArscBlamer = (command) => {
    let realComand = "java -jar " + ARSC_BLAMER_PATH + command
    console.log("callArscBlamer : " + realComand + "\n")
    let log = childProcess.execSync(realComand)
    console.log(`callArscBlamer stdout: ${log}`);
}

let callJadx = (command) => {
    let executeFile = "jadx"
    const jadxPath = path.join(__dirname, "..", "res", path.sep,
        "jadx-1.1.0", path.sep, "bin", path.sep, executeFile)
    let realComand = jadxPath + command
    console.log("callJadx : " + realComand + "\n")
    let log = childProcess.execSync(realComand)
    console.log(`callJadx stdout: ${log}`);
}

module.exports = {
    callApkTool,
    callArscBlamer,
    callJadx
}