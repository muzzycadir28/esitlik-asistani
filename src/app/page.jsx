"use client";
import { useState, useRef, useEffect } from "react";


// ─── LANGUAGE STRINGS ────────────────────────────────────────────────────────
const LANG = {
  tr: {
    appTitle: "Eşitlik Asistanı",
    appSubtitle: "Kadın Erkek Eşitliğine Duyarlı Bütçeleme Destek Sistemi",
    langToggle: "English",
    tabs: ["Danışman", "Belge Analizi", "Rehber & Kontrol", "Rapor Oluştur"],
    poweredBy: "Claude AI ile güçlendirilmiştir",
    roleSelect: {
      title: "Rolünüzü seçin",
      subtitle: "Size en uygun rehberliği sunabilmek için devam etmeden önce profilinizi belirtin.",
      roles: [
        { id: "official", label: "Kamu Görevlisi", icon: "🏛️", desc: "Bakanlık, merkezi idare çalışanı" },
        { id: "local", label: "Yerel Yönetim", icon: "🏙️", desc: "Belediye, il özel idaresi çalışanı" },
        { id: "academic", label: "Akademisyen", icon: "🎓", desc: "Araştırmacı, öğretim üyesi" },
        { id: "ngo", label: "Sivil Toplum", icon: "🤝", desc: "STK, vakıf, savunuculuk kuruluşu" },
      ],
      confirm: "Devam Et",
    },
    chat: {
      quickTitle: "Hızlı Sorular",
      quick: [
        "KEEDB nedir ve neden önemlidir?",
        "KEEDB sadece kadınlara yönelik bir bütçe midir?",
        "KEEDB'nin temel araçları nelerdir?",
        "KEEDB hangi politika döngüsü aşamalarında uygulanabilir?",
        "KEEDB için hangi ilk adımları atabiliriz?",
        "Planları ve bütçeleri nasıl duyarlı hale getirebilirim?",
        "Dünya'dan başarılı örnekler paylaşır mısın?",
        "Türkiye'den başarılı bir örnek paylaşır mısın?",
      ],

      placeholder: "Sorunuzu yazın… (ör. 'Belediye bütçemizi KEEDB'ye uygun hale getirmek istiyoruz')",
      send: "Gönder",
      thinking: "Yanıt hazırlanıyor…",
      changeRole: "Rolü Değiştir",
    },
    docAnalysis: {
      title: "Belge Analizi",
      subtitle: "Strateji planı, proje taslağı veya bütçe dokümanınızı yükleyin",
      upload: "Dosya seçin veya buraya sürükleyin",
      uploadHint: ".txt dosyaları desteklenir — veya metni aşağıya yapıştırın",
      pasteLabel: "Ya da metni buraya yapıştırın",
      pastePlaceholder: "Analiz edilecek belge metnini buraya yapıştırın…",
      analyze: "KEEDB Analizi Yap",
      analyzing: "Analiz ediliyor…",
    },
    checklist: {
      title: "KEEDB Rehber & Kontrol Listeleri",
      subtitle: "Aşama veya sektör seçerek ilgili kontrol listesini oluşturun",
      phaseLabel: "AŞAMA",
      sectorLabel: "SEKTÖR",
      phases: ["Politika Tasarımı", "Bütçe Hazırlığı", "Uygulama", "İzleme & Değerlendirme"],
      sectors: ["Genel", "Sağlık", "Eğitim", "Ulaşım", "Tarım", "Sosyal Koruma"],
      generate: "Kontrol Listesi Oluştur",
      generating: "Oluşturuluyor…",
    },
    report: {
      title: "KEEDB Raporu Oluştur",
      subtitle: "Kurumunuz ve bütçe dönemi bilgilerini girerek yapılandırılmış rapor taslağı alın",
      institution: "Kurum / Bakanlık adı",
      year: "Bütçe yılı",
      sector: "Sektör",
      context: "Ek bağlam (opsiyonel)",
      contextPlaceholder: "Mevcut durum, öncelikler, veri kaynakları hakkında bilgi ekleyin…",
      generate: "Rapor Taslağı Oluştur",
      generating: "Oluşturuluyor…",
    },
  },
  en: {
    appTitle: "Equality Assistant",
    appSubtitle: "Gender Responsive Budgeting Advisory System",
    langToggle: "Türkçe",
    tabs: ["Advisor", "Document Analysis", "Guide & Checklist", "Generate Report"],
    poweredBy: "Powered by Claude AI",
    roleSelect: {
      title: "Select your role",
      subtitle: "Please indicate your profile so we can provide the most relevant guidance.",
      roles: [
        { id: "official", label: "Public Official", icon: "🏛️", desc: "Ministry or central government staff" },
        { id: "local", label: "Local Government", icon: "🏙️", desc: "Municipality or provincial administration" },
        { id: "academic", label: "Academic", icon: "🎓", desc: "Researcher or faculty member" },
        { id: "ngo", label: "Civil Society", icon: "🤝", desc: "NGO, foundation or advocacy organization" },
      ],
      confirm: "Continue",
    },
    chat: {
      quickTitle: "Quick Questions",
      quick: [
        "What is GRB and why does it matter?",
        "What are the first steps we can take for GRB?",
        "How can I make plans and budgets gender-responsive?",
        "Can you share a successful example from Turkey?",
        "Is GRB a new budget or an analysis of the existing budget?",
        "Is GRB only a budget for women?",
        "What is the ultimate objective of GRB?",
        "What are the core tools of GRB?",
        "At which policy cycle stages can GRB be applied?",
      ],
      placeholder: "Type your question… (e.g. 'We want to make our municipal budget GRB-compliant')",
      send: "Send",
      thinking: "Preparing response…",
      changeRole: "Change Role",
    },
    docAnalysis: {
      title: "Document Analysis",
      subtitle: "Upload your strategic plan, project draft or budget document",
      upload: "Choose file or drag here",
      uploadHint: ".txt files supported — or paste text below",
      pasteLabel: "Or paste text here",
      pastePlaceholder: "Paste the document text to be analyzed here…",
      analyze: "Run GRB Analysis",
      analyzing: "Analyzing…",
    },
    checklist: {
      title: "GRB Guide & Checklists",
      subtitle: "Select a phase or sector to generate the relevant checklist",
      phaseLabel: "PHASE",
      sectorLabel: "SECTOR",
      phases: ["Policy Design", "Budget Preparation", "Implementation", "Monitoring & Evaluation"],
      sectors: ["General", "Health", "Education", "Transport", "Agriculture", "Social Protection"],
      generate: "Generate Checklist",
      generating: "Generating…",
    },
    report: {
      title: "Generate GRB Report",
      subtitle: "Enter your institution and budget period details to get a structured report draft",
      institution: "Institution / Ministry name",
      year: "Budget year",
      sector: "Sector",
      context: "Additional context (optional)",
      contextPlaceholder: "Add information about current situation, priorities, data sources…",
      generate: "Generate Report Draft",
      generating: "Generating…",
    },
  },
};

const QUICK_PRESET_RESPONSES = {
  tr: {
    "keedb nedir ve neden önemlidir?": `## Kısa Özet

Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB), kamu bütçelerinin hazırlanması, uygulanması ve izlenmesi süreçlerinde kadınların ve erkeklerin farklı ihtiyaç ve önceliklerini dikkate alan bir yaklaşımdır. Amaç, kamu kaynaklarının kadın erkek eşitliğini destekleyecek şekilde adil ve etkili kullanılmasını sağlamaktır.

## KEEDB Nedir?

Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB), kamu politikaları ve bütçelerin kadınlar ve erkekler üzerindeki etkilerini analiz eden ve bütçe kararlarını bu analizlere göre şekillendiren bir kamu yönetimi yaklaşımıdır.

Bu yaklaşımda:
- Kamu harcamalarının ve gelirlerinin kadınlar ve erkekler üzerindeki etkisi analiz edilir.
- Politikalar ve programlar eşitsizlikleri azaltacak şekilde tasarlanır.
- Bütçe süreçlerine eşit katılım ve şeffaflık sağlanır.

Başka bir ifadeyle KEEDB, bütçenin sadece mali bir araç değil, aynı zamanda eşitliği ilerleten bir politika aracı olarak kullanılmasını sağlar.

## KEEDB Ne Değildir?

❌ Kadınlara ayrı bir bütçe oluşturmak değildir.

❌ Sadece sosyal politikalarla sınırlı değildir.

❌ Sadece kadınlara yönelik projeler anlamına gelmez.

✔️ Aslında KEEDB, tüm kamu politikalarında kadın erkek eşitliği perspektifinin dikkate alınmasıdır.

## KEEDB Neden Önemlidir?

1️⃣ Eşitsizlikleri görünür kılar

Kadın ve erkeklerin farklı ihtiyaçları ve fırsatlara erişim düzeyleri vardır. KEEDB bu farkları veri ve analizlerle ortaya çıkarır.

2️⃣ Kamu kaynaklarının daha adil kullanılmasını sağlar

Bütçeler toplumdaki tüm grupların ihtiyaçlarını dikkate alarak hazırlanır.

3️⃣ Kamu hizmetlerinin erişilebilirliğini artırır

Örneğin:
- ulaşım
- bakım hizmetleri
- istihdam programları

Bu hizmetlerin kadınlar ve erkekler için eşit şekilde erişilebilir olması sağlanır.

4️⃣ Hesap verebilirliği ve şeffaflığı artırır

Bütçelerin kimin için, nasıl kullanıldığını görünür hale getirir.

5️⃣ Sürdürülebilir kalkınmayı destekler

Kadın erkek eşitliği, ekonomik büyüme ve sosyal kalkınma ile doğrudan ilişkilidir.

## KEEDB'nin Nihai Hedefi

➡️ Kadınların ve erkeklerin eşit hak, fırsat ve imkanlara sahip olduğu bir toplum oluşturmaktır.`,
    "keedb için hangi ilk adımları atabiliriz?": `## Kısa Özet

Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) uygulamasına başlamak için genellikle 5 temel ilk adım önerilir:

- Kurumsal farkındalık ve siyasi/kurumsal sahiplenme oluşturmak
- Mevcut durum analizi yapmak (veri ve eşitsizlik analizi)
- Politika ve stratejik planlara eşitlik hedefleri koymak
- Bütçe ve programları eşitlik perspektifiyle analiz etmek
- İzleme ve göstergeler geliştirmek

Bu adımlar, KEEDB'nin planlama-bütçe döngüsüne sistematik olarak entegre edilmesini sağlar.

## KEEDB'ye Başlamak İçin İlk Adımlar

1️⃣ Kurumsal farkındalık ve sahiplenme oluşturmak

Yapılabilecekler:
- Üst yönetimin desteğini almak
- Kurum içinde KEEDB çalışma grubu / odak noktası belirlemek
- Personel için kısa eğitim veya bilgilendirme yapmak
- Stratejik plan ve bütçe süreçlerinde eşitlik perspektifinin gerekliliğini anlatmak

2️⃣ Mevcut durum analizi yapmak

Analiz kapsamında:
- Cinsiyete göre ayrıştırılmış veri toplamak
- Hizmetlerden kimlerin yararlandığını analiz etmek
- Kurum faaliyetlerinin kadınlar ve erkekler üzerindeki etkisini incelemek

3️⃣ Stratejik plan ve politikalara eşitlik hedefleri koymak

Örnek hedefler:
- İstihdam: Kadın istihdamını artıran programlar
- Eğitim: Kız çocuklarının STEM alanına katılımını artırmak
- Yerel hizmetler: Kadınların güvenli ulaşım erişimini artırmak

4️⃣ Bütçe ve programları eşitlik açısından analiz etmek

Sorulabilecek sorular:
- Bu program kadınlar ve erkekler için eşit fayda sağlıyor mu?
- Kaynak dağılımı eşitsizlikleri azaltıyor mu?
- Kadınların erişimini engelleyen faktörler var mı?

5️⃣ İzleme ve göstergeler geliştirmek

Örnek göstergeler:
- Programlardan yararlanan kadın/erkek sayısı
- Kadın girişimcilere verilen destek miktarı
- Kadınların karar alma mekanizmalarındaki oranı

## Pratik Başlangıç Checklist'i

☐ Kurum içinde KEEDB sorumlusu belirle
☐ Personel için farkındalık eğitimi yap
☐ Cinsiyete göre ayrıştırılmış veri topla
☐ Stratejik plan hedeflerine eşitlik göstergesi ekle
☐ Bir pilot program veya faaliyet seç
☐ O program için KEEDB analizi yap`,
    "planları ve bütçeleri nasıl duyarlı hale getirebilirim?": `Planları ve bütçeleri Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) yaklaşımıyla duyarlı hale getirmek için politika-planlama-bütçe döngüsünün tüm aşamalarına eşitlik perspektifi eklemek gerekir.

## Planları ve Bütçeleri Eşitliğe Duyarlı Hale Getirme

1️⃣ Durum Analizi Yap (Eşitsizlikleri Tanımla)
- Bu politika / hizmetten kim yararlanıyor?
- Kadınlar ve erkekler eşit erişime sahip mi?
- Veriler kadın ve erkek olarak ayrıştırılmış mı?

2️⃣ Eşitliğe Duyarlı Hedefler Belirle
- İstihdam: Kadınların işgücüne katılımını artırmak
- Ulaşım: Kadınların güvenli ulaşım erişimini artırmak
- Eğitim: STEM alanlarında kız öğrencilerin oranını artırmak

3️⃣ Program ve Faaliyetleri Gözden Geçir
- Mesleki eğitim: Kadınların katılımı için çocuk bakım desteği
- Spor yatırımları: Kadınlara özel saat veya alan
- Tarım destekleri: Kadın çiftçiler için erişim kriterleri

4️⃣ Bütçeyi Eşitlik Perspektifiyle Analiz Et
- Kaynakların ne kadarı eşitliği destekleyen faaliyetlere gidiyor?
- Kadınlar ve erkekler bu harcamalardan nasıl etkileniyor?
- Harcamalar eşitsizlikleri azaltıyor mu?

5️⃣ İzleme ve Değerlendirme Yap
- Kadın ve erkek yararlanıcı sayısı
- Kadın istihdam oranı
- Kadın girişimci destekleri
- Güvenli kamusal alan sayısı

## Planlama ve Bütçe Sürecinde KEEDB Döngüsü

1️⃣ Sorun analizi
2️⃣ Eşitlik hedefleri belirleme
3️⃣ Faaliyet ve program tasarımı
4️⃣ Bütçe tahsisi
5️⃣ İzleme ve değerlendirme

✅ Kısa özet:
- cinsiyete göre ayrıştırılmış veri kullan
- eşitlik hedefleri koy
- programları bu hedeflere göre tasarla
- bütçeyi bu faaliyetlere yönlendir
- sonuçları düzenli olarak izle`,
    "keedb sadece kadınlara yönelik bir bütçe midir?": `## Kısa Cevap

Hayır. Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) sadece kadınlara yönelik ayrı bir bütçe değildir. Amaç, kamu bütçesinin kadınlar ve erkekler üzerindeki farklı etkilerini analiz ederek daha adil ve eşit bir kaynak dağılımı sağlamaktır.

## KEEDB Ne Değildir?

KEEDB çoğu zaman yanlış anlaşılır. Şunlar KEEDB değildir:

- ❌ Sadece kadınlara ayrılmış ayrı bir bütçe
- ❌ Kadın projeleri için ekstra bir fon
- ❌ Sadece sosyal politikalarla sınırlı bir yaklaşım

Aslında KEEDB, tüm kamu bütçesine eşitlik perspektifi ekleyen bir yöntemdir.

## KEEDB Aslında Nedir?

KEEDB, bütçe süreçlerinde şu soruların sorulmasını sağlar:

- Bu politika kadınları ve erkekleri nasıl etkiliyor?
- Kamu hizmetlerinden kim daha fazla yararlanıyor?
- Kaynak dağılımı eşitsizlikleri azaltıyor mu yoksa artırıyor mu?

Bu nedenle KEEDB; planlama, bütçe hazırlama, uygulama ve izleme & değerlendirme aşamalarının tamamına eşitlik perspektifini entegre eder.

## Basit Bir Örnek

Bir belediyenin spor tesisleri bütçesini düşünelim:

- **KEEDB olmadan:** Futbol sahalarına ağırlık verilir, kim kullandığı analiz edilmez, kaynaklar eşit kullanılmayabilir.
- **KEEDB ile:** Kadınların kullandığı spor alanları da planlanır, kadın-erkek kullanım oranı analiz edilir, hizmetler herkes için erişilebilir olur.

✅ **Özet:** KEEDB kadınlara ayrı bir bütçe oluşturmaz. Ama bütçenin kadınlar ve erkekler için eşit ve adil sonuçlar üretmesini sağlamaya çalışır.`,
    "keedb'nin temel araçları nelerdir?": `## Kısa Özet

Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB), kamu politikası ve bütçe süreçlerinde kadın ve erkeklerin farklı ihtiyaç ve etkilerini dikkate almak için çeşitli analiz, planlama, izleme ve raporlama araçları kullanır.

## KEEDB'nin Temel Araçları

1️⃣ **Kadın Erkek Eşitliği Analizi** — Politika, program veya bütçelerin kadınlar ve erkekler üzerindeki etkisini inceler. Kadın ve erkeklerin farklı ihtiyaçlarını, hizmetlere erişimi, kaynak dağılımını ve mevcut eşitsizlikleri analiz eder.

2️⃣ **Cinsiyete Göre Ayrıştırılmış Veri ve Göstergeler** — Kadın/erkek istihdam oranı, eğitimde kız/erkek öğrenci sayısı, kamu hizmetlerinden yararlanan kadın ve erkek sayısı gibi veriler eşitlik sorunlarının tespitini sağlar.

3️⃣ **Kadın Erkek Eşitliğine Duyarlı Bütçe Analizi** — Mevcut bütçenin eşitlik açısından değerlendirilmesidir. Bütçe kimlere fayda sağlıyor? Kaynak dağılımı eşitsizlikleri azaltıyor mu?

4️⃣ **Kadın Erkek Eşitliğine Duyarlı Planlama** — Stratejik plan, program ve faaliyetlerin eşitlik perspektifiyle tasarlanmasıdır. Eşitliğin politika hedeflerine entegre edilmesini sağlar.

5️⃣ **Bütçe Takibi (Expenditure Tracking)** — Kamu harcamalarının gerçekten eşitlik hedeflerine gidip gitmediğini izler. Hesap verebilirliği artırır.

6️⃣ **Kadın Erkek Eşitliğine Duyarlı İzleme ve Değerlendirme** — Program ve bütçelerin sonuçlarını değerlendirir. Kadın istihdamındaki artış, kamu hizmetlerine erişim ve karar alma süreçlerine katılım gibi göstergeler kullanılır.

## KEEDB Araçlarının Bütçe Döngüsündeki Yeri

- **Sorun analizi:** Eşitlik analizi, veri ve göstergeler
- **Planlama:** KEEDB planlama ve hedef belirleme
- **Bütçe hazırlama:** Bütçe analizi
- **Uygulama:** Harcama takibi
- **İzleme:** İzleme ve değerlendirme

✅ Bu araçlar birlikte kullanıldığında bütçe sürecinin tamamına eşitlik perspektifi yerleştirilmiş olur.`,
    "keedb hangi politika döngüsü aşamalarında uygulanabilir?": `## Kısa Özet

Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) yalnızca bütçe hazırlama aşamasında değil, kamu politika döngüsünün tüm aşamalarında uygulanabilir.

## KEEDB'nin Uygulanabildiği Aşamalar

1️⃣ **Sorun Analizi / Gündem Belirleme** — Kadın ve erkeklerin farklı ihtiyaçlarının belirlenmesi, cinsiyete göre ayrıştırılmış verilerin kullanılması ve eşitsizliklerin tespiti. Örnek: Ulaşım politikası hazırlanırken kadınların gece ulaşım güvenliği sorunlarının analiz edilmesi.

2️⃣ **Politika ve Program Tasarımı** — Eşitliğe duyarlı hedef ve göstergeler belirleme, kadın ve erkeklerin ihtiyaçlarına uygun politika araçları geliştirme. Örnek: Kadın istihdamını artırmaya yönelik eğitim programlarının tasarlanması.

3️⃣ **Bütçe Hazırlama** — Kadın erkek eşitliğine duyarlı bütçe analizi, eşitlik hedeflerine uygun kaynak dağılımı. Bu aşamada bütçenin kimlere fayda sağladığı analiz edilir.

4️⃣ **Uygulama** — Kadın ve erkeklerin hizmetlere erişiminin izlenmesi, harcamaların eşitlik hedeflerine uygun kullanılması.

5️⃣ **İzleme ve Değerlendirme** — Eşitliğe duyarlı performans göstergeleri, bütçe etkisinin değerlendirilmesi, politika sonuçlarının kadınlar ve erkekler üzerindeki etkisinin analizi.

✅ **Sonuç:** KEEDB, bütçenin yalnızca hazırlanmasında değil; politika geliştirme, planlama, uygulama ve değerlendirme süreçlerinin tamamında uygulanabilen bir yaklaşımdır.`,
    "dünya'dan başarılı örnekler paylaşır mısın?": `## Kısa Özet

Dünyada KEEDB uygulamasında öne çıkan birçok başarılı örnek vardır. Özellikle Avusturya, İsveç ve Güney Kore KEEDB'yi bütçe sistemine kurumsal olarak entegre etmiş ülkeler arasında gösterilir.

## Dünyadan Başarılı KEEDB Örnekleri

🇦🇹 **Avusturya – Anayasal Düzeyde KEEDB**
2009'da bütçe reformu ile eşitlik hedefleri bütçe sistemine dahil edildi. Tüm kamu kurumları eşitliğe duyarlı performans hedefleri belirlemek zorundadır. Bütçe belgelerinde Gender Budget Statement yer alır.

🇸🇪 **İsveç – Politika Anaakımlaştırması**
Tüm politika alanlarında eşitlik etkisi analizi yapılır. Bakanlıklar bütçe tekliflerinde kadın ve erkek üzerindeki etkileri analiz eder. Eğitim, istihdam ve bakım ekonomisi politikalarında eşitsizlikleri azaltan reformlar yapılmıştır.

🇰🇷 **Güney Kore – Bütçe Belgelerinde KEEDB**
Her yıl Gender Budget Statement hazırlanır, uygulamadan sonra Gender Budget Report yayımlanır. 30'dan fazla kamu kurumu eşitlik etkisi analizleri yapar.

🇪🇸 **İspanya – Bölgesel KEEDB Uygulamaları**
Endülüs Bölgesi öncü örneklerden biridir. Bütçe tekliflerinde eşitlik etki raporu hazırlanır, kadın girişimciliği ve sosyal hizmetlere ayrılan bütçe artırılmıştır.

🇷🇼 **Ruanda – Afrika'nın En İyi Örneklerinden Biri**
Tüm bakanlıklar Gender Budget Statement hazırlar. Eğitim ve sağlık hizmetlerine kadınların erişimi önemli ölçüde artmıştır.

## Başarılı Uygulamaların Ortak Özellikleri

- **Yasal çerçeve:** KEEDB'nin mevzuat veya anayasa ile desteklenmesi
- **Veri sistemi:** Cinsiyete göre ayrıştırılmış veri kullanımı
- **Kurumsal sorumluluk:** Bakanlıkların eşitlik hedefleri belirlemesi
- **Bütçe belgeleri:** Gender Budget Statement gibi resmi belgeler
- **İzleme:** Bütçe etkisinin düzenli olarak değerlendirilmesi

💡 Dünya genelinde KEEDB 80'den fazla ülkede çeşitli düzeylerde uygulanmaktadır.`,
    "türkiye'den başarılı bir örnek paylaşır mısın?": `## 🇹🇷 Türkiye'den KEEDB Başarılı Uygulama Örneği

### Yerel Yönetimlerde Pilot KEEDB Uygulamaları

Türkiye'de yürütülen projelerde bazı belediyelerde planlama, performans programı ve bütçe süreçlerine kadın erkek eşitliği perspektifi entegre edilmiştir.

### Uygulamada Yapılan Somut Adımlar

1️⃣ Durum Analizi
- Kadın ve erkeklerin belediye hizmetlerinden yararlanma durumu incelendi
- Spor tesisleri, meslek kursları, bakım hizmetleri gibi alanlar analiz edildi

2️⃣ Eşitlik Hedeflerinin Belirlenmesi
- Kadın istihdamını artıran kurslar
- Bakım hizmetlerini genişletmek
- Kadınların yerel karar süreçlerine katılımını artırmak

3️⃣ Bütçe ile Bağlantı Kurma
- Meslek kursları → Kadın istihdamı
- Kreş hizmetleri → Kadınların işgücüne katılımı
- Kadın danışma merkezleri → Şiddetle mücadele

4️⃣ İzleme ve Raporlama
- Performans göstergeleri oluşturuldu
- Faaliyet raporlarında eşitlik etkisi izlenmeye başlandı

### Bu Örneğin Önemi

- yerel yönetimlere uygulanabilir bir model sunuyor
- stratejik plan - performans programı - bütçe bağlantısını gösteriyor
- eşitlik politikalarının bütçeyle desteklenmesini sağlıyor`,
  },
};

const normalizeQuickQuestion = (value = "") => value.trim().toLocaleLowerCase("tr-TR");

function getQuickPresetResponse(lang, question) {
  return QUICK_PRESET_RESPONSES[lang]?.[normalizeQuickQuestion(question)] || null;
}

const ROLE_LABELS = {
  tr: { official: "Kamu Görevlisi", local: "Yerel Yönetim", academic: "Akademisyen", ngo: "Sivil Toplum" },
  en: { official: "Public Official", local: "Local Government", academic: "Academic", ngo: "Civil Society" },
};

// ─── SYSTEM PROMPTS ───────────────────────────────────────────────────────────
const buildSystemPrompt = (lang, role) => {
  const rolCtx = {
    tr: {
      official: "Kullanıcı merkezi kamu idaresinde çalışan bir kamu görevlisidir. Bakanlık düzeyinde bütçe süreçleri, performans programları, stratejik planlar ve faaliyet raporları bağlamında öneriler geliştir.",
      local: "Kullanıcı bir belediye veya il özel idaresinde çalışmaktadır. Yerel bütçe süreçleri, meclis kararları, mahalle düzeyinde hizmet planlaması ve yerel eşitlik planları bağlamında yanıt ver.",
      academic: "Kullanıcı bir akademisyen veya araştırmacıdır. Akademik kaynaklar, metodoloji, ders entegrasyonu ve araştırma tasarımı konularında kapsamlı bilgi sun.",
      ngo: "Kullanıcı bir STK veya sivil toplum kuruluşu temsilcisidir. Savunuculuk stratejileri, izleme araçları, paydaş katılımı ve kapasite geliştirme konularına odaklan.",
    },
    en: {
      official: "The user is a public official working in central government. Provide recommendations in the context of ministry-level budget processes, performance programs, strategic plans and activity reports.",
      local: "The user works in a municipality or provincial administration. Respond in the context of local budget processes, council decisions, neighbourhood-level service planning and local equality plans.",
      academic: "The user is an academic or researcher. Provide comprehensive information on academic sources, methodology, course integration and research design.",
      ngo: "The user is a representative of an NGO or civil society organization. Focus on advocacy strategies, monitoring tools, stakeholder engagement and capacity building.",
    },
  };

  if (lang === "tr") return `Sen "Eşitlik Asistanı"sın; Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) konusunda uzman bir danışmansın.

Kullanıcı profili:
${rolCtx.tr[role] || rolCtx.tr.official}

Temel görevlerin:
1) KEEDB'nin ne olduğunu, neden önemli olduğunu ve kamu planlama-bütçe süreçlerine nasıl entegre edileceğini açıkla.
2) Uygulanabilir adımlar, kontrol listeleri ve kısa örnekler sun.
3) Kullanıcının kurum bağlamına uygun politika ve uygulama önerileri üret.

Kurallar:
- Türkçe yanıtlarda "Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB)" ifadesini kullan.
- Bilinmeyen bilgiyi uydurma; gerektiğinde "Bu konuda güncel veri gerekli" veya "Resmi belgelere bakılmalı" de.
- Siyasi taraf tutma; kanıta dayalı, kapsayıcı ve tarafsız ol.
- Konu dışı sorularda kısa ve nazikçe KEEDB odağına geri yönlendir.

Yanıt biçimi:
- Önce 2-3 cümlelik kısa özet ver.
- Sonra madde işaretleriyle net, eyleme dönük öneriler sun.
- Gerekliyse tablo/kontrol listesi kullan.
- Belgeye atıf varsa sonda APA 7 kaynakça ekle.

Kaynak önceliği:
1. KEEDB Eğitici Rehberi (2024)
2. Kullanıcının yüklediği belgeler
3. Resmi kurum kaynakları
4. OECD/UN Women/UNDP/Dünya Bankası/IMF
5. Genel bilgi`;

  return `You are "Equality Assistant," an expert advisor on Gender Responsive Budgeting (GRB).

User profile:
${rolCtx.en[role] || rolCtx.en.official}

Core tasks:
1) Explain what GRB is, why it matters, and how to integrate it into public planning and budgeting.
2) Provide practical steps, checklists, and short examples.
3) Tailor policy and implementation recommendations to the user's institutional context.

Rules:
- Use the term "Gender Responsive Budgeting (GRB)" in English replies.
- Do not invent uncertain facts; say when updated data or official documents are needed.
- Stay non-partisan, evidence-based, and inclusive.
- For off-topic questions, briefly and politely redirect back to GRB.

Response format:
- Start with a 2-3 sentence summary.
- Then provide clear, actionable bullet points.
- Use tables/checklists when useful.
- If you cite documents, add APA 7 references at the end.

Source priority:
1. GRB Trainer's Guide (2024)
2. User-uploaded documents
3. Official public sources
4. OECD/UN Women/UNDP/World Bank/IMF
5. General knowledge`;
};

const buildDocPrompt = (lang, text) => lang === "tr"
  ? `Aşağıdaki kamu belgesi metnini Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) perspektifinden analiz et.

BELGE:
${text}

## 1. Genel KEEDB Değerlendirmesi
Belgenin mevcut KEEDB seviyesini kısaca değerlendir (Başlangıç / Gelişmekte / İleri).

## 2. Tespit Edilen Sorunlar
Cinsiyet körü ifadeler, eksik veri noktaları ve KEEDB açıklarını listele.

## 3. Güçlü Yanlar
Varsa mevcut olumlu KEEDB unsurlarını belirt.

## 4. Öncelikli Öneriler
En kritik 5 iyileştirme önerisini uygulanabilir adımlar olarak sırala.

## 5. Örnek Yeniden Yazımlar
2-3 somut paragraf/madde için KEEDB uyumlu alternatif ifadeler öner.

Cevabın sonunda kullandığın kaynakları APA 7 formatında listele.`
  : `Analyze the following public document text from a Gender Responsive Budgeting (GRB) perspective.

DOCUMENT:
${text}

## 1. Overall GRB Assessment
Briefly assess the document's current GRB level (Beginner / Developing / Advanced).

## 2. Issues Identified
List gender-blind language, missing data points and GRB gaps.

## 3. Strengths
Note any existing positive GRB elements if present.

## 4. Priority Recommendations
List the 5 most critical improvement recommendations as actionable steps.

## 5. Sample Rewrites
Suggest GRB-compliant alternative language for 2-3 specific paragraphs/items.

Add an APA 7 reference list at the end.`;

const buildChecklistPrompt = (lang, phase, sector) => lang === "tr"
  ? `"${phase}" aşaması ve "${sector}" sektörü için Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) kontrol listesi oluştur.

Her madde için şunları içer:
- ☐ Kontrol sorusu / yapılacak eylem (net ve uygulanabilir)
- Neden önemli olduğuna dair 1 cümle
- Varsa referans kaynak

Maddeleri mantıksal gruplara ayır. Toplam 15-20 madde olsun.
Cevabın sonunda APA 7 kaynakça ekle.`
  : `Generate a Gender Responsive Budgeting (GRB) checklist for the "${phase}" phase and "${sector}" sector.

For each item include:
- ☐ Check question / action to take (clear and actionable)
- 1 sentence on why it matters
- Reference source if applicable

Group items logically. Include 15-20 items total.
Add an APA 7 reference list at the end.`;

const buildReportPrompt = (lang, institution, year, sector, context) => lang === "tr"
  ? `${institution} kurumu için ${year} bütçe dönemi ve "${sector}" sektörüne yönelik Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) raporu taslağı oluştur.
Ek bağlam: ${context || "Belirtilmedi"}

# ${institution} — ${year} KEEDB Raporu

## Yönetici Özeti
## 1. Mevcut Durum Analizi
## 2. Kadın Erkek Eşitliği Öncelikleri
## 3. Bütçe Tahsislerine KEEDB Entegrasyonu
## 4. Performans Göstergeleri
## 5. Veri ve İzleme Çerçevesi
## 6. Eylem Planı
## Kaynakça (APA 7)

Her bölümde somut öneriler, örnek göstergeler ve uluslararası iyi uygulamalara atıflar ekle.`
  : `Generate a Gender Responsive Budgeting (GRB) report draft for ${institution}, budget year ${year}, sector: "${sector}".
Additional context: ${context || "Not provided"}

# ${institution} — ${year} GRB Report

## Executive Summary
## 1. Current Situation Analysis
## 2. Gender Equality Priorities
## 3. GRB Integration in Budget Allocations
## 4. Performance Indicators
## 5. Data and Monitoring Framework
## 6. Action Plan
## References (APA 7)

Include concrete recommendations, sample indicators and references to international good practices in each section.`;

const CHECKLIST_PRESETS = {
  "Politika Tasarımı": {
    "Genel": `## Politika Tasarımı — Genel Kontrol Listesi

☐ Bu politika alanında kadınlar ve erkekler arasında erişim, kullanım veya sonuç açısından fark var mı ve bu fark hangi verilerle ortaya konmuştur?

☐ Politika hazırlanırken cinsiyete göre ayrıştırılmış veri kullanıldı mı ve veri kaynağı nedir?

☐ Politika hedefleri kadın ve erkeklerin farklı ihtiyaçlarını dikkate alacak şekilde tasarlandı mı?

☐ Politikanın uygulanması sonucunda eşitsizliklerin azalmasına yönelik ölçülebilir hedefler belirlendi mi?`,

    "Sağlık": `## Politika Tasarımı — Sağlık Kontrol Listesi

☐ Kadın ve erkeklerin sağlık hizmetlerine erişiminde coğrafi veya sosyoekonomik farklılıklar analiz edildi mi?

☐ Anne sağlığı, üreme sağlığı veya erkeklere özgü sağlık riskleri gibi cinsiyete özgü sağlık ihtiyaçları politika tasarımında dikkate alındı mı?

☐ Sağlık hizmetlerinin kullanım oranları cinsiyete göre analiz edilerek politika hedeflerine yansıtıldı mı?

☐ Politika kadınların veya erkeklerin sağlık hizmetlerine erişimini artırmak için özel program veya hizmetler içeriyor mu?`,

    "Eğitim": `## Politika Tasarımı — Eğitim Kontrol Listesi

☐ Kız ve erkek çocukların eğitime erişim ve devam durumları cinsiyete göre analiz edildi mi?

☐ Eğitim politikası kız ve erkek öğrencilerin farklı öğrenme ve fırsat ihtiyaçlarını dikkate alıyor mu?

☐ Okul terk oranları veya başarı düzeyleri cinsiyete göre değerlendirilerek politika hedeflerine yansıtıldı mı?

☐ Politika kız çocuklarının eğitimde karşılaştığı yapısal engelleri azaltacak önlemler içeriyor mu?`,

    "Ulaşım": `## Politika Tasarımı — Ulaşım Kontrol Listesi

☐ Kadın ve erkeklerin ulaşım kullanım alışkanlıkları veri temelli olarak analiz edildi mi?

☐ Ulaşım güvenliği (aydınlatma, durak güvenliği vb.) açısından kadınların deneyimleri politika tasarımına dahil edildi mi?

☐ Ulaşım politikası bakım sorumluluğu olan bireylerin çoklu yolculuk ihtiyaçlarını dikkate alıyor mu?

☐ Engelli kadın ve erkeklerin ulaşım hizmetlerine erişimi politika tasarımında değerlendirildi mi?`,

    "Tarım": `## Politika Tasarımı — Tarım Kontrol Listesi

☐ Tarım politikası hazırlanırken kadın ve erkek çiftçilerin üretim kaynaklarına erişimi analiz edildi mi?

☐ Tarımsal destek programlarından yararlananların cinsiyet dağılımı incelendi mi?

☐ Kadın çiftçilerin eğitim, kredi ve kooperatiflere erişim durumları politika analizine dahil edildi mi?

☐ Politika kadınların tarımsal üretimdeki rolünü güçlendirecek hedefler içeriyor mu?`,

    "Sosyal Koruma": `## Politika Tasarımı — Sosyal Koruma Kontrol Listesi

☐ Sosyal yardım ve hizmet programlarının kadın ve erkeklere etkisi analiz edildi mi?

☐ Bakım sorumluluğunun kadınlar üzerindeki etkisi politika tasarımında dikkate alındı mı?

☐ Sosyal koruma politikaları kadınların ekonomik güçlenmesini destekleyecek şekilde tasarlandı mı?

☐ Politika dezavantajlı gruplardaki kadın ve erkekler için özel destek mekanizmaları içeriyor mu?`,
  },

  "Bütçe Hazırlığı": {
    "Genel": `## Bütçe Hazırlığı — Genel Kontrol Listesi

☐ Politika hedefleri bütçe programlarına eşitlik perspektifi ile yansıtıldı mı?

☐ Bütçe hazırlanırken kamu harcamalarının kadın ve erkekler üzerindeki farklı etkileri analiz edildi mi?

☐ Eşitlik hedeflerini destekleyen faaliyetler için ayrı bütçe kalemleri oluşturuldu mu?

☐ Performans göstergeleri kadın ve erkekler için ayrı ayrı ölçülebilecek şekilde tanımlandı mı?`,

    "Sağlık": `## Bütçe Hazırlığı — Sağlık Kontrol Listesi

☐ Kadınların sağlık hizmetlerine erişimini artıracak programlar için yeterli bütçe ayrıldı mı?

☐ Anne sağlığı veya kadın sağlığı hizmetlerine yönelik harcamalar bütçede görünür mü?

☐ Erkeklerin yüksek riskli sağlık sorunlarına yönelik önleyici programlar bütçede yer alıyor mu?

☐ Kırsal veya dezavantajlı bölgelerde sağlık hizmetlerini güçlendirmek için kaynak ayrıldı mı?`,

    "Eğitim": `## Bütçe Hazırlığı — Eğitim Kontrol Listesi

☐ Kız çocuklarının eğitime erişimini artıran programlar bütçede yer alıyor mu?

☐ STEM alanlarında kız öğrencilerin katılımını artırmaya yönelik faaliyetler finanse ediliyor mu?

☐ Okul terk oranlarını azaltmaya yönelik programlar için bütçe tahsisi yapılmış mı?

☐ Eğitim materyalleri ve programları eşitlik perspektifini destekleyecek şekilde finanse ediliyor mu?`,

    "Ulaşım": `## Bütçe Hazırlığı — Ulaşım Kontrol Listesi

☐ Ulaşım güvenliğini artırmaya yönelik altyapı yatırımları için bütçe ayrıldı mı?

☐ Toplu taşıma sistemlerinde güvenlik önlemleri için kaynak tahsis edildi mi?

☐ Engelli bireylerin ulaşım erişimini artıracak yatırımlar bütçede yer alıyor mu?

☐ Kadınların yoğun kullandığı ulaşım güzergahlarında hizmet kalitesini artıracak yatırımlar planlandı mı?`,

    "Tarım": `## Bütçe Hazırlığı — Tarım Kontrol Listesi

☐ Kadın çiftçilere yönelik destek programları için özel bütçe kalemleri var mı?

☐ Tarımsal eğitim ve danışmanlık hizmetlerinden kadınların yararlanmasını artıracak kaynak ayrıldı mı?

☐ Kadın girişimciliğini destekleyen kırsal kalkınma programları bütçede yer alıyor mu?

☐ Tarımsal desteklerin dağılımı kadın ve erkek çiftçiler açısından eşitlik perspektifiyle analiz edildi mi?`,

    "Sosyal Koruma": `## Bütçe Hazırlığı — Sosyal Koruma Kontrol Listesi

☐ Kreş, bakım hizmetleri veya sosyal destek programları için yeterli kaynak ayrıldı mı?

☐ Kadınların işgücüne katılımını destekleyen sosyal programlar bütçede yer alıyor mu?

☐ Sosyal yardımların dağılımı kadın ve erkek yararlanıcılar açısından analiz edildi mi?

☐ Yoksullukla mücadele programları kadınların ekonomik bağımsızlığını destekleyecek şekilde finanse edildi mi?`,
  },

  "Uygulama": {
    "Genel": `## Uygulama — Genel Kontrol Listesi

☐ Program ve hizmetlerden yararlananların cinsiyete göre dağılımı düzenli olarak izleniyor mu?

☐ Uygulama sürecinde kadın ve erkeklerin hizmetlere erişiminde engeller tespit edildi mi?

☐ Program uygulamasında eşitlik hedeflerine ulaşmayı destekleyen uygulama mekanizmaları var mı?

☐ Hizmet sunumunda kadın ve erkeklerin geri bildirimleri sistematik olarak toplanıyor mu?`,

    "Sağlık": `## Uygulama — Sağlık Kontrol Listesi

☐ Sağlık hizmetlerinden yararlananların cinsiyet dağılımı izleniyor mu?

☐ Sağlık hizmetleri kırsal veya dezavantajlı bölgelerde kadınlar için erişilebilir mi?

☐ Kadınlara yönelik sağlık hizmetleri uygulamada etkin şekilde sunuluyor mu?

☐ Sağlık hizmetlerinden memnuniyet kadın ve erkekler için ayrı ayrı değerlendiriliyor mu?`,

    "Eğitim": `## Uygulama — Eğitim Kontrol Listesi

☐ Eğitim programlarına katılım oranları cinsiyete göre izleniyor mu?

☐ Okul terk oranları uygulama sürecinde cinsiyete göre takip ediliyor mu?

☐ Eğitim programları kız ve erkek öğrencilerin ihtiyaçlarına uygun şekilde uygulanıyor mu?

☐ Öğrenci başarıları ve fırsat eşitliği göstergeleri düzenli olarak analiz ediliyor mu?`,

    "Ulaşım": `## Uygulama — Ulaşım Kontrol Listesi

☐ Kadınların ulaşım hizmetlerinden yararlanma oranı izleniyor mu?

☐ Ulaşım hizmetlerinde güvenlik sorunları düzenli olarak değerlendiriliyor mu?

☐ Toplu taşıma hizmetleri bakım sorumluluğu olan bireyler için uygun mu?

☐ Ulaşım altyapısı engelli kadın ve erkeklerin kullanımına uygun şekilde uygulanıyor mu?`,

    "Tarım": `## Uygulama — Tarım Kontrol Listesi

☐ Tarım desteklerinden yararlanan kadın çiftçilerin oranı izleniyor mu?

☐ Tarımsal eğitim programlarına kadınların katılımı takip ediliyor mu?

☐ Kadın çiftçilere yönelik destek programları sahada etkin şekilde uygulanıyor mu?

☐ Tarımsal desteklerin dağılımı kadın ve erkekler arasında dengeli mi?`,

    "Sosyal Koruma": `## Uygulama — Sosyal Koruma Kontrol Listesi

☐ Sosyal hizmetlerden yararlananların cinsiyet dağılımı izleniyor mu?

☐ Sosyal programlar kadınların ekonomik güçlenmesine katkı sağlıyor mu?

☐ Bakım hizmetleri kadınların işgücüne katılımını destekliyor mu?

☐ Sosyal hizmetlere erişimde kadın ve erkekler arasında fark var mı?`,
  },

  "İzleme & Değerlendirme": {
    "Genel": `## İzleme & Değerlendirme — Genel Kontrol Listesi

☐ Program sonuçları kadın ve erkekler için ayrı ayrı analiz ediliyor mu?

☐ Politika hedeflerine ulaşma düzeyi eşitlik göstergeleri ile ölçülüyor mu?

☐ Program sonuçları eşitsizliklerin azalmasına katkı sağladı mı?

☐ İzleme sonuçları politika ve bütçe süreçlerine geri bildirim olarak kullanılıyor mu?`,

    "Sağlık": `## İzleme & Değerlendirme — Sağlık Kontrol Listesi

☐ Sağlık hizmetlerine erişimde kadın ve erkekler arasındaki fark azaldı mı?

☐ Anne sağlığı ve genel sağlık göstergeleri cinsiyete göre değerlendiriliyor mu?

☐ Sağlık programlarının kadın ve erkekler üzerindeki etkisi ölçülüyor mu?

☐ Sağlık politikası sonuçları eşitlik açısından raporlanıyor mu?`,

    "Eğitim": `## İzleme & Değerlendirme — Eğitim Kontrol Listesi

☐ Eğitimde fırsat eşitliği göstergeleri cinsiyete göre izleniyor mu?

☐ Okul terk oranları ve başarı göstergeleri düzenli olarak analiz ediliyor mu?

☐ Eğitim politikalarının kız ve erkek öğrenciler üzerindeki etkisi ölçülüyor mu?

☐ Eğitim politikası sonuçları eşitlik perspektifi ile raporlanıyor mu?`,

    "Ulaşım": `## İzleme & Değerlendirme — Ulaşım Kontrol Listesi

☐ Kadınların ulaşım güvenliği algısı ölçülüyor mu?

☐ Ulaşım hizmetlerinin kullanım oranları cinsiyete göre analiz ediliyor mu?

☐ Ulaşım yatırımlarının kadın ve erkekler üzerindeki etkisi değerlendiriliyor mu?

☐ Ulaşım politikalarının eşitlik üzerindeki etkisi raporlanıyor mu?`,

    "Tarım": `## İzleme & Değerlendirme — Tarım Kontrol Listesi

☐ Tarım desteklerinden yararlanan kadın çiftçi oranı arttı mı?

☐ Tarımsal programların kadınların gelirine etkisi ölçülüyor mu?

☐ Tarım politikalarının kadın ve erkek çiftçiler üzerindeki etkisi değerlendiriliyor mu?

☐ Tarım desteklerinin dağılımı eşitlik perspektifiyle raporlanıyor mu?`,

    "Sosyal Koruma": `## İzleme & Değerlendirme — Sosyal Koruma Kontrol Listesi

☐ Sosyal programlar kadınların yoksulluk riskini azalttı mı?

☐ Sosyal yardımların dağılımı kadın ve erkekler açısından eşit mi?

☐ Sosyal koruma programlarının kadınların ekonomik bağımsızlığına etkisi ölçülüyor mu?

☐ Sosyal koruma politikalarının eşitlik üzerindeki etkisi düzenli olarak raporlanıyor mu?`,
  },
};

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function callClaude(userContent, systemPrompt, history = [], lang, role) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const messages = [
      ...history,
      { role: "user", content: userContent },
    ];

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, lang, role, customSystem: systemPrompt }),
      signal: controller.signal,
    });

    const rawBody = await res.text();
    let data = null;

    if (rawBody?.trim()) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        const sseChunks = rawBody
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.replace(/^data:\s*/, ""))
          .filter((line) => line && line !== "[DONE]");

        if (sseChunks.length) {
          const sseText = sseChunks
            .map((chunk) => {
              try {
                const parsed = JSON.parse(chunk);
                return parsed?.text || parsed?.delta || "";
              } catch {
                return "";
              }
            })
            .join("")
            .trim();

          if (sseText) return sseText;
        }

        throw new Error(
          lang === "tr"
            ? "Sunucu yanıtı okunamadı. Lütfen tekrar deneyin."
            : "Could not read the server response. Please try again."
        );
      }
    }

    if (!res.ok) {
      throw new Error(data?.error || (lang === "tr" ? "Sunucu hatası oluştu." : "A server error occurred."));
    }

    if (!data) {
      throw new Error(lang === "tr" ? "Sunucudan boş yanıt alındı. Lütfen tekrar deneyin." : "Received an empty response from the server. Please try again.");
    }

    if (data.error) throw new Error(data.error);
    return data.text || "—";
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Yanıt zaman aşımına uğradı. Lütfen tekrar deneyin.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── MARKDOWN RENDERER ────────────────────────────────────────────────────────
function MD({ text }) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  const formatInline = (value) => value
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith("# ")) { elements.push(<h1 key={i}>{l.slice(2)}</h1>); }
    else if (l.startsWith("## ")) { elements.push(<h2 key={i}>{l.slice(3)}</h2>); }
    else if (l.startsWith("### ")) { elements.push(<h3 key={i}>{l.slice(4)}</h3>); }
    else if (l.startsWith("- ") || l.startsWith("☐ ") || l.startsWith("* ")) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("☐ ") || lines[i].startsWith("* "))) {
        const raw = lines[i].replace(/^[-*☐] /, "");
        items.push(<li key={i} dangerouslySetInnerHTML={{ __html: formatInline(raw) }} />);
        i++;
      }
      elements.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    }
    else if (/^\d+\. /.test(l)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        const raw = lines[i].replace(/^\d+\. /, "");
        items.push(<li key={i} dangerouslySetInnerHTML={{ __html: formatInline(raw) }} />);
        i++;
      }
      elements.push(<ol key={`ol-${i}`}>{items}</ol>);
      continue;
    }
    else if (l.trim() === "") { elements.push(<div key={i} style={{ height: "0.5rem" }} />); }
    else { elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: formatInline(l) }} />); }
    i++;
  }

  return <div className="md-content">{elements}</div>;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EsitlikAsistani() {
  const [lang, setLang] = useState("tr");
  const [activeTab, setActiveTab] = useState(0);
  const [role, setRole] = useState(null);
  const L = LANG[lang];

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const endRef = useRef(null);

  const [docText, setDocText] = useState("");
  const [docResult, setDocResult] = useState("");
  const [docLoading, setDocLoading] = useState(false);

  const [phase, setPhase] = useState(0);
  const [sector, setSector] = useState(0);
  const [clResult, setClResult] = useState("");
  const [clLoading, setClLoading] = useState(false);

  const [rpForm, setRpForm] = useState({ institution: "", year: String(new Date().getFullYear()), sector: "", context: "" });
  const [rpResult, setRpResult] = useState("");
  const [rpLoading, setRpLoading] = useState(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendChat = async (override) => {
    const text = override ?? chatInput;
    if (!text.trim() || chatLoading) return;
    setChatInput("");
    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);

    const presetReply = getQuickPresetResponse(lang, text);
    if (presetReply) {
      setMessages([...newHistory, { role: "assistant", content: presetReply }]);
      return;
    }

    setChatLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callClaude(text, buildSystemPrompt(lang, role), history, lang, role);
      setMessages([...newHistory, { role: "assistant", content: reply }]);
    } catch (error) {
      const msg = lang === "tr"
        ? `Üzgünüm, yanıt üretilirken bir hata oluştu: ${error.message}`
        : `Sorry, an error occurred while generating the response: ${error.message}`;
      setMessages([...newHistory, { role: "assistant", content: msg }]);
    } finally {
      setChatLoading(false);
    }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    :root{--bg:#F8F9FA;--surface:#FFFFFF;--primary:#2563EB;--text:#111827;--text-secondary:#6B7280;--border:#E5E7EB;--shadow:0 8px 24px rgba(15,23,42,.06)}
    @media (prefers-color-scheme: dark){:root{--bg:#0F172A;--surface:#1E293B;--primary:#3B82F6;--text:#F1F5F9;--text-secondary:#94A3B8;--border:#334155;--shadow:0 8px 24px rgba(2,6,23,.45)}}
    *{box-sizing:border-box}
    body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
    .app{min-height:100vh;background:var(--bg);color:var(--text)}
    .surface{background:var(--surface);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow)}
    .header{border-bottom:1px solid var(--border);background:var(--surface)}
    .btn{border-radius:10px;padding:.65rem 1rem;font-family:inherit;font-size:.92rem;font-weight:500;cursor:pointer;transition:.2s all;border:1px solid transparent}
    .btn-primary{background:var(--primary);color:#fff}.btn-primary:hover:not(:disabled){filter:brightness(1.05)}
    .btn-ghost{background:var(--surface);color:var(--text);border-color:var(--border)} .btn-ghost:hover:not(:disabled){border-color:var(--primary);color:var(--primary)}
    .btn:disabled{opacity:.55;cursor:not-allowed}
    .tab{background:none;border:none;border-bottom:2px solid transparent;padding:.95rem 1rem;cursor:pointer;color:var(--text-secondary);font-weight:500}
    .tab.active{border-bottom-color:var(--primary);color:var(--primary)}
    .chip,.seg{width:100%;text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:.65rem .8rem;color:var(--text);font-size:.9rem;cursor:pointer;transition:.2s all}
    .chip:hover,.seg:hover{border-color:var(--primary)} .seg.selected{background:color-mix(in oklab,var(--primary) 10%, var(--surface));border-color:var(--primary);color:var(--primary)}
    input,textarea,select{width:100%;padding:.65rem .75rem;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font:inherit;line-height:1.6}
    input:focus,textarea:focus,select:focus{outline:2px solid color-mix(in oklab,var(--primary) 35%, transparent);border-color:var(--primary)}
    input::placeholder,textarea::placeholder{color:var(--text-secondary)}
    .muted{color:var(--text-secondary)}
    .fade{animation:fadeUp .3s ease}@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    .pulse{animation:pulse 1.3s infinite}@keyframes pulse{50%{opacity:.4}}
    .md-content h1{font-size:1.3rem;font-weight:600;margin:1rem 0 .4rem;border-bottom:1px solid var(--border);padding-bottom:.35rem}
    .md-content h2{font-size:1.15rem;font-weight:600;margin:.9rem 0 .35rem}
    .md-content h3{font-size:1rem;font-weight:600;margin:.8rem 0 .3rem}
    .md-content p,.md-content li{font-size:.95rem;line-height:1.75}
    .md-content strong{color:var(--primary);font-weight:600}
    .md-content ul,.md-content ol{padding-left:1.2rem;margin:.35rem 0}
    .advisor-layout{padding:0;display:flex;flex-direction:row;min-height:560px}
    .advisor-quick-panel{width:300px;flex-shrink:0;border-right:1px solid var(--border);padding:1rem;position:sticky;top:0;align-self:flex-start}
    .advisor-quick-list{display:grid;grid-template-columns:1fr;gap:.5rem}
    .advisor-chat-panel{flex:1;padding:1rem;display:flex;flex-direction:column;gap:1rem;min-width:0}
    .advisor-chat-messages{flex:1;min-height:260px;max-height:520px;overflow-y:auto;display:grid;gap:.75rem}
    .advisor-input-row{display:flex;gap:.5rem}
    @media (max-width: 767px){
      .advisor-layout{flex-direction:column}
      .advisor-quick-panel{width:100%;position:static;border-right:none;border-bottom:1px solid var(--border)}
      .advisor-chat-messages{max-height:440px}
    }
  `;

  const resultCard = (content) => content && <div className="surface fade" style={{ padding: "1rem 1.2rem" }}><MD text={content} /></div>;

  if (!role) return (
    <div className="app" suppressHydrationWarning>
      <style>{css}</style>
      <div className="header" style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 600 }}>⚖</div>
          <div><div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{L.appTitle}</div><div className="muted" style={{ fontSize: ".85rem" }}>{L.appSubtitle}</div></div>
        </div>
        <button className="btn btn-ghost" onClick={() => setLang(l => l === "tr" ? "en" : "tr")}>{L.langToggle}</button>
      </div>
      <div style={{ maxWidth: 820, margin: "2.5rem auto", padding: "0 1rem" }}>
        <div className="surface" style={{ padding: "1.4rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 600 }}>{L.roleSelect.title}</h1>
          <p className="muted" style={{ margin: ".4rem 0 1.3rem" }}>{L.roleSelect.subtitle}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "0.8rem" }}>
            {L.roleSelect.roles.map(r => (
              <button key={r.id} className="chip" onClick={() => setRole(r.id)} style={{ textAlign: "left", borderColor: role === r.id ? "var(--primary)" : undefined }}>
                <div style={{ fontSize: "1.2rem" }}>{r.icon} <span style={{ fontWeight: 600 }}>{r.label}</span></div>
                <div className="muted" style={{ fontSize: ".86rem" }}>{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app" suppressHydrationWarning>
      <style>{css}</style>
      <div className="header" style={{ padding: "0.8rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 600 }}>⚖</div>
          <div><div style={{ fontSize: "1.15rem", fontWeight: 600 }}>{L.appTitle}</div><div className="muted" style={{ fontSize: ".8rem" }}>{L.appSubtitle}</div></div>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button className="btn btn-ghost" onClick={() => setRole(null)}>{L.chat.changeRole}</button>
          <button className="btn btn-ghost" onClick={() => setLang(l => l === "tr" ? "en" : "tr")}>{L.langToggle}</button>
        </div>
      </div>

      <div className="header" style={{ display: "flex", padding: "0 1rem", gap: "0.25rem", overflowX: "auto" }}>
        {L.tabs.map((t, i) => <button key={i} className={`tab ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>{t}</button>)}
      </div>

      <div style={{ maxWidth: 900, margin: "1.2rem auto", padding: "0 1rem 1.5rem" }}>
        {activeTab === 0 && (
          <div className="surface advisor-layout">
            <div className="advisor-quick-panel">
              <div className="muted" style={{ fontSize: ".86rem", marginBottom: ".4rem", fontWeight: 500 }}>{L.chat.quickTitle}</div>
              <div className="advisor-quick-list">{L.chat.quick.map((q, i) => <button key={i} className="chip" onClick={() => sendChat(q)}>{q}</button>)}</div>
            </div>
            <div className="advisor-chat-panel">
            <div className="advisor-chat-messages">
              {messages.map((m, i) => <div key={i} className="fade" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}><div className="surface" style={{ maxWidth: "82%", padding: "0.8rem 0.9rem", borderRadius: 10, background: m.role === "user" ? "color-mix(in oklab,var(--primary) 14%, var(--surface))" : "var(--surface)" }}>{m.role === "assistant" ? <MD text={m.content} /> : <p style={{ margin: 0 }}>{m.content}</p>}</div></div>)}
              {chatLoading && <div className="muted pulse">{L.chat.thinking}</div>}
              <div ref={endRef} />
            </div>
            <div className="advisor-input-row">
              <textarea value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }} placeholder={L.chat.placeholder} style={{ height: 64, resize: "none" }} />
              <button className="btn btn-primary" onClick={() => sendChat()} disabled={chatLoading || !chatInput.trim()}>{L.chat.send}</button>
            </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="surface" style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
            <div><div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{L.docAnalysis.title}</div><div className="muted">{L.docAnalysis.subtitle}</div></div>
            <div style={{ border: "2px dashed var(--border)", borderRadius: 10, padding: "1.2rem", textAlign: "center" }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setDocText(ev.target.result); r.readAsText(f); } }}>
              <div style={{ fontSize: "1.6rem" }}>📄</div><div>{L.docAnalysis.upload}</div><div className="muted" style={{ fontSize: ".85rem" }}>{L.docAnalysis.uploadHint}</div>
            </div>
            <div><div className="muted" style={{ fontWeight: 500 }}>{L.docAnalysis.pasteLabel}</div><textarea value={docText} onChange={e => setDocText(e.target.value)} placeholder={L.docAnalysis.pastePlaceholder} style={{ minHeight: 150 }} /></div>
            <button className="btn btn-primary" onClick={async () => { setDocLoading(true); setDocResult(""); const r = await callClaude(buildDocPrompt(lang, docText), buildSystemPrompt(lang, role)); setDocResult(r); setDocLoading(false); }} disabled={docLoading || !docText.trim()}>{docLoading ? L.docAnalysis.analyzing : L.docAnalysis.analyze}</button>
            {docLoading && <span className="muted pulse">{L.docAnalysis.analyzing}</span>}
            {resultCard(docResult)}
          </div>
        )}

        {activeTab === 2 && (
          <div className="surface" style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
            <div><div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{L.checklist.title}</div><div className="muted">{L.checklist.subtitle}</div></div>
            {[{ label: L.checklist.phaseLabel, items: L.checklist.phases, val: phase, set: setPhase }, { label: L.checklist.sectorLabel, items: L.checklist.sectors, val: sector, set: setSector }].map(({ label, items, val, set }, idx) => (
              <div key={idx}><div className="muted" style={{ fontWeight: 500, marginBottom: ".4rem" }}>{label}</div><div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>{items.map((it, i) => <button key={i} className={`seg ${val === i ? "selected" : ""}`} onClick={() => set(i)} style={{ width: "auto" }}>{it}</button>)}</div></div>
            ))}
            <button className="btn btn-primary" onClick={() => {
              const phaseName = L.checklist.phases[phase];
              const sectorName = L.checklist.sectors[sector];
              const preset = CHECKLIST_PRESETS[phaseName]?.[sectorName];
              if (preset) {
                setClResult(preset);
              } else {
                // fallback to API if no preset found
                setClLoading(true);
                setClResult("");
                callClaude(buildChecklistPrompt(lang, phaseName, sectorName), buildSystemPrompt(lang, role))
                  .then(r => setClResult(r))
                  .finally(() => setClLoading(false));
              }
            }} disabled={clLoading}>{clLoading ? L.checklist.generating : L.checklist.generate}</button>
            {clLoading && <span className="muted pulse">{L.checklist.generating}</span>}
            {resultCard(clResult)}
          </div>
        )}

        {activeTab === 3 && (
          <div className="surface" style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
            <div><div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{L.report.title}</div><div className="muted">{L.report.subtitle}</div></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
              {[{ key: "institution", label: L.report.institution }, { key: "year", label: L.report.year }].map(({ key, label }) => <div key={key}><div className="muted" style={{ fontWeight: 500 }}>{label}</div><input value={rpForm[key]} onChange={e => setRpForm(f => ({ ...f, [key]: e.target.value }))} /></div>)}
            </div>
            <div><div className="muted" style={{ fontWeight: 500 }}>{L.report.sector}</div><select value={rpForm.sector} onChange={e => setRpForm(f => ({ ...f, sector: e.target.value }))}>{L.checklist.sectors.map((s, i) => <option key={i} value={s}>{s}</option>)}</select></div>
            <div><div className="muted" style={{ fontWeight: 500 }}>{L.report.context}</div><textarea value={rpForm.context} onChange={e => setRpForm(f => ({ ...f, context: e.target.value }))} placeholder={L.report.contextPlaceholder} style={{ minHeight: 96 }} /></div>
            <button className="btn btn-primary" onClick={async () => { setRpLoading(true); setRpResult(""); const r = await callClaude(buildReportPrompt(lang, rpForm.institution, rpForm.year, rpForm.sector || L.checklist.sectors[0], rpForm.context), buildSystemPrompt(lang, role)); setRpResult(r); setRpLoading(false); }} disabled={rpLoading || !rpForm.institution || !rpForm.year}>{rpLoading ? L.report.generating : L.report.generate}</button>
            {rpLoading && <span className="muted pulse">{L.report.generating}</span>}
            {resultCard(rpResult)}
          </div>
        )}

        <div className="muted" style={{ textAlign: "center", fontSize: ".82rem", marginTop: "1rem" }}>{L.poweredBy}</div>
      </div>
    </div>
  );
}
