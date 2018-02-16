#!/bin/bash
#this script will clean burrow's backup files
BURRUW_OLD_FILES=($HOME/burrow-backup)

echo 
echo cleaning backup folder ....

if [ -d "$BURRUW_OLD_FILES" ]; then
    rm -r $BURRUW_OLD_FILES
else
    echo "There isn't any back up file!"    
fi

echo 
echo