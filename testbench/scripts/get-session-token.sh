#! /bin/bash

source .env
source .id_token

if [ "#$ID_TOKEN" == "#" ] ; then
    echo "Run the script to get the tokens first"
    exit 1;
fi

curl -i -X POST \
    -H "x-api-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"idToken\" : \"$ID_TOKEN\"}" \
    http://localhost:8080/api/auth/login/
    
