# TrackApkTool
a script aim to find the class in apk that has specific constant string、function and so on and the resource name used with the explicit name

## usage
use npm install this package first - npm install trackapktool

thn run the command like this - trackapktool -a xx -t xxx -r

+ -a:indicate the apk path
+ -t: the regex you want to to search in apk
+ -r: indicate we want search resource name usage in apk

after the programe finished, it will generate a file named `result_report.json` at the directory which the apk file locate
