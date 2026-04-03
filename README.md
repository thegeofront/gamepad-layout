# Gamepad Layout Generator

Tiny browser app to design and export custom gamepad layouts.

## Features
- Drag label/anchor positions on canvas
- Save and load layout configs as JSON
- Export the final layout as PNG
- Theme color + multiple config presets

## Run locally
Open `index.html` directly, or use a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy (GitHub Pages)
This repo includes a GitHub Action at `.github/workflows/deploy-pages.yml`.

After pushing to `master`, GitHub Actions deploys the app to Pages automatically.
