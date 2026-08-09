# Donor.az — Frontend

SvelteKit tətbiqi. Ümumi quraşdırma və mühit dəyişənləri üçün repo
kökündəki [README.md](../README.md)-ə baxın.

## Əmrlər

```bash
npm install
npm run dev      # dev server, http://localhost:5173
npm run build    # production build
npm run preview  # production build-i lokal baxmaq üçün
npm run lint     # eslint
```

## Struktur

```
src/
  routes/              # səhifələr (fayl-əsaslı routing)
  lib/
    components/         # paylaşılan Svelte komponentləri (ui/, dashboard/)
    server/api.js        # server-side (load funksiyaları üçün) API müştərisi
    api.js                # client-side (mutasiyalar üçün) API müştərisi
    constants.js, utils.js
  hooks.server.js       # auth (JWT yoxlaması) + i18n middleware
messages/               # az.json / en.json (paraglide mesaj kataloqu)
```
