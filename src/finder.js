#! /usr/bin/env node
const resTools = require('./restools');
let searchInApk = (apkPath, targetRegex, isResMode) => {
    reveriseApK(apkPath)
}

let reveriseApK = (apkPath) => {
    let command = " d " + apkPath
    resTools.callApkTool(command)
}

module.exports = {
    searchInApk
}