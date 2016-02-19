#!/bin/bash
#
# Setup the config.js file to store the API keys and tokens

messages=()

if [[ -z "$1" ]]; then
  messages+=(" GitHub API Key")
fi

if [[ -z "$2" ]]; then
  messages+=(" GitHub User-Agent")
fi

if [[ -z "$3" ]]; then
  messages+=(" Slack Token")
fi

if [[ ${#messages[@]} > 0 ]]; then
  messages=$(IFS=, ; echo "${messages[*]}")
  echo "Y U NO GIVE$messages?"
  echo "Usage: $0 GITHUB_API_KEY GITHUB_USER_AGENT SLACK_TOKEN"

  exit 1
else
  cat config.example.js\
  | sed 's/${GITHUB_API_KEY}/'"$1"'/'\
  | sed 's/${GITHUB_USER_AGENT}/'"$2"'/'\
  | sed 's/${SLACK_TOKEN}/'"$3"'/'\
  > config.js

  exit
fi
