#!/bin/bash

NAME=$1

if [ $# -eq 0 ]; then
  echo "No arguments provided"
  exit 0
fi

bitlockerDir="/media/bitlocker-$NAME"
bitlockerMountDir="/media/bitlockermount-$NAME"


/usr/bin/umount $bitlockerMountDir
if [ -f "$bitlockerDir/dislocker-file" ]; then
  /usr/bin/umount $bitlockerDir
fi

/usr/bin/rm -rf $bitlockerDir
/usr/bin/rm -rf $bitlockerMountDir
