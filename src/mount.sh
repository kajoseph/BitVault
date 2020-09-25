#!/bin/bash

set -e # stop the script if any command fails

NAME=$1
PATH=$2
PASS=$3


if [ $# -eq 0 ]; then
  echo "No arguments provided"
  exit 0
elif [ -z "$1" ]; then
  echo "Missing first parameter 'name'"
  exit 0
elif [ -z "$2" ]; then
  echo "Missing second parameter 'path'"
  exit 0
fi

bitlockerDir="/media/bitlocker-$1"
bitlockerMountDir="/media/bitlockermount-$1"

if [ ! -d "$bitlockerDir" ]; then
  /usr/bin/mkdir -p $bitlockerDir
elif [ -f "$bitlockerDir/dislocker-file" ]; then
  /usr/bin/umount $bitlockerDir
fi

if [ ! -d "$bitlockerMountDir" ]; then
  /usr/bin/mkdir -p $bitlockerMountDir
fi

/usr/bin/dislocker $2 -u$3 -- $bitlockerDir
/usr/bin/mount -o loop $bitlockerDir/dislocker-file $bitlockerMountDir

