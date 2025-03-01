# GitHub Workflow Documentation

## Release Workflow

The release workflow is configured to automatically create new releases and publish to NPM whenever changes are merged into the `main` branch.

### Workflow Trigger

- Triggered on push events to the `main` branch

### Steps

1. **Checkout Repository**

   - Uses `actions/checkout@v4`
   - Fetches complete git history for proper versioning

2. **Setup Node.js**

   - Uses Node.js 20.x
   - Configures NPM registry URL

3. **Build and Test**

   - Installs dependencies
   - Runs test suite
   - Builds the project

4. **Version Management**

   - Automatically determines next version based on commit messages
   - Creates a new git tag
   - Uses [github-tag-action](https://github.com/mathieudutour/github-tag-action)

5. **Release Creation**

   - Creates a GitHub release
   - Includes automatically generated changelog
   - Tags are based on semantic versioning

6. **NPM Publishing**
   - Updates package.json version
   - Publishes package to NPM registry

### Required Secrets

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- `NPM_TOKEN`: Must be added to repository secrets for NPM publishing

### Version Bumping

The workflow uses conventional commits to determine version bumps:

- `fix:` or `fix(scope):` → patch bump
- `feat:` or `feat(scope):` → minor bump
- `BREAKING CHANGE:` in footer → major bump

### Example Commit Messages

```
feat: add new logger method
fix(core): resolve memory leak
feat!: redesign API (includes BREAKING CHANGE)
```
