# Petru Broscenco — Atelier

Static one-page site for an atelier of architecture and interior finishing. Pure HTML/CSS/JS, no build step. Deployed automatically to GitHub Pages on every push to `main`.

## Structure

```
.
├── index.html            # Single-page site (IT primary, EN fallback)
├── styles.css            # Minimal stylesheet, ACPV-inspired
├── script.js             # Sticky nav, mobile menu, reveal-on-scroll
├── media/                # Web-optimized JPEGs (≤2000px, q=82) — what the site serves
├── IMAGES/               # Originals (full resolution) — kept for archival
└── .github/workflows/
    └── deploy.yml        # GitHub Pages deploy workflow
```

## Local preview

Any static server works. Easiest:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

1. Push to `main` on GitHub.
2. In the repo settings, under **Pages**, set **Source** to *GitHub Actions*.
3. The workflow at `.github/workflows/deploy.yml` builds and publishes the site.
4. URL: `https://<user>.github.io/<repo>/`

## Regenerating the optimized images

The `media/` folder is generated from `IMAGES/` with macOS `sips`. To rebuild:

```sh
for f in IMAGES/*.jpeg; do
  base=$(basename "$f" .jpeg)
  sips -Z 2000 -s format jpeg -s formatOptions 82 "$f" --out "media/${base}.jpg"
done
```

## Editing copy

All Italian and English copy lives directly in `index.html`. English fallback passages are tagged with the `.en` class — they appear as quiet italic notes beneath the Italian primary text.
