#! /usr/bin/env node
const finder = require('./finder')
let argvs = process.argv;
let apkPath;
let targetRegex;
let isResMode = false
let decodeToJava = true

const APK_PATH = "-a";
const TARGET_REGEX = "-t";
const AND_RES_MODE = "-r";
const DECODE_FORMAT = "-f"

for (let index = 0; index < argvs.length; index++) {
    if (argvs[index].toLocaleLowerCase() === APK_PATH) {
        apkPath = argvs[index + 1].trim()
        index++
    } else if (argvs[index].toLocaleLowerCase() === TARGET_REGEX) {
        targetRegex = argvs[index + 1].trim()
        index++
    } else if (argvs[index].toLocaleLowerCase() === AND_RES_MODE) {
        isResMode = true
    } else if (argvs[index].toLocaleLowerCase() === "smali") {
        decodeToJava = false
    }
}
console.log("apk path is " + apkPath + " targetRegex is " + targetRegex + " isResMode " +
    isResMode + "decodeToJava " + decodeToJava)
if (isResMode || targetRegex) {
    finder.searchInApk(apkPath, targetRegex, isResMode, decodeToJava)
} else {
    console.log("invalid input")
}