# Publishing Sysmoon SDKs

This guide covers publishing the JavaScript and C# SDKs to public registries (npm and NuGet) and GitHub Packages.

## Prerequisites

### For Both SDKs

- Ensure the workspace builds cleanly: `pnpm build` (JS) and `dotnet build` (C#)
- Update version numbers in package metadata before publishing
- Commit and push changes to the repository

### For npm (JavaScript SDK)

- npm account at [npmjs.com](https://www.npmjs.com)
- npm CLI installed (`npm --version`)
- Authenticated with: `npm login` or `NPM_TOKEN` environment variable

### For NuGet (C# SDK)

- NuGet account at [nuget.org](https://www.nuget.org)
- .NET SDK 8.0 or later (`dotnet --version`)
- NuGet API key from your account settings

### For GitHub Packages (Both SDKs)

- GitHub Personal Access Token (PAT) with `read:packages` and `write:packages` scopes
- Set `NODE_AUTH_TOKEN` (Node.js) or use `--api-key` (dotnet) with the PAT

---

## JavaScript SDK (`sdks/js`)

### Step 1: Prepare for Release

Update the version in [sdks/js/package.json](../sdks/js/package.json):

```json
{
  "version": "1.0.2"
}
```

Increment versions following [Semantic Versioning](https://semver.org/):

- Patch (1.0.1 → 1.0.2): bug fixes
- Minor (1.0.0 → 1.1.0): backward-compatible features
- Major (1.0.0 → 2.0.0): breaking changes

### Step 2: Build and Test

```bash
cd sdks/js
pnpm install
pnpm build
```

Verify `dist/` contains:

- `index.js` (CommonJS)
- `index.mjs` (ES Module)
- `index.d.ts` (TypeScript declarations)

### Step 3: Publish to npm

#### Option A: Interactive Login

```bash
npm login
cd sdks/js
npm run publish:npm
```

#### Option B: Token-Based (CI/CD)

```bash
cd sdks/js
npm publish --access public --registry https://registry.npmjs.org/
```

Set `NPM_TOKEN` in your environment:

```bash
export NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
npm publish --access public
```

### Step 4: Publish to GitHub Packages (Optional)

```bash
cd sdks/js
npm run publish:github
```

Requires `NODE_AUTH_TOKEN` set to a GitHub PAT:

```bash
export NODE_AUTH_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
npm publish --registry https://npm.pkg.github.com
```

### Troubleshooting

**"403 Forbidden" or "You need to be logged in"**

- Run `npm login` or set `NPM_TOKEN`
- Verify token has publish permissions

**"You cannot publish over an existing version"**

- Bump version in [sdks/js/package.json](../sdks/js/package.json)
- Rebuild and retry

**"dist/ directory not found"**

- Run `pnpm build` first
- Verify `files` whitelist in [package.json](../sdks/js/package.json) includes `dist/`

---

## C# SDK (`sdks/csharp`)

### Step 1: Prepare for Release

Update the version in [sdks/csharp/Sysmoon.SDK/Sysmoon.SDK.csproj](../sdks/csharp/Sysmoon.SDK/Sysmoon.SDK.csproj):

```xml
<Version>1.0.1</Version>
```

Follow [Semantic Versioning](https://semver.org/).

### Step 2: Build and Pack

```bash
dotnet build "sdks/csharp/Sysmoon.SDK/Sysmoon.SDK.csproj" -c Release
dotnet pack "sdks/csharp/Sysmoon.SDK/Sysmoon.SDK.csproj" -c Release
```

Verify the `.nupkg` exists in `sdks/csharp/Sysmoon.SDK/bin/Release/`:

```
Sysmoon.SDK.1.0.1.nupkg
```

### Step 3: Publish to NuGet

1. Get your API key from [nuget.org](https://www.nuget.org/account/apikeys)

2. Publish:

```bash
dotnet nuget push "sdks/csharp/Sysmoon.SDK/bin/Release/Sysmoon.SDK.1.0.1.nupkg" \
  --api-key YOUR_NUGET_API_KEY \
  --source https://api.nuget.org/v3/index.json
```

#### Option: Store API Key Locally

```bash
dotnet nuget update source nuget.org -u __token__ -p YOUR_NUGET_API_KEY --store-password-in-clear
dotnet nuget push "sdks/csharp/Sysmoon.SDK/bin/Release/Sysmoon.SDK.1.0.1.nupkg" \
  --source https://api.nuget.org/v3/index.json
```

### Step 4: Publish to GitHub Packages (Optional)

```bash
dotnet nuget push "sdks/csharp/Sysmoon.SDK/bin/Release/Sysmoon.SDK.1.0.1.nupkg" \
  --api-key ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  --source https://nuget.pkg.github.com/NextStep-Software-Solutions-Inc/index.json
```

### Troubleshooting

**"TreatWarningsAsErrors"**

- Ensure C# SDK builds without warnings:

  ```bash
  dotnet build "sdks/csharp/Sysmoon.SDK/Sysmoon.SDK.csproj" -c Release
  ```

- Fix or suppress warnings before packing

**"401 Unauthorized" or "Invalid API key"**

- Verify the API key is correct and active
- Check that the key has push permissions

**"Conflict: The feed rejected the request"**

- Version already exists on NuGet
- Bump version and re-pack

**Missing README.md**

- Ensure `sdks/csharp/Sysmoon.SDK/README.md` exists
- Verify `PackageReadmeFile` in `.csproj` points to it

---

## Release Workflow

### Full Release Checklist

1. **Increment versions**
   - JS: [sdks/js/package.json](../sdks/js/package.json) → `version`
   - C#: [sdks/csharp/Sysmoon.SDK/Sysmoon.SDK.csproj](../sdks/csharp/Sysmoon.SDK/Sysmoon.SDK.csproj) → `<Version>`

2. **Build both SDKs**

   ```bash
   pnpm install && pnpm build          # JS
   dotnet build ... -c Release         # C#
   ```

3. **Commit changes**

   ```bash
   git add sdks/
   git commit -m "chore: bump SDK versions to v1.0.2"
   git push origin copilot/build-real-time-monitoring-system
   ```

4. **Publish both**

   ```bash
   # JS
   npm login
   cd sdks/js && npm run publish:npm
   
   # C#
   dotnet nuget push "sdks/csharp/..." --api-key $NUGET_KEY --source https://api.nuget.org/v3/index.json
   ```

5. **Tag and release**

   ```bash
   git tag -a v1.0.2 -m "Release v1.0.2: JS and C# SDKs"
   git push origin v1.0.2
   ```

   Create a GitHub Release with links to npm and NuGet package pages.

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/publish-sdks.yml`:

```yaml
name: Publish SDKs

on:
  workflow_dispatch:
    inputs:
      js_version:
        description: 'JS SDK version (e.g., 1.0.2)'
        required: false
      csharp_version:
        description: 'C# SDK version (e.g., 1.0.2)'
        required: false

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      
      - name: Build and publish JS SDK
        if: ${{ inputs.js_version }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          cd sdks/js
          npm install
          npm run build
          npm publish --access public
      
      - name: Build and publish C# SDK
        if: ${{ inputs.csharp_version }}
        run: |
          cd sdks/csharp/Sysmoon.SDK
          dotnet build -c Release
          dotnet pack -c Release
          dotnet nuget push bin/Release/*.nupkg \
            --api-key ${{ secrets.NUGET_API_KEY }} \
            --source https://api.nuget.org/v3/index.json
```

---

## Package Links

### npm

- **Package:** [@sysmoon/sdk-js](https://www.npmjs.com/package/@sysmoon/sdk-js)
- **Installation:** `npm install @sysmoon/sdk-js`

### NuGet

- **Package:** [Sysmoon.SDK](https://www.nuget.org/packages/Sysmoon.SDK)
- **Installation:** `dotnet add package Sysmoon.SDK`

### GitHub Packages

- **JS:** [@NextStep-Software-Solutions-Inc/sdk-js](https://github.com/orgs/NextStep-Software-Solutions-Inc/packages/npm/sdk-js)
- **C#:** [Sysmoon.SDK](https://github.com/orgs/NextStep-Software-Solutions-Inc/packages/nuget/sysmoon-sdk)

---

## References

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [NuGet Publishing Guide](https://learn.microsoft.com/en-us/nuget/nuget-org/publish-a-package)
- [Semantic Versioning](https://semver.org/)
- [GitHub Packages Documentation](https://docs.github.com/en/packages)
