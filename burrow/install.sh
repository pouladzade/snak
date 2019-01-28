#!/bin/bash
#this script will install burrow and their requirments for you

BURRUW_INSTALL_FILES_DIR=($HOME/burrow)
BURRUW_OLD_FILES=($HOME/burrow-backup)
BURRUW_FILES_DIR=$1



echo 
echo copying burrow files....

##########################################################################
# we create a folder named burrow-backup and put the burrow old files in it
# if already existed
if [ -d "$BURRUW_INSTALL_FILES_DIR" ]; then

    echo the file already existed, trying to back up the old files.    

    if [ ! -d "$BURRUW_OLD_FILES" ]; then
        mkdir $BURRUW_OLD_FILES
    fi

    NEW=$(date "+%Y.%m.%d-%H.%M.%S")
    mkdir $BURRUW_OLD_FILES/$NEW
    mv -v $BURRUW_INSTALL_FILES_DIR/* $BURRUW_OLD_FILES/$NEW
    rm -r $BURRUW_INSTALL_FILES_DIR
fi

# copying burrow's stuffs
mkdir $BURRUW_INSTALL_FILES_DIR
cp -R $BURRUW_FILES_DIR/. $BURRUW_INSTALL_FILES_DIR/


echo Finished!

