#! /bin/bash

source .env
source .id_token
source .session_token

if [ "#$1" == "#" ] ; then
    echo "Usage: ./create-qr-code <qid>"
    exit 1;
fi

curl -i -X DELETE \
    -H "x-api-key: test" \
    -H "session-token: $SESSION_TOKEN" \
    "http://localhost:8080/api/qrcode?qid=$1"