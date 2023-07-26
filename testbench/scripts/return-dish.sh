#! /bin/bash

source .env
source .id_token
source .session_token
source .dish

curl -i -X POST \
    -H "x-api-key: test" \
    -H "session-token: $SESSION_TOKEN" \
     -H "Content-Type: application/json" \
    -d "{ \"returned\" : {\"broken\" : false, \"lost\" : \"false\"} }" \
    http://localhost:8080/api/dish/return?qid=$QID