# Releasing Volley Node.js SDK

This guide explains how to release a new version of the Volley Node.js SDK.

## Prerequisites

1. Ensure all tests pass:
   ```bash
   npm test
   ```

2. Ensure the code builds:
   ```bash
   npm run build
   ```

3. Update the version in `package.json`:
   ```json
   "version": "1.0.0"  // Update to new version
   ```

4. Ensure you're logged into npm (if publishing to npm registry):
   ```bash
   npm whoami
   # If not logged in:
   npm login
   ```

## Release Steps

### 1. Update Version

Update the version in `package.json` following [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### 2. Build the Package

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 3. Test the Package

Verify the package can be packed correctly:

```bash
npm pack --dry-run
```

This shows what files will be included in the published package.

### 4. Create a Git Tag

Tag the release with a semantic version (e.g., `v1.0.0`):

```bash
git add package.json
git commit -m "Bump version to 1.0.0"
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
git push origin main
```

**Important**: The tag name must start with `v` and match the version in `package.json` (without the `v` prefix).

### 5. Publish to npm (Optional)

If you want to publish to the npm registry:

```bash
npm publish --access public
```

**Note**: For scoped packages like `@volleyhq/volley-node`, you need to use `--access public` unless you have a paid npm account.

### 6. Create GitHub Release

1. Go to the GitHub repository: https://github.com/volleyhq/volley-node
2. Click "Releases" → "Draft a new release"
3. Select the tag you just created (e.g., `v1.0.0`)
4. Add release notes describing the changes
5. Publish the release

### 7. Verify Release

Test that the release can be installed:

```bash
# In a clean directory
mkdir test-release
cd test-release
npm init -y
npm install @volleyhq/volley-node@1.0.0
```

Or test from GitHub:

```bash
npm install github:volleyhq/volley-node#v1.0.0
```

## Versioning

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

## Example Release Workflow

```bash
# 1. Update package.json version
# "version": "1.0.0"

# 2. Build
npm run build

# 3. Test
npm test

# 4. Commit and tag
git add package.json
git commit -m "Bump version to 1.0.0"
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
git push origin main

# 5. Publish to npm (optional)
npm publish --access public

# 6. Create GitHub release manually
# Go to GitHub and create a release with the tag
```

## Notes

- The `prepublishOnly` script in `package.json` automatically runs `npm run build` before publishing
- Users can install from npm: `npm install @volleyhq/volley-node`
- Users can install from GitHub: `npm install github:volleyhq/volley-node#v1.0.0`
- The package name in `package.json` must match the npm scope/organization
- The repository URL in `package.json` must match the GitHub repository path

## Package Name Consistency

The package name `@volleyhq/volley-node` matches:
- GitHub organization: `volleyhq`
- Repository: `volleyhq/volley-node`
- npm scope: `@volleyhq` (requires npm organization or public access)

