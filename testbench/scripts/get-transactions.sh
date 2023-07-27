#! /bin/bash

source .env
source .id_token
source .session_token
source .pagination

if [ "#$ID_TOKEN" == "#" ] || [ "#$SESSION_TOKEN" == "#" ] ; then
    echo "Run the script to get the tokens first"
    exit 1;
fi

page=$1
size=$2

if [ "#$page" == "#" ] || [ "#$size" == "#" ] ; then
    echo "Usage: ./get-transactions.sh <page-number> <page-size>"
    exit 1;
fi

if [ "#$PREV_PAGE" == "#" ] ; then 
    export PREV_PAGE=1
fi

if [ "#$NEXT_PAGE" == "#" ] ; then 
    export NEXT_PAGE=1
fi

if [ "#$START_AFTER" == "#" ] ; then 
    export START_AFTER=1
fi

content=$(curl -s -X GET \
    -H "x-api-key: test" \
    --cookie "session=$SESSION_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{ \"pagination\" : {\"prevPage\" : $PREV_PAGE, \"nextPage\" : $NEXT_PAGE, \"startAfter\" : $START_AFTER} }" \
    "http://localhost:8080/api/transactions?all=$ALL_TRANSACTIONS&page=$page&size=$size")

echo $content

pagination=$(jq -r '.pagination' <<<"$content")
startAfter=$(jq -r '.startAfter' <<<"$pagination")
prevPage=$(jq -r '.prevPage' <<<"$pagination")
nextPage=$(jq -r '.nextPage' <<<"$pagination")

printf "export START_AFTER=$startAfter\nexport PREV_PAGE=$prevPage\nexport NEXT_PAGE=$nextPage\n" >> .pagination

