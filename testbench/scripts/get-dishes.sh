#! /bin/bash

source .env
source .id_token
source .session_token

if [ "#$ID_TOKEN" == "#" ] || [ "#$SESSION_TOKEN" == "#" ] ; then
    echo "Run the script to get the tokens first"
    exit 1;
fi

curl -i -X GET \
    -H "x-api-key: test" \
    -H "session-token: $SESSION_TOKEN" \
    "http://localhost:8080/api/dish?all=$ALL_DISHES&transaction=$WITH_TRANSACTIONS"