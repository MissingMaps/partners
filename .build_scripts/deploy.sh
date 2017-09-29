#!/usr/bin/env bash
set -e # halt script on error

# If this is the deploy branch, push it up to gh-pages
if [ $TRAVIS_PULL_REQUEST = "false" ] && [ $TRAVIS_BRANCH = ${DEPLOY_BRANCH} ]; then
  echo "Get ready, we're pushing to gh-pages!"
  git config user.name "Travis-CI"
  git config user.email "travis@somewhere.com"
  node_modules/.bin/gh-pages -x -d _site -b gh-pages -r "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git"
else
  echo "Not a publishable branch so we're all done here"
fi
