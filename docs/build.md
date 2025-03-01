# Build Process

The build process for this package consists of two steps:

1. TypeScript Compilation (`tsc`)

   - Generates type definitions (`.d.ts` files)
   - Ensures type safety
   - Output directory: `dist/`

2. Bun Bundling
   - Bundles the JavaScript code
   - Optimizes for production
   - Output directory: `dist/`

## Commands

```bash
# Build the package
npm run build

# This will:
# 1. Run TypeScript compiler to generate types
# 2. Use Bun to create the optimized bundle
```

## Configuration

The TypeScript configuration in `tsconfig.json` is set up to:

- Generate declaration files (`declaration: true`)
- Use ES2018 as the target
- Enable strict type checking
- Output to the `dist/` directory
