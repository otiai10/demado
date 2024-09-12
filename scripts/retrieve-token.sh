#!/bin/bash

source ../.env

open "https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=${CLIENT_ID}&redirect_uri=urn:ietf:wg:oauth:2.0:oob"

read -p "Enter the code: " CODE

if [ -z "$CODE" ]; then
    echo "Code is required"
    exit 1
fi

curl "https://accounts.google.com/o/oauth2/token" -d \
    "client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${CODE}&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
