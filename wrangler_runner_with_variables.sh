#!/bin/sh -e

# compose command to run wrangler with env variables read from .env
ENV_FILE_PATH=$1

echo "loading variables from ${ENV_FILE_PATH} ..."
source ${ENV_FILE_PATH}
ENV_VARIABLES=$(grep -vE "COMMAND|^#" ${ENV_FILE_PATH})
ENV_VARIABLES=$(echo ${ENV_VARIABLES})

echo "executing command '${COMMAND1} ${ENV_VARIABLES} ${COMMAND2}' ..."
echo ""

${COMMAND1} ${ENV_VARIABLES} ${COMMAND2}
