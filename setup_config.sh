#!/bin/bash
#
# Setup the config.js file to store the API keys and tokens

if [[ "$1" && "$2" && "$3" ]]; then
  cat config.example.js\
  | sed 's/${GITHUB_API_KEY}/'"$1"'/'\
  | sed 's/${GITHUB_USER_AGENT}/'"$2"'/'\
  | sed 's/${SLACK_TOKEN}/'"$3"'/'\
  > config.js
else
  echo "Usage: $0 GITHUB_API_KEY GITHUB_USER_AGENT SLACK_TOKEN"

  exit 1
fi

exit
