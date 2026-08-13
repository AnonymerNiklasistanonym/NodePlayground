## Setup

```sh
npm create vite@latest react_vite_ts -- --template react-ts
# formatting (default rules)
npm install -D oxfmt
```

```sh
# development server
npm run dev
# production preview
npm run preview
# production build
npm run build
# run production build
npx serve dist
```

Linting and Formatting:

```json
{
  "scripts": {
    "lint": "oxlint",
    "format": "oxfmt"
  }
}
```

```sh
npm run lint
npm run format
```
