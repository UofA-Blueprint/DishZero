#! /bin/bash

source .env
source .id_token
source .session_token

if [ "#$1" == "#" ] || [ "#$2" == "#" ] ; then
    echo "Usage: ./create-qr-code <qid> <dishid>"
    exit 1;
fi

curl -i -X POST \
    -H "x-api-key: test" \
    -H "session-token: $SESSION_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{ \"qrCode\" : {\"qid\" : $1, \"dishID\" : \"$2\"} }" \
    http://localhost:8080/api/qrcode/update