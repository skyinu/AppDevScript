const fs = require('fs')
const path = require('path')
const compressing = require('compressing')
const os = require('os')
let mergeZip = (sourceDir, supportSuffix, destDir, destFileExtension) => {
    let mergeItems = []
    travelDirectory(sourceDir, (filePath) => {
        if (shouldIgnore(filePath, supportSuffix)) {
            return;
        }
        mergeItems.push(filePath)
    })
    if (mergeItems.length > 0) {
        mergeFile(mergeItems, destDir, destFileExtension)
    }
}

let mergeFile = (mergeItems, destDir, destFileExtension) => {
    let tmpDir = os.tmpdir()
    let mergeDir = path.join(tmpDir, os.uptime().toString())
    let handCount = 0
    let occurFailed = false
    let errorFile
    mergeItems.forEach((item) => {
        console.log(item)
        compressing.zip.uncompress(item, mergeDir)
            .then(() => {
                realMergeFile(++handCount, mergeItems.length,
                    mergeDir, destDir, destFileExtension,
                    occurFailed, errorFile)

            })
            .catch((err) => {
                occurFailed = true
                occurFailed = item
                realMergeFile(++handCount, mergeItems.length,
                    mergeDir, destDir, destFileExtension,
                    occurFailed, errorFile)
                console.log("unzip  " + item + " error," + err)
            })
    })
}

let realMergeFile = (count, total,
    mergeDir, destDir, destFileExtension,
    occurFailed, errorFile) => {
    if (count != total) {
        return
    }
    let targetFileName = os.uptime + "." + destFileExtension
    let destFile = path.join(destDir, targetFileName)
    if (occurFailed) {
        console.log("occure when unzip files, current error file is " + errorFile)
        deleteFolderRecursive(mergeDir)
    } else {
        compressing.zip.compressDir(mergeDir, destFile)
            .then(() => {
                console.log("merge successful, output file is locate in " + destFile)
                deleteFolderRecursive(mergeDir)
            }).catch((error) => {
                console.log("merge error " + error)
                deleteFolderRecursive(mergeDir)
            })
    }
}

let deleteFolderRecursive = (directory) => {
    if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach((file) => {
            let curDir = path.join(directory, file);
            if (fs.statSync(curDir).isDirectory()) {
                deleteFolderRecursive(curDir);
            } else {
                fs.unlinkSync(curDir);
            }
        });
        fs.rmdirSync(directory);
    }
};

let travelDirectory = (sourceDir, action) => {
    let sourceDirStat = fs.statSync(sourceDir);
    if (sourceDirStat.isDirectory()) {
        fs.readdirSync(sourceDir).forEach((subDir) => {
            travelDirectory(path.join(sourceDir, subDir), action)
        })
    } else {
        action(sourceDir)
    }
}

let shouldIgnore = (filePath, supportSuffix) => {
    for (index in supportSuffix) {
        if (filePath.endsWith(supportSuffix[index])) {
            return false;
        }
    }
    return true;
}

exports.mergeZip = mergeZip