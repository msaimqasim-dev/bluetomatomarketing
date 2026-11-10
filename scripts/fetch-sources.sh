#!/usr/bin/env bash
# Re-downloads the official Blue Tomato source material used by the pipeline
# (homepage HTML, logo, full-resolution project images, founder portrait and
# the identity-work tiles) into ./research. Run from the project root:
#   bash scripts/fetch-sources.sh
#   npm i --no-save sharp && node scripts/process-assets.mjs
#   node scripts/generate-content.mjs
set -euo pipefail
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
SITE="https://bluetomatomarketing.com"
get() { curl -fsSL -A "$UA" -o "$1" "$2"; }
mkdir -p research/orig research/raw/logos research/raw/misc

get research/home.html "$SITE/"
get research/logo.svg "$SITE/assets/img/blue-tomato.svg"
get research/raw/misc/og.png "$SITE/assets/img/open-graph.png"
get research/raw/misc/favicon.ico "$SITE/favicon.ico"
get research/raw/misc/kim.jpg "https://bluetomatodesign.com/uploads/pages/kim-collins-blue-tomato-pittsburgh-founder-ceo.jpg"

# Homepage project slideshow - originals (1920x812 / 1600x677)
grep -o 'src="/uploads/pages/1600-677/crop/[^"]*"' research/home.html | sed 's#.*/crop/##; s#"$##' | sort -u | while read -r file; do
  get "research/orig/$file" "$SITE/uploads/pages/$file"
done

# Identity work tiles from /portfolio/logos (800x800)
for file in \
  "brighton-resources-blue-tomato-design-pittsburgh-logos.jpg" \
  "carmell-therapeutics-blue-tomato-design-pittsburgh-logos.jpg" \
  "clward-blue-tomato-design-pittsburgh-logos-5e1b55ca3921b.jpg" \
  "curis-decontamination-blue-tomato-design-pittsburgh-logos-copy-65e5deb77b1b1.png" \
  "esquire-legal-services-blue-tomato-design-pittsburgh-logos.jpg" \
  "first-insight-blue-tomato-design-pittsburgh-logos.jpg" \
  "flatiron-energy-partners-blue-tomato-design-pittsburgh-logos.jpg" \
  "geonetix-blue-tomato-design-pittsburgh-logos.jpg" \
  "head-right-games-blue-tomato-design-pittsburgh-logos-5e1b579569260.jpg" \
  "m3-creative-media-blue-tomato-design-pittsburgh-logos-5e1b58924c887.jpg" \
  "neurointerventions-blue-tomato-design-pittsburgh-logos-5e1e79d73d1e5.jpg" \
  "pro-flo-blue-tomato-design-pittsburgh-logos.jpg" \
  "spiralgen-blue-tomato-design-pittsburgh-logos-copy.png" \
  "virtual-mgr-tony-morocco-blue-tomato-design-pittsburgh-logos-copy.png" \
  "vista-energy-resources-blue-tomato-design-pittsburgh-logos.jpg" \
  "wpts-radio-blue-tomato-design-pittsburgh-logos-5e1b5a41570ea.jpg"; do
  get "research/raw/logos/$file" "$SITE/uploads/projects/800-800/fit/$file"
done
echo "Sources downloaded to ./research"
