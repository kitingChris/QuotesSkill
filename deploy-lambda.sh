#!/bin/bash
if [ -z "$1" ]; then
    echo "No lambda function to update"
    exit 1
fi

LAMBDA_FUNCTION="$1"
rm artifact.zip
cd src
zip -X -r ../artifact.zip *
cd ..
aws lambda update-function-code --function-name "$LAMBDA_FUNCTION" --zip-file fileb://artifact.zip
