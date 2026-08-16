## Setup

```sh
npm install express
npm install -D typescript tsx @types/node @types/express
npx tsc --init
```

```json
{
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node ."
  }
}
```

For testing:

```sh
npm install -D vitest supertest @types/supertest
```

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

For test files in `test/*.test.ts` like:

```ts
import { describe, expect, it } from "vitest";

describe("example", () => {
  it("works", () => {
    expect(1 + 1).toBe(2);
  });
});
```

To compile everything the `tsconfig.json` needs to have the following options:

```json
{
  "compilerOptions": {
    // Custom
    "rootDir": "src",
    "outDir": "dist",
    // Defaults
    // ...
  },
  // Custom
  "include": ["src"]
}
```

## Vitest

Basic structure:

```
The basic structure is:

describe():           Groups related tests
  └── it():           Defines an individual test
        └── expect(): Defines assertion as part of a test
```

Its also possible to nest describe:

```ts
describe('login', () => {
  beforeEach(() => {
    // runs before every test in this describe and its nested describes
  })
  describe('with valid credentials', () => {
    // ...
  })
  describe('with invalid credentials', () => {
    // ...
  })
  describe('when the account is locked', () => {
    // ...
  })
  afterEach(() => {
    // runs after every test in this describe and its nested describes
  })
})
```
