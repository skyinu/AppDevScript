const path = require('path');
const childProcess = require('child_process');
const APK_TOOL_PATH = path.join(__dirname, "..", "res", path.sep, "apktool_2.4.1.jar")
let callApkTool = (command) => {
    let realComand = "java -jar " + APK_TOOL_PATH + command
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

module.exports = {
    callApkTool
}