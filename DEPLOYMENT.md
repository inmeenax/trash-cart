# Maison Hampers deployment

## GitHub Pages
Upload to the root of the new GitHub Pages repository:
- index.html
- shop.html
- occasions.html
- custom.html
- about.html
- contact.html
- style.css
- script.js
- assets/logo.svg
- assets/favicon.svg
- robots.txt
- sitemap.xml

Site:
https://inmeenax.github.io/trash-cart/

GitHub Pages can publish from a branch and the root folder.

## Cloudflare Worker
Use `cloudflare-worker/worker.js` in the existing Worker:
https://watchpays-api.rowelix153.workers.dev/

Dashboard:
Workers & Pages -> watchpays-api -> Settings -> Variables and Secrets

Add:
1. Variable `MERCHANT_ID` = your merchant ID
2. Secret `WATCHPAYS_API_KEY` = your NEW WatchPays API key

Deploy.

The storefront is the GitHub URL. The WatchPays server callback is the Worker callback:
https://watchpays-api.rowelix153.workers.dev/callback

This distinction matters because GitHub Pages is static and cannot process a server-side POST callback.

## Editable placeholders
Edit these at the top of `script.js`:
- `WA_NUMBER`
- `SITE_URL`
- product data in `PRODUCTS`
- packaging prices in `PACKAGING`

Also edit footer phone/email/Instagram in the HTML when ready.
