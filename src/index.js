#! /usr/bin/env node
const finder = require('./finder')
let argvs = process.argv;
let apkPath;
let targetRegex;
let isResMode = false

const APK_PATH = "-a";
const TARGET_REGEX = "-t";
const AND_RES_MODE = "-r";

for (let index = 0; index < argvs.length; index++) {
    if (argvs[index].toLocaleLowerCase() === APK_PATH) {
        apkPath = argvs[index + 1].trim()
        index++
    } else if (argvs[index].toLocaleLowerCase() === TARGET_REGEX) {
        targetRegex = argvs[index + 1].trim().split(SUPPORT_SUFFIX_SEPERETOR)
        index++
    } else if (argvs[index].toLocaleLowerCase() === AND_RES_MODE) {
        isResMode = true
    }
}
console.log("apk path is " + apkPath + "targetRegex is " + targetRegex + " isResMode " + isResMode)
finder.searchInApk(apkPath, targetRegex, isResMode)