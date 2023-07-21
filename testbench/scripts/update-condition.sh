#! /bin/bash

source .env
source .id_token
source .session_token

if [ "#$ID_TOKEN" == "#" ] || [ "#$SESSION_TOKEN" == "#" ] ; then
    echo "Run the script to get the tokens first"
    exit 1;
fi

if [ "#$1" == "#" ] ; then
    echo "Usage: ./update-condition.sh <condition>"
    exit 1
fi

curl -i -X POST \
    -H "x-api-key: test" \
    -H "session-token: $SESSION_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"condition\" : \"$1\"}" \
    http://localhost:8080/api/dish/condition?qid=$QID