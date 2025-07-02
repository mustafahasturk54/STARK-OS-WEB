# Desktop OS - Modern Web Interface

## Render.com'a Deploy Etme

1. Bu projeyi GitHub'a pushlayın (veya Render'ın desteklediği bir VCS'ye).
2. Render.com'da yeni bir Static Site oluşturun.
3. Repository olarak bu projeyi seçin.
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Otomatik olarak deploy edilecektir.

Alternatif olarak, kök dizine eklenen `render.yaml` dosyası ile Render otomatik ayarları algılar.

---

### Geliştirme
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
``` 