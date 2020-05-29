#! /usr/bin/env node
const resTools = require('./restools');
const path = require('path');
const parse = require('csv-parse/lib/sync')
const fs = require('fs')
const KEY_RESOURCE_TYPE = "Type"
const KEY_RESOURCE_NAME = "Name"
const KEY_IDENTIDER_METHOD = "getIdentifier(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I"
const KEY_IDENTIDER_JAVA_METHOD = ".getIdentifier("
const DIR_SMALI = "smali"

let searchInApk = (apkPath, targetRegex, isResMode, decodeToJava) => {
    let outputSrcPath = ""
    if (decodeToJava) {
        outputSrcPath = reveriseApKToJava(apkPath)
    } else {
        outputSrcPath = reveriseApK(apkPath)
    }
    let resultFiles
    if (isResMode) {
        let outputArscFilePath = parseArsc(apkPath)
        let arscCsv = fs.readFileSync(outputArscFilePath, 'utf8')
        let arscData = parse(arscCsv, {
            columns: true,
            skip_empty_lines: true
        })
        resultFiles = {}
        let travelFunc = travelSmaliDir
        if (decodeToJava) {
            travelFunc = travelDirectory
        }
        travelFunc(outputSrcPath, (filePath) => {
            if (decodeToJava) {
                let fileKey = filePath.slice(outputSrcPath.length + 1, filePath.length - 5)
                findArscReflectInSingleSrc(arscData, filePath, fileKey, resultFiles, KEY_IDENTIDER_JAVA_METHOD)
            } else {
                findArscReflectInSrc(arscData, filePath, resultFiles, KEY_IDENTIDER_METHOD)
            }
        })

    } else {
        resultFiles = []
        let travelFunc = travelSmaliDir
        let actionFunc = findRegexStrInSrc
        if (decodeToJava) {
            travelFunc = travelDirectory
            actionFunc = findRegexStrInSingleSrc
        }
        travelFunc(outputSrcPath, (filePath) => {
            actionFunc(targetRegex, filePath, resultFiles)
        })
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
    if (!fs.existsSync(outputFilePath)) {
        let command = " d " + apkPath + " -o " + outputFilePath
        resTools.callApkTool(command)
    } else {
        console.log("had alread been reversed")
    }
    return outputFilePath
}

let travelSmaliDir = (outputSmaliPath, action) => {
    let dexCount = 1
    let dirSuffix = "_classes"
    let smali = DIR_SMALI
    while (true) {
        let smaliPath = path.join(outputSmaliPath, smali)
        if (fs.existsSync(smaliPath) && fs.statSync(smaliPath).isDirectory()) {
            console.log("handle dir " + smaliPath)
            action(smaliPath)
            dexCount++
            smali = DIR_SMALI + dirSuffix + `${dexCount}`
        } else {
            console.log("break path " + smaliPath)
            break
        }
    }
}

let findArscReflectInSrc = (arscData, outputSrcPath, resultFiles, filterWords) => {
    travelDirectory(outputSrcPath, (originFile) => {
        let fileKey = originFile.slice(outputSrcPath.length + 1, originFile.length - 6)
        findArscReflectInSingleSrc(arscData, originFile, fileKey, resultFiles, filterWords)
    })
}

let findArscReflectInSingleSrc = (arscData, originFile, subName, resultFiles, filterWords) => {
    let smaliSrc = fs.readFileSync(originFile, 'utf8')
    let fileKey = subName
    console.log("handle file " + fileKey)
    if (smaliSrc.indexOf(filterWords) < 0) {
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
}

let findRegexStrInSingleSrc = (targetRegex, originFile, resultFiles) => {
    let matchRegex = new RegExp(targetRegex)
    let smaliSrc = fs.readFileSync(originFile, 'utf8')
    let fileKey = originFile.slice(outputSrcPath.length + 1, originFile.length - 6)
    console.log("handle file " + fileKey)
    if (smaliSrc.search(matchRegex) >= 0) {
        resultFiles.push(fileKey)
    }
}

let findRegexStrInSrc = (targetRegex, outputSrcPath, resultFiles) => {
    travelDirectory(outputSrcPath, (originFile) => {
        findRegexStrInSingleSrc(targetRegex, originFile, resultFiles)
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

let reveriseApKToJava = (apkPath) => {
    let outputFilePath = path.join(apkPath, "..", "jadx")
    if (!fs.existsSync(outputFilePath)) {
        let command = " " + apkPath + " -d " + outputFilePath + " -r"
        resTools.callJadx(command)
    } else {
        console.log("had alread been reversed to java")
    }
    return outputFilePath + path.sep + "sources"
}


module.exports = {
    searchInApk
}
