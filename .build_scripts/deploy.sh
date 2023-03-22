#!/usr/bin/env bash
set -e # halt script on error

# If this is the deploy branch, push it up to gh-pages
if [ $CIRCLE_BRANCH = ${DEPLOY_BRANCH} ]; then
  echo "CIRCLE_BRANCH: "$CIRCLE_BRANCH
  echo "DEPLOY_BRANCH: " $DEPLOY_BRANCH
  echo "\$DEPLOY_BRANCH: " ${DEPLOY_BRANCH}
  echo "Get ready, we're pushing to gh-pages!"
  git config user.name  $USERNAME
  git config user.email $EMAIL
  node_modules/.bin/gh-pages --dist _site --branch gh-pages --repo "https://${GH_TOKEN}github.com/${CIRCLE_REPOSITORY_URL}.git"
else
  echo "Not a publishable branch so we're all done here"
fi
