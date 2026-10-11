# Monorepo

## Steps

Structure:

```
├── package.json           (root)
├── tsconfig.base.json     [extended by others]
├── apps/                  (deployable things like web apps)
│   └── webui/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/index.ts
└── packages/              (shared libraries used by apps)
    └── utils/
        ├── package.json
        ├── tsconfig.json
        └── src/index.ts
```

Files:

1. Create a root level `package.json`:

   ```json
   {
        "name": "monorepo",
        "private": true,
        "workspaces": [
            "apps/*",
            "packages/*"
        ],
        "scripts": {
            "build": "yarn workspaces run build",
            "dev": "yarn workspace @myrepo/webui dev",
            "typecheck": "yarn workspaces run typecheck"
        },
        "devDependencies": {
            "typescript": "^5.4.0",
            "ts-node": "^10.9.2",
            "@types/node": "^20.11.0"
        },
        "packageManager": "yarn@4.18.1"
   }
   ```

   `tsconfig.base.json`:

   ```json
   {
        "compilerOptions": {
            "target": "ES2022",
            "module": "commonjs",
            "moduleResolution": "node",
            "lib": ["ES2022"],
            "strict": true,
            "esModuleInterop": true,
            "skipLibCheck": true,
            "forceConsistentCasingInFileNames": true,
            "declaration": true,
            "declarationMap": true,
            "sourceMap": true,
            "composite": true,
            "incremental": true,
            "resolveJsonModule": true
        }
   }
   ```

2. Create packages like `packages/utils/package.json`:

   ```json
   {
       "name": "@myrepo/utils",
       "version": "1.0.0",
       "main": "dist/index.js",
       "types": "dist/index.d.ts",
       "scripts": {
           "build": "tsc -b",
           "typecheck": "tsc --noEmit"
       }
   }
   ```

   with `packages/utils/tsconfig.json`:

   ```json
   {
        "extends": "../../tsconfig.base.json",
        "compilerOptions": {
            "rootDir": "src",
            "outDir": "dist"
        },
        "include": ["src"]
   }
   ```

   and `apps/utils/src/index.ts`:

   ```ts
   export interface GreetingOptions {
       excited?: boolean;
   }

   export function greet(name: string, opts: GreetingOptions = {}): string {
       const msg = `Hello, ${name}`;
       return opts.excited ? `${msg}!!` : `${msg}.`;
   }
   ```

   And for the app `apps/webui/package.json`:

   ```json
   {
        "name": "@myrepo/webui",
        "version": "1.0.0",
        "main": "dist/index.js",
        "scripts": {
            "build": "tsc -b",
            "dev": "ts-node src/index.ts",
            "typecheck": "tsc --noEmit"
        },
        "dependencies": {
            "@myrepo/utils": "1.0.0"
        }
   }
   ```

   with `apps/webui/tsconfig.json`:

   ```json
   {
        "extends": "../../tsconfig.base.json",
        "compilerOptions": {
            "rootDir": "src",
            "outDir": "dist"
        },
        "include": ["src"],
        "references": [
            { "path": "../../packages/utils" }
        ]
   }
   ```

   and `apps/web/src/index.ts`:

   ```ts
   import { greet } from "@myrepo/utils";

   console.log(greet("World", { excited: true }));
   ```

Setup:

> You may need to install `corepack`:
>
> ```sh
> sudo pacman -S corepack
> ```
>
> You may also want to create a global symlink so you can use `yarn` in the console:
>
> ```sh
> sudo corepack enable
> ```

```sh
corepack install
corepack yarn install
yarn install
yarn workspaces list
# ➤ YN0000: .
# ➤ YN0000: apps/webui
# ➤ YN0000: packages/utils
# ➤ YN0000: Done in 0s
yarn build
yarn dev
```
