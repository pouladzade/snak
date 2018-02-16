#!/bin/bash
#this script will install burrow and their requirments for you
BURRUW_INSTALL_DIR=(/usr/bin/burrow)
BURRUW_INSTALL_FILES_DIR=($HOME/.burrow)
BURRUW_OLD_FILES=($HOME/burrow-backup)
BURRUW_FILES_DIR=($1) #(./burrow-files)
BURROW_DIR=($2) #(./burrow)

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
sudo cp $BURROW_DIR $BURRUW_INSTALL_DIR
cp -r $BURRUW_FILES_DIR/* $BURRUW_INSTALL_FILES_DIR/


echo 
echo
echo "you can run burrow with this command: burrow serve --work-dir $HOME/.burrow"
echo
echo "you can also use burrow.sh for more convenient"

