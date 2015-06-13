#!/bin/bash
mkdir ../temp
cd ../temp

git config --global user.email "jlopez@twocentz.co"
git config --global user.name "Codeship"
git clone git@github.com:twocentz/twocentz-ui.git
cd twocentz-ui

# Update version
line=`cat package.json | jq '.version' | sed 's/"//g'` 
echo "Old version: $line"
IFS='\\.' read -a arr <<< "$line"

version="${arr[0]}.${arr[1]}.$(( ${arr[2]} + 1))" 
echo "New version: $version"
str="s/version\": \"$line/version\": \"$version/"
sed -i "$str" package.json

# Push version to github
git add .
git commit -m "[skip ci] Updating version to $version"
git push