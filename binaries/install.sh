#!/bin/bash
#this script will install burrow and their requirments for you

BURRUW_INSTALL_FILES_DIR=($HOME/burrow)
BURRUW_OLD_FILES=($HOME/burrow-backup)
OS_TYPE=$1

if [ -e "burrow" ]; then
    rm -r ./burrow
fi

if [ OS_TYPE="linux" ] && [ ! -e "burrow_0.23.3_Linux_x86_64.tar.gz" ]; then
    wget https://github.com/hyperledger/burrow/releases/download/v0.23.3/burrow_0.23.3_Linux_x86_64.tar.gz
elif [ OS_TYPE="darwin" ] && [ ! -e "burrow_0.23.3_Darwin_x86_64.tar.gz" ]; then
    wget https://github.com/hyperledger/burrow/releases/download/v0.23.3/burrow_0.23.3_Darwin_x86_64.tar.gz
else
    echo "Can not support OS!!!"
fi

tar xvf burrow_0.23.3_Linux_x86_64.tar.gz

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
cp   ./burrow  $BURRUW_INSTALL_FILES_DIR/burrow

sleep 2
cd $BURRUW_INSTALL_FILES_DIR
pwd
./burrow spec --participant-accounts=10 --full-accounts=10 > genesis-spec.json
./burrow configure --genesis-spec=genesis-spec.json > burrow.toml


echo Finished!

