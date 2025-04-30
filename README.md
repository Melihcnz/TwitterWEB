# Twitter Klonu

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş bir Twitter klonudur.

## 🚀 Özellikler

- 🔐 Kullanıcı kimlik doğrulama (kayıt olma/giriş yapma)
- 📱 Responsive tasarım
- 💭 Tweet atma, düzenleme ve silme
- ❤️ Tweet beğenme ve retweet yapma
- 👥 Kullanıcı profili yönetimi
- 🖼️ Profil ve kapak fotoğrafı yükleme
- 👥 Kullanıcı takip sistemi
- 🔍 Tweet arama
- 📊 Gündem konuları

## 🛠️ Teknolojiler

- Next.js 14
- React
- Tailwind CSS
- MongoDB
- Node.js
- Express.js

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda açın:
```
http://localhost:3000
```

## 🔧 Ortam Değişkenleri

Projeyi çalıştırmak için aşağıdaki ortam değişkenlerini `.env` dosyanızda tanımlamanız gerekmektedir:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 📁 Proje Yapısı

```
src/
├── app/                # Next.js app router
│   ├── auth/          # Kimlik doğrulama sayfaları
│   ├── profile/       # Profil sayfaları
│   └── page.js        # Ana sayfa
├── components/        # Yeniden kullanılabilir bileşenler
├── utils/            # Yardımcı fonksiyonlar
└── middleware.js     # Next.js middleware
```

## 🤝 Katkıda Bulunma

1. Bu projeyi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Yapılacaklar

- [ ] Direct mesajlaşma özelliği
- [ ] Bildirim sistemi
- [ ] Bookmarks özelliği
- [ ] Gelişmiş medya desteği
- [ ] Tweet planlama
- [ ] Analytics dashboard

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

## 👥 Geliştirici

[Melih]
