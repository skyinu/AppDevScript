#! /usr/bin/env node
const resTools = require('./restools');
const path = require('path');
const parse = require('csv-parse/lib/sync')
const fs = require('fs')
const KEY_RESOURCE_TYPE = "Type"
const KEY_RESOURCE_NAME = "Name"
const KEY_IDENTIDER_METHOD = "getIdentifier(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I"

let searchInApk = (apkPath, targetRegex, isResMode) => {
    let outputSmaliPath = reveriseApK(apkPath)
    let resultFiles
    if (isResMode) {
        let outputArscFilePath = parseArsc(apkPath)
        let arscCsv = fs.readFileSync(outputArscFilePath, 'utf8')
        let arscData = parse(arscCsv, {
            columns: true,
            skip_empty_lines: true
        })
        resultFiles = {}
        findArscReflectInSrc(arscData, path.join(outputSmaliPath, "smali"), resultFiles)
    } else {
        resultFiles = []
        findRegexStrInSrc(targetRegex, path.join(outputSmaliPath, "smali"), resultFiles)
    }
    let outputFilePath = path.join(apkPath, "..", "result_report.json")
    fs.writeFileSync(outputFilePath, JSON.stringify(resultFiles))
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
    return outputFilePath
}

let findArscReflectInSrc = (arscData, outputSrcPath, resultFiles) => {
    travelDirectory(outputSrcPath, (originFile) => {
        let smaliSrc = fs.readFileSync(originFile, 'utf8')
        let fileKey = originFile.slice(outputSrcPath.length + 1, originFile.length - 6)
        console.log("handle file " + fileKey)
        if (smaliSrc.indexOf(KEY_IDENTIDER_METHOD) < 0) {
            return
        }
        resultFiles[fileKey] = []
        for (let index = 0; index < arscData.length; index++) {
            const element = arscData[index];
            let resType = element[KEY_RESOURCE_TYPE]
            let resName = element[KEY_RESOURCE_NAME]
            if (smaliSrc.indexOf(" \"" + resName + "\"") >= 0) {
                resultFiles[fileKey].push(resType + "." + resName)
            }
        }
    })
}

let findRegexStrInSrc = (targetRegex, outputSrcPath, resultFiles) => {
    let matchRegex = new RegExp(targetRegex)
    travelDirectory(outputSrcPath, (originFile) => {
        let smaliSrc = fs.readFileSync(originFile, 'utf8')
        let fileKey = originFile.slice(outputSrcPath.length + 1, originFile.length - 6)
        console.log("handle file " + fileKey)
        if (smaliSrc.search(matchRegex) >= 0) {
            resultFiles.push(fileKey)
        }
    })
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
