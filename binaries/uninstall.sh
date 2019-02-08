#!/bin/bash
#this script will uninstall burrow and corresponding files

BURRUW_INSTALL_FILES_DIR=($HOME/burrow)

echo 
echo uninstalling burrow ....

##########################################################################
# we create a folder named burrow-backup and put the burrow old files in it
# if already existed
if [ -d "$BURRUW_INSTALL_FILES_DIR" ]; then
    rm -R $BURRUW_INSTALL_FILES_DIR
fi


echo 
echo Finished!

