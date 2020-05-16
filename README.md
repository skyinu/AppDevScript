# AppDevScript
## description
this repo aims to record scripts developed by me, these scripts are used to solve some problems I encountered when developing android applications.

## Scripts

### TrackApkTool
a script aim to find the class in apk that has specific constant string、function and so on and the resource name used with the explicit name

#### usage
use npm install this package first - npm install trackapktool

thn run the command like this - trackapktool -a xx -t xxx -r

+ -a:indicate the apk path
+ -t: the regex you want to to search in apk
+ -r: indicate we want search resource name usage in apk

after the programe finished, it will generate a file named `result_report.json` at the directory which the apk file locate

### ZipMerger
a script to merge multi zip file to one. today we use javaassist/asm in Android Transform heavily, but when we want to see the result class file, it may cause a problem. There are a lot of jar file in transform directory, we need to unzip one by one to find the class you want to see, the I write this script, it can merge the jar files to one, then you can use jd-gui to see the class convenient.

#### usage

use npm install this package first - `npm install zipmerger`

thn run the command like this - zipMerger -s xx -ss xxx -d xxx

- -s: the zip files locate path, like D:\src
- -ss: the file suffix you want to handle, like .zip、.jar, your should use | to splt every suffix
- -d: the location path of the merged zip file
- -de: the output file extensions
