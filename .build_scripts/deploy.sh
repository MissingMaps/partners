#!/usr/bin/env bash
set -e # halt script on error

# If this is the deploy branch, push it up to gh-pages
if [ $CIRCLE_BRANCH = ${DEPLOY_BRANCH} ]; then
  echo "Get ready, we're pushing to gh-pages!"
  git config user.name  $USERNAME
  git config user.email $EMAIL
  node_modules/.bin/gh-pages -d _site -b gh-pages -r "https://github.com/${CIRCLE_REPOSITORY_URL}.git"
else
  echo "Not a publishable branch so we're all done here"
fi
