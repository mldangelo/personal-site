#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# This scripts makes a copy of the production database for a  #
# development server or your local machine.                   #
# run with -h for arguments or view file below                #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

NOW=`date +%s`

# Parse arguments
while [[ $# > 0 ]]
do
key="$1"
case $key in
  -i|--in)
  DB_IN="$2"
  shift # past argument
  ;;
  -o|--out)
  DB_OUT="$2"
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
    echo -e "\nMongo clone allows you to quickly clone a local database"
    echo -e "and add it back to your local mongodb instance under a new name.\n"
    echo -e "Allowed arguments:"
    echo -e "\t --help, -h: Display this message"
    echo -e "\t --in, -i: Specify name of database to be copied"
    echo -e "\t --out, -o: Specify name of copy\n"
    exit 2
fi

if [ -z "$DB_IN" ]
  then
    DB_IN="mldangelo"
fi

if [ -z "$DB_OUT" ]
  then
    DB_IN="mldangelobeta"
fi

mongo $DB_OUT --eval "db.dropDatabase()"
mongo --eval "db.copyDatabase('$DB_IN','$DB_OUT')"
END=`date +%s`
echo "Finished cloning database. Operation took $((END - NOW)) seconds."
