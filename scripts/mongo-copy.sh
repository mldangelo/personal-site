#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# This scripts makes a copy of the production database for a  #
# development server or your local machine.                   #
# run with -h for arguments or view file below                #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

NOW=`date +%s`
PRODUCTION_USER="ubuntu"
PRODUCTION_HOST="mldangelo.com"

# Parse arguments
while [[ $# > 0 ]]
do
key="$1"
case $key in
  -s|--server)
  SERVER="$2"
  shift # past argument
  ;;
  -k|--key)
  KEY="$2"
  shift # past argument
  ;;
  -n|--name)
  DB_NAME="$2"
  shift # past argument
  ;;
  -h|--help)
  HELP=1
  ;;
  *) # unknown option
  UNKNOWN=1
  ;;
esac
shift # past argument or value
done

if [[ "$UNKNOWN" -eq 1 ]]
  then
    echo -e "\nError: Unkown argument."
    HELP=1
fi

if [[ "$HELP" -eq 1 ]]
  then
    echo -e "\nMongo copy allows you to quickly make a copy of a remote"
    echo -e "mongo database and add it to your local mongodb instance.\n"
    echo -e "Allowed arguments:"
    echo -e "\t --help, -h: Display this message"
    echo -e "\t --key, -k: Specify path to ssh key"
    echo -e "\t --name, -n: Specify mongodb database name"
    echo -e "\t --server, -s: Specify user@host or ssh identity\n"
    exit 2
fi

# set server
if [ -z "$SERVER" ]
  then
    SERVER=$PRODUCTION_USER@$PRODUCTION_HOST
fi

# set key
if [ ! -z "$KEY" ]
  then
    SSHCMD="-i $KEY $SERVER"
  else
    SSHCMD="$SERVER"
fi

if [ -z "$DB_NAME" ]
  then
    DB_NAME="mldangelo"
fi

# Directory where temporary files will be temporarily stored
BACKUP_DIR=/tmp/${DB_NAME}_mongo_backup_${NOW}

# Check if monogodb is running
if pgrep "mongod" > /dev/null
  then
      echo "Local instance of mongodb is running."
  else
      echo "Local instance of mongodb is not running. Please start mongodb and run script again."
      exit -1
fi

# Check if ssh works
ssh -q $SSHCMD exit
if [ "$?" -eq  "0" ]
  then
    echo "SSH CONNECTION SUCCESSFUL"
  else
    echo "SSH ERROR: check manual connection before trying again."
    exit -1
fi

COPY_CMD="mkdir $BACKUP_DIR; mongodump -d $DB_NAME -o $BACKUP_DIR"
DELETE_CMD="rm -rf $BACKUP_DIR"

echo "EXPORTING DB:$COPY_CMD"
ssh $SSHCMD $COPY_CMD

echo "TRANSFERING DB"
rsync -avzP -e ssh $SSHCMD:$BACKUP_DIR /tmp

echo "IMPORTING DB"
mongorestore --noIndexRestore -d $DB_NAME --drop $BACKUP_DIR/$DB_NAME

echo "REMOVING TEMPORARY FILES"
ssh $SSHCMD $DELETE_CMD
rm -rf $BACKUP_DIR
END=`date +%s`
echo "Finished copying database. Operation took $((END - NOW)) seconds."
