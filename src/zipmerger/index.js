#! /usr/bin/env node
const merger = require('./merger')
const os = require('os');
const SOURCE_DIR = "-s";
const SUPPORT_SUFFIX = "-ss";
const DEST_DIR = "-d";
const DEST_FILE_EXTENSION = "-de";
const SUPPORT_SUFFIX_SEPERETOR = "|";
let argvs = process.argv;
let sourceDir;
let supportSuffix = [".jar", ".zip"];
let destDir = os.homedir();
let destFileExtension = "jar";

for (let index = 0; index < argvs.length; index++) {
    if (argvs[index].toLocaleLowerCase() === SOURCE_DIR) {
        sourceDir = argvs[index + 1].trim()
        index++
    } else if (argvs[index].toLocaleLowerCase() === SUPPORT_SUFFIX) {
        supportSuffix = argvs[index + 1].trim().split(SUPPORT_SUFFIX_SEPERETOR)
        index++
    } else if (argvs[index].toLocaleLowerCase() === DEST_DIR) {
        destDir = argvs[index + 1].trim()
        index++
    } else if (argvs[index].toLocaleLowerCase() === DEST_FILE_EXTENSION) {
        destFileExtension = argvs[index + 1].trim()
        index++
    }
}

if (!sourceDir) {
    console.log("this script support these params, zipmerger -s xx [-ss xxx]")
    console.log("-s - the zip files locate path")
    console.log("-ss - the file suffix you want to handle, like .zip、.jar, your should use | to splt every suffix")
    console.log("-d - the location path of the merged zip file ")
    console.log("-de: the output file extensions ")
} else {
    merger.mergeZip(sourceDir, supportSuffix, destDir, destFileExtension)
}