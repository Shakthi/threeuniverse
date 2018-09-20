#!/bin/bash
oldversion=$(node build/version.js 2>/dev/null )
newversion=$(md5 build/universe.bundle.js|cut -f 4 -d ' ' )

if [[ $oldversion != $newversion ]];then
 echo -e "console.log(\"$newversion\")">build/version.js
fi


