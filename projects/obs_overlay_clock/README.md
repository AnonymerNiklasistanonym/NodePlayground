# obs-overlay-clock

A simple OBS (Open Broadcaster Software) overlay of the current time (and optional country flag)

## How to use?

- Either run the webserver locally or use the GitHub page link
- Configure your preferred layout, font size, country flag, time format
- Copy the URL and paste it into your OBS studio browser source

## Build

```sh
npm install
npm run build
# creates a 'dist' directory that contains a static HTML/JS/CSS website
```

## Run website

1. Static webserver

   ```
   npx serve dist
   ```

2. Production preview

   ```sh
   npm run preview
   ```

## Development

- Development preview

  ```
  npm run dev
  ```

- Formatting

  ```
  npm run format
  # only validate
  npm run format:check
  ```

- Linting

  ```
  npm run lint
  # only validate
  npm run lint:check
  ```

## Setup

```sh
# create vite template
npm create vite@latest obs-overlay-music-linux -- --template react-ts
# support multiple languages and detect/save them
npm install i18next react-i18next i18next-browser-languagedetector
# support multiple routes
npm install react-router-dom
# format files
npm install oxfmt
```

Structure:

```
├── assets/
├── src/
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── de.json
│   ├── App.css
│   ├── App.tsx
│   ├── index.css (global styles)
│   └── main.tsx
└── index.html
```