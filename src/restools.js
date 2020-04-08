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

module.exports = {
    callApkTool,
    callArscBlamer
}