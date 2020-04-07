const path = require('path');
const childProcess = require('child_process');
const APK_TOOL_PATH = path.join(__dirname, "..", "res", path.sep, "apktool_2.4.1.jar")
const ARSC_BLAMER_PATH = path.join(__dirname, "..", "res", path.sep, "android-arscblamer.jar")
let callApkTool = (command) => {
    let realComand = "java -jar " + APK_TOOL_PATH + command
    console.log("callApkTool : " + realComand)
    childProcess.exec(realComand, (error, stdout, stderr) => {
        if (error) {
            console.error(`callApkTool exec error: ${error}`);
            return;
        }
        if (stdout) {
            console.log(`callApkTool stdout: ${stdout}`);
        }
        if (stderr) {
            console.error(`callApkTool stderr: ${stderr}`);
        }
    })
}

let callArscBlamer = (command) => {
    let realComand = "java -jar " + ARSC_BLAMER_PATH + command
    console.log("callArscBlamer : " + realComand)
    childProcess.exec(realComand, (error, stdout, stderr) => {
        if (error) {
            console.error(`callArscBlamer exec error: ${error}`);
            return;
        }
        if (stdout) {
            console.log(`callArscBlamer stdout: ${stdout}`);
        }
        if (stderr) {
            console.error(`callArscBlamer stderr: ${stderr}`);
        }
    })
}

module.exports = {
    callApkTool,
    callArscBlamer
}