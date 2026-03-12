# ⚖️ Eşitlik Asistanı

**Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) Destek Sistemi**

UN Women / AB destekli KEEDB Eğitici Rehberi ile güçlendirilmiş yapay zeka danışmanlık sistemi.

---

## 🚀 Kurulum (Yerel Geliştirme)

### 1. Gereksinimleri yükle
```bash
npm install
```

### 2. API Key ayarla
`.env.example` dosyasını `.env.local` olarak kopyalayın:
```bash
cp .env.example .env.local
```
Ardından `.env.local` içindeki `ANTHROPIC_API_KEY` değerini doldurun.

> API key almak için: https://console.anthropic.com → "API Keys" → "Create Key"

### 3. Geliştirme sunucusunu başlat
```bash
npm run dev
```
Tarayıcıda `http://localhost:3000` adresini açın.

---

## 🌐 Vercel ile Yayınlama

1. Bu klasörü GitHub'a yükleyin (yeni repo oluşturun)
2. [vercel.com](https://vercel.com) → "New Project" → GitHub reponuzu seçin
3. **Environment Variables** bölümüne ekleyin:
   - `ANTHROPIC_API_KEY` = `sk-ant-...`
4. "Deploy" butonuna basın — sistem canlıya geçer ✅

### Alan Adı Bağlama
Vercel Dashboard → Projeniz → "Settings" → "Domains" → alan adınızı ekleyin.

---

## 🔒 Güvenlik

- API key **asla tarayıcıya gönderilmez** — yalnızca sunucu tarafında (`/api/chat`) kullanılır
- `.env.local` dosyası `.gitignore` ile GitHub'a yüklenmez
- Vercel'de Environment Variables şifreli saklanır

---

## 📚 İçerik Kaynakları

- **KEEDB Eğitici Rehberi** (UN Women / AB, Mayıs 2024) — sisteme entegre
- Türkiye Stratejik Plan Havuzu: [sp.gov.tr](http://sp.gov.tr)
- UN Women: [unwomen.org](https://unwomen.org)
- OECD GRB Toolkit: [oecd.org](https://oecd.org)

---

## 🛠️ Teknoloji

- [Next.js 14](https://nextjs.org) — React framework
- [Anthropic Claude API](https://anthropic.com) — Yapay zeka motoru
- Vercel — Hosting & deployment
