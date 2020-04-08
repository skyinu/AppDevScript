#! /usr/bin/env node
const resTools = require('./restools');
const path = require('path');
const parse = require('csv-parse/lib/sync')
const assert = require('assert')
const fs = require('fs')

let searchInApk = (apkPath, targetRegex, isResMode) => {
    let outputArscFilePath = parseArsc(apkPath)
    let arscCsv = fs.readFileSync(outputArscFilePath, 'utf8')
    let arscData = parse(arscCsv, {
        columns: true,
        skip_empty_lines: true
    })
    let outputSmaliPath = reveriseApK(apkPath)
    findArscReflectInSrc(arscData, path.join(outputSmaliPath, "smali"))
}
let parseArsc = (apkPath) => {
    let outputFilePath = path.join(apkPath, "..", "arsc.csv")
    let command = " --apk=" + apkPath + " --type=ENTRIES > " + outputFilePath
    resTools.callArscBlamer(command)
    return outputFilePath
}
let reveriseApK = (apkPath) => {
    let outputFilePath = path.join(apkPath, "..", "apktools")
    let command = " d " + apkPath + " -o " + outputFilePath
    resTools.callApkTool(command)
}

let findArscReflectInSrc = (arscData, outputSrcPath) => {

}

let travelDirectory = (inputDir, action) => {
    fs.readdirSync(inputDir).forEach(((subFile) => {
        if (subFile.startsWith(".")) {
            console.log("ignore hiden file")
            return
        }
        let subPath = path.join(inputDir, subFile);
        if (fs.statSync(subPath).isDirectory()) {
            travelDirectory(subPath, action);
        } else {
            action(subPath);
        }
    }))
}


module.exports = {
    searchInApk
}
