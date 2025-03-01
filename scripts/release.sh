#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Get the current version from package.json
current_version=$(node -p "require('./package.json').version")

# Determine release type
echo "Current version: $current_version"
echo "Select release type:"
echo "1) patch (bug fixes)"
echo "2) minor (new features)"
echo "3) major (breaking changes)"
read -p "Enter choice [1-3]: " choice

case $choice in
  1) release_type="patch";;
  2) release_type="minor";;
  3) release_type="major";;
  *) echo "Invalid choice" && exit 1;;
esac

# Update version
npm version $release_type

# Get the new version
new_version=$(node -p "require('./package.json').version")

# Push changes and tags
git push
git push origin v$new_version 