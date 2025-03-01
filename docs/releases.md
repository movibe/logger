# Release Process

This project uses automated releases through GitHub Actions and a custom release script.

## Prerequisites

1. NPM account and token
2. GitHub repository access
3. Node.js installed

## Setting up NPM Token

1. Create an NPM token:

   - Go to npmjs.com
   - Access your account settings
   - Navigate to "Access Tokens"
   - Create a new token with "Publish" access

2. Add the token to GitHub repository secrets:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Create a new secret named `NPM_TOKEN`
   - Paste your NPM token as the value

## Creating a Release

1. Make sure your changes are committed and pushed to the main branch

2. Run the release script:

   ```bash
   ./scripts/release.sh
   ```

3. Select the release type:

   - `patch` (1): For bug fixes and minor changes
   - `minor` (2): For new features
   - `major` (3): For breaking changes

4. The script will:

   - Update the version in package.json
   - Create a git tag
   - Push changes and tag to GitHub

5. GitHub Actions will automatically:
   - Run tests
   - Build the project
   - Create a GitHub release
   - Publish to NPM

## Release Types

- **Patch** (1.0.0 -> 1.0.1): Bug fixes and minor changes
- **Minor** (1.0.0 -> 1.1.0): New features, backward compatible
- **Major** (1.0.0 -> 2.0.0): Breaking changes

## Troubleshooting

If the release fails:

1. Check GitHub Actions logs for errors
2. Verify NPM token is correctly set
3. Ensure all tests are passing
4. Check if version tag already exists
