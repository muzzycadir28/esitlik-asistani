"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import mammoth from "mammoth";
import bgImage from "../lib/background.webp";


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
      uploadHint: "Desteklenen formatlar: .txt, .pdf, .doc, .docx",
      uploadSection: "Dosya yükleme",
      pasteSection: "Veya metin yapıştırın",
      clear: "Temizle",
      selectedFile: "Yüklenen dosya",
      charCount: "Karakter",
      wordCount: "Analiz edilecek kelime",
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
      uploadHint: "Supported formats: .txt, .pdf, .doc, .docx",
      uploadSection: "File upload",
      pasteSection: "Or paste text",
      clear: "Clear",
      selectedFile: "Uploaded file",
      charCount: "Characters",
      wordCount: "Words to analyze",
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

const ROLE_TABS = {
  tr: {
    official: [
      { id: "dashboard", label: "Ana Sayfa" },
      { id: "chat", label: "Danışman" },
      { id: "policy", label: "Politika Tasarımı" },
      { id: "doc", label: "Belge Analizi" },
      { id: "checklist", label: "Rehber & Kontrol" },
      { id: "report", label: "Rapor Oluştur" },
      { id: "resources", label: "Kaynaklar" },
    ],
    local: [
      { id: "dashboard", label: "Ana Sayfa" },
      { id: "chat", label: "Danışman" },
      { id: "urban", label: "Kentsel Planlama" },
      { id: "service", label: "Hizmet Analizi" },
      { id: "monitoring", label: "İzleme & Göstergeler" },
      { id: "report", label: "Rapor Oluştur" },
      { id: "bestpractice", label: "İyi Uygulamalar" },
    ],
    academic: [
      { id: "dashboard", label: "Ana Sayfa" },
      { id: "chat", label: "Danışman" },
      { id: "doc", label: "Belge Analizi" },
      { id: "data", label: "Veri & Göstergeler" },
      { id: "resources", label: "Kaynaklar" },
    ],
    ngo: [
      { id: "dashboard", label: "Ana Sayfa" },
      { id: "chat", label: "Danışman" },
      { id: "advocacy", label: "Savunuculuk Rehberi" },
      { id: "doc", label: "Belge Analizi" },
      { id: "monitoring", label: "İzleme Soruları" },
      { id: "resources", label: "Kaynaklar" },
    ],
  },
  en: {
    official: [
      { id: "dashboard", label: "Dashboard" },
      { id: "chat", label: "Advisor" },
      { id: "policy", label: "Policy Design" },
      { id: "doc", label: "Document Analysis" },
      { id: "checklist", label: "Guide & Checklist" },
      { id: "report", label: "Generate Report" },
      { id: "resources", label: "Resources" },
    ],
    local: [
      { id: "dashboard", label: "Dashboard" },
      { id: "chat", label: "Advisor" },
      { id: "urban", label: "Urban Planning" },
      { id: "service", label: "Service Analysis" },
      { id: "monitoring", label: "Monitoring & Indicators" },
      { id: "report", label: "Generate Report" },
      { id: "bestpractice", label: "Good Practices" },
    ],
    academic: [
      { id: "dashboard", label: "Dashboard" },
      { id: "chat", label: "Advisor" },
      { id: "doc", label: "Document Analysis" },
      { id: "data", label: "Data & Indicators" },
      { id: "resources", label: "Resources" },
    ],
    ngo: [
      { id: "dashboard", label: "Dashboard" },
      { id: "chat", label: "Advisor" },
      { id: "advocacy", label: "Advocacy Guide" },
      { id: "doc", label: "Document Analysis" },
      { id: "monitoring", label: "Monitoring Questions" },
      { id: "resources", label: "Resources" },
    ],
  },
};

const DASHBOARD_CARDS = {
  official: ["chat", "policy", "doc", "report"],
  local: ["chat", "urban", "service", "bestpractice"],
  academic: ["chat", "doc", "data", "resources"],
  ngo: ["chat", "advocacy", "doc", "monitoring"],
};

const TAB_ICONS = {
  chat: "💬",
  policy: "📋",
  doc: "📄",
  checklist: "✅",
  report: "📊",
  resources: "📚",
  urban: "🏙️",
  service: "🔧",
  monitoring: "📈",
  bestpractice: "⭐",
  data: "📉",
  advocacy: "📣",
};

const QUICK_PRESET_RESPONSES = {
  tr: {
    "keedb nedir ve neden önemlidir?": `## 

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
    "keedb için hangi ilk adımları atabiliriz?": `##

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
    "keedb'nin temel araçları nelerdir?": `##

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
    "keedb hangi politika döngüsü aşamalarında uygulanabilir?": `##

Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) yalnızca bütçe hazırlama aşamasında değil, kamu politika döngüsünün tüm aşamalarında uygulanabilir.

## KEEDB'nin Uygulanabildiği Aşamalar

1️⃣ **Sorun Analizi / Gündem Belirleme** — Kadın ve erkeklerin farklı ihtiyaçlarının belirlenmesi, cinsiyete göre ayrıştırılmış verilerin kullanılması ve eşitsizliklerin tespiti. Örnek: Ulaşım politikası hazırlanırken kadınların gece ulaşım güvenliği sorunlarının analiz edilmesi.

2️⃣ **Politika ve Program Tasarımı** — Eşitliğe duyarlı hedef ve göstergeler belirleme, kadın ve erkeklerin ihtiyaçlarına uygun politika araçları geliştirme. Örnek: Kadın istihdamını artırmaya yönelik eğitim programlarının tasarlanması.

3️⃣ **Bütçe Hazırlama** — Kadın erkek eşitliğine duyarlı bütçe analizi, eşitlik hedeflerine uygun kaynak dağılımı. Bu aşamada bütçenin kimlere fayda sağladığı analiz edilir.

4️⃣ **Uygulama** — Kadın ve erkeklerin hizmetlere erişiminin izlenmesi, harcamaların eşitlik hedeflerine uygun kullanılması.

5️⃣ **İzleme ve Değerlendirme** — Eşitliğe duyarlı performans göstergeleri, bütçe etkisinin değerlendirilmesi, politika sonuçlarının kadınlar ve erkekler üzerindeki etkisinin analizi.

✅ **Sonuç:** KEEDB, bütçenin yalnızca hazırlanmasında değil; politika geliştirme, planlama, uygulama ve değerlendirme süreçlerinin tamamında uygulanabilen bir yaklaşımdır.`,
    "dünya'dan başarılı örnekler paylaşır mısın?": `##

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
  const roleCtx = {
    tr: {
      official: "Merkezi kamu idaresi çalışanı — bakanlık düzeyinde bütçe ve stratejik plan odaklı yanıt ver.",
      local: "Belediye veya il özel idaresi çalışanı — yerel bütçe ve hizmet planlaması odaklı yanıt ver.",
      academic: "Akademisyen veya araştırmacı — metodoloji ve akademik kaynak odaklı yanıt ver.",
      ngo: "STK temsilcisi — savunuculuk, izleme ve kapasite geliştirme odaklı yanıt ver.",
    },
    en: {
      official: "Central government staff — focus on ministry-level budget and strategic planning.",
      local: "Municipality staff — focus on local budget and service planning.",
      academic: "Researcher — focus on methodology and academic sources.",
      ngo: "NGO representative — focus on advocacy, monitoring and capacity building.",
    },
  };

  if (lang === "tr") return `Sen Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) uzmanı bir yapay zeka danışmanısın.
Kullanıcı profili: ${roleCtx.tr[role] || roleCtx.tr.official}
Görevin: KEEDB konusunda bilgi, rehberlik ve pratik öneriler sun.
Kurallar:
- "Kadın erkek eşitliği" ifadesini kullan, "toplumsal cinsiyet" yerine.
- Emin olmadığın bilgiyi uydurma.
- Siyasi yorum yapma, tarafsız ol.
- Konu dışı sorularda kibarca yönlendir: "Ben Eşitlik Asistanıyım 😊 KEEDB konusuna dönelim."
- Önce kısa özet ver, madde işaretleri kullan, uygulanabilir adımlar öner.`;

  return `You are the GRB Assistant, an AI advisor specializing in Gender Responsive Budgeting (GRB).

## RESPONSIBILITIES
- Explain what GRB is, why it matters, and the legal/policy frameworks around it. Always use the term "Gender Responsive Budgeting (GRB)".
- Offer step-by-step guidance for integrating GRB into planning and budgeting processes. Provide templates, checklists, and examples.
- Share tailored recommendations depending on the user's context (national, local, academia, civil society).
- Present examples from Türkiye and globally. Highlight lessons learned and good practices.

## PRINCIPLES
- Terminology: Always say "Gender Responsive Budgeting (GRB)".
- Neutrality: Present evidence-based, balanced information.
- Inclusivity: Emphasize benefits for both women and men.
- Action-Oriented: Provide practical, implementable steps.

## USER PROFILE
${roleCtx.en[role] || roleCtx.en.official}

## RESPONSE FORMAT
- Begin with a short summary, provide details in bullet points, tables, or examples.
- Offer more technical detail if requested.
- For long answers, summarize first. Expand only if asked.

## ROLE-BASED MODULES
When user identifies their role, switch to the appropriate module:
- Policymakers: Strategic and decision-making guidance
- Public Officials: Steps for planning and budgeting
- Local Government: Municipal GRB practices
- Academics: Teaching materials and case studies
- Civil Society: Advocacy and partnership tools

If user asks "What are the first steps to start GRB?", first ask about their role/position, then provide a tailored answer.

## SOURCE PRIORITY
1. Retrieved knowledge base documents (provided as context)
2. Official Turkish sources: http://sp.gov.tr/tr/stratejik-plan and relevant ministry websites
3. UN Women Digital Library: https://www.unwomen.org/en/digital-library/publications
4. General knowledge (only if not found above)

Always prioritize retrieved documents as first source of truth. If no relevant content found, use general knowledge.

## CITATIONS
When citing documents, use APA 7th edition format at the end under "References":
Author/Institution. (Year). Title. Publisher. URL

## OFF-TOPIC HANDLING
If user asks something unrelated to GRB, respond politely with light humor and guide back:
"That's a fun question! But since I'm your GRB Assistant, let's get back to budgeting with equality in mind 🚀"

## DOCUMENT LINKS
If user shares a hyperlink, explain you cannot open external URLs and ask them to upload the file directly.

## NEVER fabricate information. If uncertain, say so and recommend official sources.`;
};

const buildDocPrompt = (lang, text) => {
  const truncated = text.slice(0, 3000);
  if (lang === "tr") return `Aşağıdaki belgeyi KEEDB perspektifinden analiz et (maks 400 kelime):

${truncated}

Şunları yaz:
1. KEEDB seviyesi (Başlangıç/Gelişmekte/İleri)
2. Tespit edilen 3 ana sorun
3. En önemli 5 öneri (uygulanabilir adımlar olarak)`;

  return `Analyse the following document from a GRB perspective (max 400 words):

${truncated}

Include:
1. GRB level (Beginner/Developing/Advanced)
2. Top 3 issues identified
3. Top 5 priority recommendations (as actionable steps)`;
};

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

const CHECKLIST_PRESETS_EN = {
  "Policy Design": {
    "General": `## Policy Design — General Checklist

☐ Are there differences between women and men in terms of access, use, or outcomes in this policy area, and what data sources demonstrate these differences?

☐ Were sex-disaggregated data used during policy design, and what are the sources of these data?

☐ Are the policy objectives designed to address the different needs and priorities of women and men?

☐ Have measurable targets been established to reduce gender inequalities as a result of the policy implementation?`,

    "Health": `## Policy Design — Health Checklist

☐ Have geographical or socioeconomic disparities between women and men in accessing health services been analysed?

☐ Are gender-specific health needs, such as maternal health, reproductive health, or male-specific health risks, considered in the policy design?

☐ Have the utilization rates of health services been analysed by sex and integrated into policy objectives?

☐ Does the policy include specific programmes or services aimed at improving access to healthcare for women or men?`,

    "Education": `## Policy Design — Education Checklist

☐ Have access to and retention in education for girls and boys been analysed using sex-disaggregated data?

☐ Does the education policy address the different learning needs and opportunities of female and male students?

☐ Have school dropout rates and academic achievement been analysed by sex and reflected in policy targets?

☐ Does the policy include measures to address structural barriers faced by girls in education?`,

    "Transport": `## Policy Design — Transport Checklist

☐ Have travel patterns and mobility needs of women and men been analysed using evidence-based data?

☐ Are women's safety experiences in transport systems (e.g., lighting, safety at stops and stations) considered in policy design?

☐ Does the transport policy address the multi-stop travel patterns often associated with care responsibilities?

☐ Has the accessibility of transport services for women and men with disabilities been considered?`,

    "Agriculture": `## Policy Design — Agriculture Checklist

☐ Have differences between women and men in access to productive resources (land, credit, inputs) been analysed?

☐ Has the gender distribution of beneficiaries of agricultural support programmes been examined?

☐ Are women farmers' access to training, finance, and cooperatives considered in the policy analysis?

☐ Does the policy include objectives to strengthen women's participation and empowerment in agricultural production?`,

    "Social Protection": `## Policy Design — Social Protection Checklist

☐ Have the impacts of social assistance and services on women and men been analysed?

☐ Has the burden of unpaid care work, particularly on women, been considered in policy design?

☐ Are social protection policies designed to support women's economic empowerment and labour market participation?

☐ Does the policy include targeted support mechanisms for disadvantaged groups of women and men?`,
  },

  "Budget Preparation": {
    "General": `## Budget Preparation — General Checklist

☐ Are policy objectives integrated into budget programmes from a gender equality perspective?

☐ During budget preparation, have the different impacts of public expenditure on women and men been analysed?

☐ Have specific budget allocations been established to support gender equality objectives?

☐ Are performance indicators defined in a way that allows results to be measured separately for women and men?`,

    "Health": `## Budget Preparation — Health Checklist

☐ Is sufficient funding allocated to programmes aimed at improving women's access to healthcare services?

☐ Are expenditures related to maternal health and women's health services clearly visible in the budget?

☐ Do budget allocations include preventive programmes addressing major health risks affecting men?

☐ Are resources allocated to strengthen healthcare services in rural or disadvantaged areas?`,

    "Education": `## Budget Preparation — Education Checklist

☐ Does the budget include programmes aimed at increasing girls' access to education?

☐ Are initiatives promoting girls' participation in STEM fields adequately financed?

☐ Are there budget allocations for programmes aimed at reducing school dropout rates?

☐ Are educational materials and programmes financed in ways that promote gender equality in education?`,

    "Transport": `## Budget Preparation — Transport Checklist

☐ Are funds allocated for infrastructure improvements that enhance transport safety?

☐ Are resources dedicated to safety measures in public transport systems?

☐ Does the budget include investments that improve accessibility for persons with disabilities?

☐ Are investments planned to improve service quality on transport routes frequently used by women?`,

    "Agriculture": `## Budget Preparation — Agriculture Checklist

☐ Are there dedicated budget allocations for programmes supporting women farmers?

☐ Are resources allocated to increase women's participation in agricultural training and advisory services?

☐ Are rural development programmes supporting women's entrepreneurship in agriculture included in the budget?

☐ Has the distribution of agricultural subsidies been analysed from a gender equality perspective?`,

    "Social Protection": `## Budget Preparation — Social Protection Checklist

☐ Are sufficient resources allocated for childcare, care services, or social support programmes?

☐ Does the budget include programmes aimed at supporting women's labour force participation?

☐ Has the distribution of social benefits been analysed by sex of beneficiaries?

☐ Are poverty reduction programmes financed in ways that support women's economic independence?`,
  },

  "Implementation": {
    "General": `## Implementation — General Checklist

☐ Is the distribution of beneficiaries by sex regularly monitored during programme implementation?

☐ Have barriers affecting women's and men's access to services been identified during implementation?

☐ Are there implementation mechanisms supporting the achievement of gender equality objectives?

☐ Are feedback and experiences from women and men users systematically collected?`,

    "Health": `## Implementation — Health Checklist

☐ Is the sex distribution of healthcare service users regularly monitored?

☐ Are healthcare services accessible to women in rural or disadvantaged areas?

☐ Are programmes targeting women's health effectively delivered in practice?

☐ Is user satisfaction with healthcare services assessed separately for women and men?`,

    "Education": `## Implementation — Education Checklist

☐ Are participation rates in education programmes monitored by sex?

☐ Are school dropout rates tracked separately for girls and boys?

☐ Are education programmes implemented in ways that address the needs of both girls and boys?

☐ Are student achievement indicators regularly analysed to assess equality of opportunity?`,

    "Transport": `## Implementation — Transport Checklist

☐ Is the rate of women's use of transport services monitored?

☐ Are safety concerns in transport systems regularly assessed?

☐ Are public transport services designed to accommodate users with care responsibilities?

☐ Is transport infrastructure implemented in a way that ensures accessibility for women and men with disabilities?`,

    "Agriculture": `## Implementation — Agriculture Checklist

☐ Is the share of women farmers benefiting from agricultural subsidies monitored?

☐ Is women's participation in agricultural training programmes tracked?

☐ Are programmes supporting women farmers effectively implemented in practice?

☐ Is the distribution of agricultural support balanced between women and men farmers?`,

    "Social Protection": `## Implementation — Social Protection Checklist

☐ Is the sex distribution of beneficiaries of social services monitored?

☐ Do social programmes contribute to women's economic empowerment?

☐ Do care services support women's participation in the labour market?

☐ Are there differences between women and men in access to social services?`,
  },

  "Monitoring & Evaluation": {
    "General": `## Monitoring & Evaluation — General Checklist

☐ Are programme results analysed separately for women and men?

☐ Is progress towards policy objectives measured using gender equality indicators?

☐ Have programme results contributed to reducing gender inequalities?

☐ Are monitoring results used as feedback for future policy and budgeting processes?`,

    "Health": `## Monitoring & Evaluation — Health Checklist

☐ Has the gap between women and men in access to healthcare services decreased?

☐ Are maternal health and other health indicators evaluated using sex-disaggregated data?

☐ Are the impacts of health programmes measured separately for women and men?

☐ Are health policy outcomes reported from a gender equality perspective?`,

    "Education": `## Monitoring & Evaluation — Education Checklist

☐ Are indicators of equal opportunities in education monitored by sex?

☐ Are school dropout rates and academic achievement regularly analysed by sex?

☐ Are the impacts of education policies on girls and boys assessed?

☐ Are education policy outcomes reported using a gender equality perspective?`,

    "Transport": `## Monitoring & Evaluation — Transport Checklist

☐ Is women's perception of safety in transport systems measured?

☐ Are transport usage rates analysed using sex-disaggregated data?

☐ Are the impacts of transport investments on women and men evaluated?

☐ Are the gender equality impacts of transport policies reported?`,

    "Agriculture": `## Monitoring & Evaluation — Agriculture Checklist

☐ Has the share of women farmers benefiting from subsidies increased?

☐ Is the impact of agricultural programmes on women's income and livelihoods measured?

☐ Are the impacts of agricultural policies on women and men farmers assessed?

☐ Is the distribution of agricultural support reported from a gender equality perspective?`,

    "Social Protection": `## Monitoring & Evaluation — Social Protection Checklist

☐ Have social programmes reduced the poverty risk among women?

☐ Is the distribution of social benefits equitable between women and men?

☐ Is the impact of social protection programmes on women's economic independence measured?

☐ Are the gender equality impacts of social protection policies regularly reported?`,
  },
};

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function callClaude(userContent, systemPrompt, history = [], lang, role) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const messages = [{ role: "user", content: userContent }];

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

const POLICY_STEPS = [
  {
    id: 1, title: 'Bağlam Analizi',
    aiPrompt: 'Bu politika hangi sektörde geliştiriliyor? Kurumunuzun rolü nedir? Bu çalışma yeni mi yoksa mevcut bir programın revizyonu mu? Hangi üst politika belgelerine bağlı?',
    chips: ['Sağlık', 'Eğitim', 'Tarım', 'Ulaşım', 'Sosyal Koruma', 'İstihdam', 'Yeni politika', 'Mevcut programı geliştirme'],
    outputFields: ['sector', 'institution_role', 'policy_type', 'strategic_link'],
    outputLabels: ['Sektör', 'Kurumsal rol', 'Politika türü', 'Stratejik bağlantı'],
  },
  {
    id: 2, title: 'Sorun Analizi',
    aiPrompt: 'Çözmek istediğiniz temel sorun nedir? Bu sorun kimleri etkiliyor? Kadınlar ve erkekler bu sorundan aynı şekilde mi etkileniyor? Elinizde veri var mı?',
    chips: ['Veri var', 'Veri yok', 'Veri kısmi', 'Erişim sorunu', 'Katılım sorunu', 'Güvenlik sorunu'],
    outputFields: ['problem_definition', 'affected_groups', 'gender_gap', 'data_status'],
    outputLabels: ['Sorun tanımı', 'Etkilenen gruplar', 'Cinsiyet açığı', 'Veri durumu'],
  },
  {
    id: 3, title: 'Hedef Grup Analizi',
    aiPrompt: 'Politika kimleri hedefliyor? Kadınlar ve erkekler içinde farklı alt gruplar var mı? Hangi gruplar daha kırılgan? Coğrafi farklılık var mı?',
    chips: ['Genç kadınlar', 'Yaşlılar', 'Engelli bireyler', 'Kırsal nüfus', 'Göçmenler', 'Tek ebeveynler', 'Düşük gelirli gruplar'],
    outputFields: ['primary_target', 'secondary_target', 'vulnerable_groups', 'intersectionality'],
    outputLabels: ['Birincil hedef grup', 'İkincil hedef grup', 'Kırılgan gruplar', 'Kesişen eşitsizlikler'],
  },
  {
    id: 4, title: 'Ex-ante Etki Analizi',
    aiPrompt: 'Politikanın uygulanmadan önceki etkilerini değerlendirelim:\n1. ERİŞİM: Politika kadınlar ve erkekler için eşit erişilebilir olacak mı? Kimler dışarıda kalabilir?\n2. FAYDA: Politikadan kim daha fazla fayda sağlayacak?\n3. KATILIM: Karar süreçlerine eşit katılım sağlanacak mı?\n4. ZAMAN: Politika bakım yükünü artırır mı azaltır mı?\n5. GÜVENLİK: Güvenlik açısından farklı etkiler yaratır mı?',
    chips: ['Eşit erişim sağlar', 'Erişim engeli var', 'Fayda dengeli', 'Fayda eşitsiz', 'Bakım yükü azalır', 'Bakım yükü artar', 'Güvenli', 'Risk var'],
    outputFields: ['impact_access', 'impact_benefit', 'impact_participation', 'impact_time', 'impact_safety'],
    outputLabels: ['Erişim etkisi', 'Fayda dağılımı', 'Katılım etkisi', 'Zaman/bakım etkisi', 'Güvenlik etkisi'],
    isScoring: true,
  },
  {
    id: 5, title: 'Politika Tasarımı',
    aiPrompt: 'Analiz sonuçlarına göre: Bu politika ile hangi eşitsizlik azaltılacak? Ne değişmeli? Hangi sonuç hedefleniyor?',
    chips: ['Hizmet erişimi artırma', 'İstihdam desteği', 'Bakım hizmetleri', 'Kapasite geliştirme', 'Farkındalık artırma'],
    outputFields: ['policy_objective', 'expected_change'],
    outputLabels: ['Politika amacı', 'Beklenen değişim'],
  },
  {
    id: 6, title: 'Faaliyet Tasarımı',
    aiPrompt: 'Hedefe ulaşmak için hangi faaliyetler gerekli? Herkes için aynı mı yoksa farklılaştırılmış mı? Erişim engelleri nasıl kaldırılacak?',
    chips: ['Eğitim/kapasite', 'Hizmet sunumu', 'Altyapı', 'Mevzuat', 'Farkındalık', 'Koordinasyon', 'Veri toplama'],
    outputFields: ['activities', 'gender_adjustments', 'responsible_units'],
    outputLabels: ['Faaliyetler', 'Eşitlik uyarlamaları', 'Sorumlu birimler'],
  },
  {
    id: 7, title: 'Bütçe Bağlantısı',
    aiPrompt: 'Bu politika mevcut bütçede yer alıyor mu? Kaynak yeterli mi? Bütçe kimlere gidiyor? Harcamaların cinsiyete göre dağılımı izlenebilir mi?',
    chips: ['Mevcut bütçe yeterli', 'Ek kaynak gerekli', 'Bütçe belirsiz', 'İzleme mevcut', 'İzleme yok'],
    outputFields: ['budget_link', 'resource_gap', 'beneficiary_distribution'],
    outputLabels: ['Bütçe bağı', 'Kaynak açığı', 'Yararlanıcı dağılımı'],
  },
  {
    id: 8, title: 'Göstergeler',
    aiPrompt: 'Başarı nasıl ölçülecek? Veriler cinsiyete göre ayrıştırılabilir mi? Hangi çıktı, sonuç ve etki göstergeleri kullanılacak?',
    chips: ['Çıktı göstergesi', 'Sonuç göstergesi', 'Etki göstergesi', 'Cinsiyete göre ayrıştırılmış', 'Yıllık izleme'],
    outputFields: ['output_indicators', 'outcome_indicators', 'sex_disaggregated'],
    outputLabels: ['Çıktı göstergeleri', 'Sonuç göstergeleri', 'Cinsiyet ayrıştırması'],
  },
  {
    id: 9, title: 'Risk ve Öneri',
    aiPrompt: 'Politikanın uygulanmasında karşılaşılabilecek riskler neler? Eşitsizlik açısından hangi önlemler alınmalı? Politikayı eşitlik açısından güçlendirmek için önerileriniz?',
    chips: ['Kurumsal kapasite riski', 'Veri eksikliği riski', 'Uygulama riski', 'Katılım riski', 'Bütçe riski'],
    outputFields: ['risks', 'mitigation_measures', 'improvement_suggestions'],
    outputLabels: ['Riskler', 'Azaltma önlemleri', 'İyileştirme önerileri'],
  },
];

const URBAN_STEPS = [
  {
    id: 1, title: 'Planlama Bağlamı',
    aiPrompt: 'Planlama çalışması hangi ölçekte? Yeni plan mı yoksa mevcut planın revizyonu mu? Bu plan hangi mahalle veya bölgeyi kapsıyor?',
    chips: ['Yeni yerleşim', 'Mevcut mahalle iyileştirmesi', 'Ulaşım planı', 'Kamusal alan tasarımı', 'Kentsel dönüşüm'],
    outputFields: ['planningArea', 'planType', 'planScale', 'planPurpose'],
    outputLabels: ['Planlama alanı', 'Plan türü', 'Plan ölçeği', 'Plan amacı'],
  },
  {
    id: 2, title: 'Kentsel Sorun Tanımı',
    aiPrompt: 'Bu bölgede hangi kentsel sorunlar var? Kamusal alan kullanımı eşit mi? Güvenlik algısı nasıl? Hizmetlere erişimde farklılık var mı?',
    chips: ['Gece güvenliği', 'Toplu taşıma erişimi', 'Bakım hizmetleri', 'Kamusal alan kullanımı', 'Yaya erişimi', 'Çocuk bakım yükü'],
    outputFields: ['urbanProblem', 'equalityDimension', 'currentSituation'],
    outputLabels: ['Kentsel sorun', 'Eşitlik boyutu', 'Mevcut durum'],
  },
  {
    id: 3, title: 'Kullanıcı Grupları',
    aiPrompt: 'Bu alanı kimler kullanıyor? Kadınlar ve erkekler aynı sıklıkta mı kullanıyor? Günün farklı saatlerinde kullanım değişiyor mu? Hangi gruplar zorlanıyor?',
    chips: ['Çocuklu kadınlar', 'Yaşlılar', 'Gençler', 'Engelli bireyler', 'Öğrenciler', 'Bakım verenler', 'Çalışan kadınlar'],
    outputFields: ['userGroups', 'accessProblems', 'inequalityFindings'],
    outputLabels: ['Ana kullanıcı grupları', 'Erişim sorunları', 'Eşitsizlik tespiti'],
  },
  {
    id: 4, title: 'Planlama Amacı',
    aiPrompt: 'Bu plan ile hangi eşitsizlik azaltılmak isteniyor? Alan daha güvenli mi olacak? Hizmetlere erişim mi artacak? Kamusal alan kullanımı mı dengelenecek?',
    chips: ['Güvenlik artırma', 'Erişim iyileştirme', 'Kamusal alan dengesi', 'Bakım hizmetleri', 'Ulaşım erişimi'],
    outputFields: ['planningObjective', 'expectedChange'],
    outputLabels: ['Planlama amacı', 'Beklenen değişim'],
  },
  {
    id: 5, title: 'Kentsel Müdahaleler',
    aiPrompt: 'Fiziksel düzenlemeler gerekli mi? Aydınlatma yeterli mi? Kreş veya bakım hizmetleri gerekli mi? Alan gece de kullanılabilir mi?',
    chips: ['Aydınlatma artırma', 'Güvenli yürüyüş yolları', 'Toplu taşıma erişimi', 'Bakım hizmetleri', 'Kamusal alan tasarımı', 'Yeşil alan', 'Karma kullanım'],
    outputFields: ['interventions', 'spatialArrangements'],
    outputLabels: ['Planlama müdahaleleri', 'Mekansal düzenlemeler'],
  },
  {
    id: 6, title: 'Belediye Hizmet Bağlantısı',
    aiPrompt: 'Bu plan hangi belediye hizmetleriyle bağlantılı? Ulaşım, park ve bahçeler, sosyal hizmetler, zabıta, kent güvenliği? Kurumlar arası koordinasyon gerekli mi?',
    chips: ['Ulaşım', 'Park ve Bahçeler', 'Sosyal Hizmetler', 'Zabıta', 'Kent Güvenliği', 'Sağlık'],
    outputFields: ['responsibleUnits', 'serviceConnections'],
    outputLabels: ['Sorumlu birimler', 'Hizmet bağlantısı'],
  },
  {
    id: 7, title: 'Bütçe ve Uygulama',
    aiPrompt: 'Bu plan için yatırım gerekiyor mu? Hangi bütçe kalemlerinden finanse edilecek? Mevcut yatırım programında var mı?',
    chips: ['Mevcut bütçe yeterli', 'Yeni yatırım gerekli', 'AB fonu', 'Merkezi destek', 'Kısmi finansman'],
    outputFields: ['investmentNeeds', 'budgetConnection'],
    outputLabels: ['Yatırım ihtiyacı', 'Bütçe bağlantısı'],
  },
  {
    id: 8, title: 'Göstergeler ve İzleme',
    aiPrompt: 'Alanın kullanımını nasıl ölçeceksiniz? Kadın ve erkek kullanıcı sayısı ölçülebilir mi? Güvenlik algısı izlenebilir mi?',
    chips: ['Park kullanım oranı', 'Gece kullanım oranı', 'Kadın kullanıcı oranı', 'Toplu taşıma erişim süresi', 'Bakım kapasitesi'],
    outputFields: ['monitoringIndicators', 'dataNeeds'],
    outputLabels: ['İzleme göstergeleri', 'Veri ihtiyacı'],
  },
];

const URBAN_AREAS = [
  { id: 'transport', icon: '🚌', label: 'Ulaşım' },
  { id: 'public', icon: '🏛️', label: 'Kamusal Alan' },
  { id: 'park', icon: '🌳', label: 'Park ve Yeşil Alan' },
  { id: 'lighting', icon: '💡', label: 'Aydınlatma ve Güvenlik' },
  { id: 'social', icon: '🏥', label: 'Sosyal Hizmet Tesisleri' },
  { id: 'care', icon: '👶', label: 'Kreş / Bakım Hizmetleri' },
  { id: 'housing', icon: '🏘️', label: 'Konut Alanları' },
  { id: 'mixed', icon: '🏙️', label: 'Karma Kullanım' },
  { id: 'renewal', icon: '🔄', label: 'Kentsel Dönüşüm' },
  { id: 'new', icon: '🏗️', label: 'Yeni Yerleşim' },
];

function generatePolicyDraft(data, lang) {
  return `POLİTİKA TASLAĞI
================

1. BAĞLAM ANALİZİ
Sektör: ${data.sector || '-'}
Kurumsal Rol: ${data.institution_role || '-'}
Politika Türü: ${data.policy_type || '-'}
Stratejik Bağlantı: ${data.strategic_link || '-'}

2. SORUN ANALİZİ
Sorun Tanımı: ${data.problem_definition || '-'}
Etkilenen Gruplar: ${data.affected_groups || '-'}
Cinsiyet Açığı: ${data.gender_gap || '-'}
Veri Durumu: ${data.data_status || '-'}

3. HEDEF GRUP ANALİZİ
Birincil Hedef Grup: ${data.primary_target || '-'}
İkincil Hedef Grup: ${data.secondary_target || '-'}
Kırılgan Gruplar: ${data.vulnerable_groups || '-'}
Kesişen Eşitsizlikler: ${data.intersectionality || '-'}

4. EX-ANTE ETKİ ANALİZİ
Risk Seviyesi: ${data.risk_level || '-'} (Skor: ${data.impact_score ?? '-'})
Erişim Etkisi: ${data.impact_access || '-'}
Fayda Dağılımı: ${data.impact_benefit || '-'}
Katılım Etkisi: ${data.impact_participation || '-'}
Zaman/Bakım Etkisi: ${data.impact_time || '-'}
Güvenlik Etkisi: ${data.impact_safety || '-'}

5. POLİTİKA TASARIMI
Politika Amacı: ${data.policy_objective || '-'}
Beklenen Değişim: ${data.expected_change || '-'}

6. FAALİYET TASARIMI
Faaliyetler: ${data.activities || '-'}
Eşitlik Uyarlamaları: ${data.gender_adjustments || '-'}
Sorumlu Birimler: ${data.responsible_units || '-'}

7. BÜTÇE BAĞLANTISI
Bütçe Bağı: ${data.budget_link || '-'}
Kaynak Açığı: ${data.resource_gap || '-'}
Yararlanıcı Dağılımı: ${data.beneficiary_distribution || '-'}

8. GÖSTERGELER
Çıktı Göstergeleri: ${data.output_indicators || '-'}
Sonuç Göstergeleri: ${data.outcome_indicators || '-'}
Cinsiyet Ayrıştırması: ${data.sex_disaggregated || '-'}

9. RİSK VE ÖNERİLER
Riskler: ${data.risks || '-'}
Azaltma Önlemleri: ${data.mitigation_measures || '-'}
İyileştirme Önerileri: ${data.improvement_suggestions || '-'}

---
Bu taslak Eşitlik Asistanı tarafından oluşturulmuştur.
Tarih: ${new Date().toLocaleDateString('tr-TR')}`;
}

async function extractTextFromPDFForAnalysis(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const binary = e.target.result;
        const textBlocks = [];
        const regex = /\(([^)\\]*(\\.[^)\\]*)*)\)\s*T[jJ]/g;
        let match;
        while ((match = regex.exec(binary)) !== null) {
          const text = match[1]
            .replace(/\\n/g, " ")
            .replace(/\\r/g, " ")
            .replace(/\\t/g, " ")
            .replace(/\\\\/g, "\\")
            .replace(/\\[()]/g, (m) => m[1]);
          if (text.trim()) textBlocks.push(text);
        }
        resolve(textBlocks.join(" ").replace(/\s+/g, " ").trim());
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.readAsBinaryString(file);
  });
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EsitlikAsistani() {
  const [lang, setLang] = useState("tr");
  const [activeTabId, setActiveTabId] = useState("dashboard");
  const [role, setRole] = useState(null);
  const [activeNav, setActiveNav] = useState(null);
  const [policyStep, setPolicyStep] = useState(0);
  const [policyData, setPolicyData] = useState({
    sector: '', institution_role: '', policy_type: '', strategic_link: '',
    problem_definition: '', affected_groups: '', gender_gap: '', data_status: '',
    primary_target: '', secondary_target: '', vulnerable_groups: '', intersectionality: '',
    impact_access: '', impact_benefit: '', impact_participation: '', impact_time: '', impact_safety: '',
    impact_score: null, risk_level: '',
    policy_objective: '', expected_change: '',
    activities: '', gender_adjustments: '', responsible_units: '',
    budget_link: '', resource_gap: '', beneficiary_distribution: '',
    output_indicators: '', outcome_indicators: '', sex_disaggregated: '',
    risks: '', mitigation_measures: '', improvement_suggestions: '',
  });
  const [impactScores, setImpactScores] = useState({ access: 0, benefit: 0, participation: 0, time: 0, safety: 0 });
  const [policyInput, setPolicyInput] = useState('');
  const [policyMessages, setPolicyMessages] = useState([]);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [policyStarted, setPolicyStarted] = useState(false);
  const [urbanStep, setUrbanStep] = useState(0);
  const [urbanData, setUrbanData] = useState({
    planningArea: '', planType: '', planScale: '', planPurpose: '',
    urbanProblem: '', equalityDimension: '', currentSituation: '',
    userGroups: '', accessProblems: '', inequalityFindings: '',
    planningObjective: '', expectedChange: '',
    interventions: '', spatialArrangements: '',
    responsibleUnits: '', serviceConnections: '',
    investmentNeeds: '', budgetConnection: '',
    monitoringIndicators: '', dataNeeds: '',
  });
  const [urbanInput, setUrbanInput] = useState('');
  const [urbanMessages, setUrbanMessages] = useState([]);
  const [urbanLoading, setUrbanLoading] = useState(false);
  const [urbanStarted, setUrbanStarted] = useState(false);
  const [urbanArea, setUrbanArea] = useState(null);
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourceFilter, setResourceFilter] = useState('all');
  const [resourceSearch, setResourceSearch] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);

  const C = {
    background: "var(--bg)",
    surface: "var(--surface)",
    border: "var(--border)",
    primary: "var(--accent)",
    muted: "var(--text-secondary)",
    text: "var(--text-primary)",
    dim: "var(--text-secondary)",
    inputBg: "var(--surface)",
    userBubble: "var(--accent-soft)",
    userBubbleBorder: "var(--accent-border)",
    shadow: "var(--shadow)",
  };

  const L = LANG[lang];
  const currentTabs = useMemo(() => {
    return ROLE_TABS[lang]?.[role] || ROLE_TABS.tr.official;
  }, [lang, role]);
  const dashboardCards = useMemo(() => {
    const cardIds = DASHBOARD_CARDS[role] || DASHBOARD_CARDS.official;
    return currentTabs.filter(t => cardIds.includes(t.id));
  }, [currentTabs, role]);

  const handleRoleChange = () => {
    setRole(null);
    setActiveTabId("dashboard");
  };
  const navItems = lang === "tr"
    ? ["Ana Sayfa", "KEEDB Nedir?", "Nasıl Çalışır?", "Kaynaklar", "Rolünü Seç"]
    : ["Home", "What is GRB?", "How It Works?", "Resources", "Select Role"];
  const navContent = {
    "KEEDB Nedir?": `Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB), kamu politikaları ve bütçelerinin kadınların ve erkeklerin farklı ihtiyaç ve önceliklerini dikkate alacak şekilde planlanmasını sağlayan bir yaklaşımdır.

KEEDB, kamu kaynaklarının kadınlar ve erkekler üzerindeki etkilerini analiz etmeyi ve bütçe süreçlerinin eşitliği destekleyecek biçimde tasarlanmasını amaçlar. Bu yaklaşım sayesinde kamu hizmetlerinin herkes için daha erişilebilir, adil ve etkili olması hedeflenir.

Kadın Erkek Eşitliğine Duyarlı Bütçeleme aynı zamanda kamu yönetiminde şeffaflığı, hesap verebilirliği ve katılımcılığı güçlendiren önemli bir politika aracıdır.

KEEDB yaklaşımı:
- Kamu politikalarının eşitlik perspektifiyle geliştirilmesini,
- Kamu harcamalarının kadınlar ve erkekler üzerindeki etkilerinin analiz edilmesini,
- Bütçe süreçlerine eşitlik bakış açısının entegre edilmesini destekler.`,

    "Nasıl Çalışır?": `Bu platform, kamu kurumları, yerel yönetimler, akademisyenler ve sivil toplum kuruluşlarının Kadın Erkek Eşitliğine Duyarlı Bütçeleme yaklaşımını uygulamalarına yardımcı olmak amacıyla geliştirilmiştir.

Platform; politika geliştirme, bütçe analizi, izleme ve raporlama süreçlerinde kullanılabilecek rehberler, analiz araçları ve kontrol listeleri sunar.

Kullanıcılar platforma giriş yaptıklarında kendi rollerini seçerek ihtiyaçlarına uygun araçlara erişebilirler:
- Kamu görevlileri politika ve bütçe süreçlerini analiz edebilir,
- Yerel yönetimler hizmet ve bütçelerini eşitlik perspektifiyle değerlendirebilir,
- Akademisyenler veri ve analiz araçlarını kullanabilir,
- Sivil toplum kuruluşları bütçe ve politika süreçlerini izleyebilir.

Platform ayrıca kullanıcıların stratejik planlar, bütçeler veya raporlar gibi belgeleri analiz etmelerine ve eşitlik perspektifinden değerlendirme yapmalarına yardımcı olur.`,

    "What is GRB?": `Gender Responsive Budgeting (GRB) is an approach that ensures public policies and budgets take into account the different needs and priorities of women and men.

GRB analyzes how public resources affect women and men and aims to design budgeting processes that promote equality. Through this approach, public services can become more accessible, fair and effective for all members of society.

Gender Responsive Budgeting is also an important policy tool that strengthens transparency, accountability and participation in public financial management.

GRB supports:
- Developing public policies with an equality perspective,
- Analyzing the impact of public expenditures on women and men,
- Integrating equality considerations into planning and budgeting processes.`,

    "How It Works?": `This platform is designed to support public institutions, local governments, academics and civil society organizations in implementing Gender Responsive Budgeting (GRB).

The platform provides guidance, analytical tools and checklists that can be used in policy development, budget analysis, monitoring and reporting processes.

After entering the platform, users select their role and access tools tailored to their needs:
- Public officials can analyze policies and budgets,
- Local governments can evaluate services and municipal budgets from an equality perspective,
- Academics can access data and analytical resources,
- Civil society organizations can monitor policies and public budgets.

The platform also allows users to analyze documents such as strategic plans, budgets or reports and assess them from an equality perspective. By using these tools, institutions can develop more inclusive and equitable policies and budgets.`,
    "Kaynaklar": lang === 'tr'
      ? 'Kaynak dokümanlarına erişmek için lütfen rolünüzü seçerek platforma giriş yapın. Giriş yaptıktan sonra Kaynaklar sekmesinden tüm rehber, rapor ve araştırmalara ulaşabilirsiniz.'
      : 'Please select your role to access resource documents. After logging in, you can access all guides, reports and research from the Resources tab.',
    "Resources": lang === 'tr'
      ? 'Kaynak dokümanlarına erişmek için lütfen rolünüzü seçerek platforma giriş yapın. Giriş yaptıktan sonra Kaynaklar sekmesinden tüm rehber, rapor ve araştırmalara ulaşabilirsiniz.'
      : 'Please select your role to access resource documents. After logging in, you can access all guides, reports and research from the Resources tab.',
  };

  useEffect(() => {
    if (activeTabId === 'resources' && resources.length === 0) {
      setResourcesLoading(true);
      fetch('/api/admin/upload')
        .then(r => r.json())
        .then(data => {
          if (data.success) setResources(data.documents || []);
        })
        .catch(() => {})
        .finally(() => setResourcesLoading(false));
    }
  }, [activeTabId]);

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [activeQuick, setActiveQuick] = useState(null);
  const [openGroup, setOpenGroup] = useState(0);
  const endRef = useRef(null);
  const lastAssistantRef = useRef(null);
  const lastUserMsgRef = useRef(null);

  const [docText, setDocText] = useState("");
  const [pastedDocText, setPastedDocText] = useState("");
  const [docFileName, setDocFileName] = useState("");
  const [docFileChars, setDocFileChars] = useState(0);
  const [docDragActive, setDocDragActive] = useState(false);
  const [docResult, setDocResult] = useState("");
  const [docLoading, setDocLoading] = useState(false);
  const fileInputRef = useRef(null);

  const getExtension = (name = "") => {
    const parts = name.toLowerCase().split(".");
    return parts.length > 1 ? `.${parts.pop()}` : "";
  };

  const readTxtFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(String(ev.target?.result || ""));
    reader.onerror = () => reject(new Error("Failed to read text file."));
    reader.readAsText(file);
  });

  const extractDocText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleDocFileSelect = async (file) => {
    if (!file) return;
    const extension = getExtension(file.name);
    const supported = [".txt", ".pdf", ".doc", ".docx"];
    if (!supported.includes(extension)) return;

    setDocText("");
    setDocFileName(file.name);
    setDocFileChars(0);
    setDocLoading(true);
    setDocResult("");
    try {
      let extracted = "";
      if (file.type === "application/pdf" || extension === ".pdf") {
        extracted = await extractTextFromPDFForAnalysis(file);
        if (extracted && extracted.length > 50) {
          setDocText(extracted);
          setDocFileChars(extracted.length);
        } else {
          setDocText("");
          setDocFileChars(0);
          alert(lang === "tr"
            ? "PDF metni otomatik okunamadı. Lütfen metni aşağıdaki alana yapıştırın."
            : "Could not extract PDF text automatically. Please paste the text below.");
        }
        return;
      }

      if (extension === ".txt") extracted = await readTxtFile(file);
      if (extension === ".doc" || extension === ".docx") extracted = await extractDocText(file);
      setDocText(extracted);
      setDocFileChars(extracted.length);
    } catch (err) {
      setDocText("");
      setDocFileChars(0);
      if (file.type === "application/pdf" || extension === ".pdf") {
        alert(lang === "tr"
          ? "PDF metni otomatik okunamadı. Lütfen metni aşağıdaki alana yapıştırın."
          : "Could not extract PDF text automatically. Please paste the text below.");
      }
    } finally {
      setDocLoading(false);
    }
  };

  const clearDocInputs = () => {
    setDocText("");
    setPastedDocText("");
    setDocFileName("");
    setDocFileChars(0);
    setDocResult("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const analysisText = docText.trim().length > 50 ? docText : pastedDocText;
  const analysisWordCount = docText.split(" ").filter(Boolean).length;
  const isAnalyzeDisabled = docLoading || (docText.trim().length <= 50 && !pastedDocText.trim());

  const [phase, setPhase] = useState(0);
  const [sector, setSector] = useState(0);
  const [clResult, setClResult] = useState("");
  const [clLoading, setClLoading] = useState(false);

  const [rpForm, setRpForm] = useState({ institution: "", year: String(new Date().getFullYear()), sector: "", context: "" });
  const [rpResult, setRpResult] = useState("");
  const [rpLoading, setRpLoading] = useState(false);

  const sendChat = async (override, fromQuick = false) => {
    const text = override ?? chatInput;
    if (!text.trim() || chatLoading) return;
    if (fromQuick) setActiveQuick(text);
    else setActiveQuick(null);
    setChatInput("");
    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    requestAnimationFrame(() => {
      lastUserMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    const presetReply = getQuickPresetResponse(lang, text);
    if (presetReply) {
      setMessages([...newHistory, { role: "assistant", content: presetReply }]);
      requestAnimationFrame(() => {
        lastAssistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }

    setChatLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callClaude(text, buildSystemPrompt(lang, role), history, lang, role);
      setMessages([...newHistory, { role: "assistant", content: reply }]);
      requestAnimationFrame(() => {
        lastAssistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (error) {
      const msg = lang === "tr"
        ? `Üzgünüm, yanıt üretilirken bir hata oluştu: ${error.message}`
        : `Sorry, an error occurred while generating the response: ${error.message}`;
      setMessages([...newHistory, { role: "assistant", content: msg }]);
      requestAnimationFrame(() => {
        lastAssistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handlePolicySend = async () => {
    if (!policyInput.trim() || policyLoading) return;
    const userText = policyInput.trim();
    setPolicyInput('');
    const newMessages = [...policyMessages, { role: 'user', content: userText }];
    setPolicyMessages(newMessages);
    setPolicyLoading(true);

    const currentStep = POLICY_STEPS[policyStep];
    const nextStep = POLICY_STEPS[policyStep + 1];
    const updatedData = { ...policyData };
    if (currentStep?.outputFields?.[0]) {
      updatedData[currentStep.outputFields[0]] = userText;
    }

    // Add impact scores to data on step 4
    if (policyStep === 3) {
      const total = Object.values(impactScores).reduce((a, b) => a + b, 0);
      updatedData.impact_score = total;
      updatedData.risk_level = total > 0 ? 'Eşitlik destekleyici' : total < 0 ? 'Eşitsizlik artırabilir' : 'Nötr';
      updatedData.impact_access = impactScores.access > 0 ? 'Olumlu' : impactScores.access < 0 ? 'Olumsuz' : 'Nötr';
      updatedData.impact_benefit = impactScores.benefit > 0 ? 'Dengeli' : impactScores.benefit < 0 ? 'Eşitsiz' : 'Nötr';
      updatedData.impact_participation = impactScores.participation > 0 ? 'Eşit katılım' : impactScores.participation < 0 ? 'Katılım engeli' : 'Nötr';
      updatedData.impact_time = impactScores.time > 0 ? 'Bakım yükü azalır' : impactScores.time < 0 ? 'Bakım yükü artar' : 'Nötr';
      updatedData.impact_safety = impactScores.safety > 0 ? 'Güvenli' : impactScores.safety < 0 ? 'Risk var' : 'Nötr';
    }
    setPolicyData(updatedData);

    try {
      const total = Object.values(impactScores).reduce((a, b) => a + b, 0);
      const riskWarning = policyStep === 3 && total < 0
        ? ' ÖNEMLİ UYARI: Etki skoru negatif, politika eşitsizliği artırabilir. Mutlaka iyileştirme önerileri sun.'
        : '';

      const systemPrompt = `Sen Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) uzmanı bir politika tasarım asistanısın. Şu an ${currentStep?.title} modülündesin (${policyStep + 1}/9). Kullanıcının yanıtını kısaca değerlendir, ${nextStep ? nextStep.title + ' modülüne geç ve şu soruları sor: ' + nextStep.aiPrompt : 'tüm modüllerin tamamlandığını belirt, politika taslağı hazır olduğunu söyle.'}${riskWarning} Yanıtını kısa ve odaklı tut.`;

      const reply = await callClaude(userText, systemPrompt, newMessages.slice(-4), lang, role);
      setPolicyMessages([...newMessages, { role: 'assistant', content: reply }]);
      if (policyStep < 8) setPolicyStep(prev => prev + 1);
    } catch (error) {
      setPolicyMessages([...newMessages, { role: 'assistant', content: 'Bir hata oluştu: ' + error.message }]);
    } finally {
      setPolicyLoading(false);
    }
  };

  const handleUrbanSend = async () => {
    if (!urbanInput.trim() || urbanLoading) return;
    const userText = urbanInput.trim();
    setUrbanInput('');
    const newMessages = [...urbanMessages, { role: 'user', content: userText }];
    setUrbanMessages(newMessages);
    setUrbanLoading(true);
    const currentStep = URBAN_STEPS[urbanStep];
    const nextStep = URBAN_STEPS[urbanStep + 1];
    const updatedData = { ...urbanData };
    if (currentStep?.outputFields?.[0]) updatedData[currentStep.outputFields[0]] = userText;
    setUrbanData(updatedData);
    try {
      const systemPrompt = `Sen Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) uzmanı bir kentsel planlama asistanısın. Belediye çalışanlarına kentsel planlama kararlarını eşitlik perspektifiyle geliştirmeleri için yardım ediyorsun. Şu an ${currentStep?.title} adımındasın. Kullanıcının yanıtını kısa değerlendir (1-2 cümle), ardından ${nextStep ? nextStep.title + ' adımına geç: ' + nextStep.aiPrompt : 'planlama taslağının tamamlandığını belirt ve tebrik et.'}`;
      const reply = await callClaude(userText, systemPrompt, newMessages.slice(-4), lang, role);
      setUrbanMessages([...newMessages, { role: 'assistant', content: reply }]);
      if (urbanStep < 7) setUrbanStep(prev => prev + 1);
    } catch (error) {
      setUrbanMessages([...newMessages, { role: 'assistant', content: 'Bir hata oluştu: ' + error.message }]);
    } finally {
      setUrbanLoading(false);
    }
  };

  const lastAssistantIndex = [...messages].map((m) => m.role).lastIndexOf("assistant");
  const lastUserIndex = [...messages].map((m) => m.role).lastIndexOf("user");

  const quickGroups = lang === "tr" ? [
    {
      title: "KEEDB Nedir?",
      questions: ["KEEDB nedir ve neden önemlidir?", "KEEDB sadece kadınlara yönelik bir bütçe midir?"],
    },
    {
      title: "Araçlar & Uygulama",
      questions: ["KEEDB'nin temel araçları nelerdir?", "KEEDB hangi politika döngüsü aşamalarında uygulanabilir?", "KEEDB için hangi ilk adımları atabiliriz?", "Planları ve bütçeleri nasıl duyarlı hale getirebilirim?"],
    },
    {
      title: "Örnekler",
      questions: ["Dünya'dan başarılı örnekler paylaşır mısın?", "Türkiye'den başarılı bir örnek paylaşır mısın?"],
    },
  ] : [
    {
      title: "What is GRB?",
      questions: ["What is GRB and why does it matter?", "Is GRB only a budget for women?"],
    },
    {
      title: "Tools & Application",
      questions: ["What are the core tools of GRB?", "At which policy cycle stages can GRB be applied?", "What are the first steps we can take for GRB?", "How can I make plans and budgets gender-responsive?"],
    },
    {
      title: "Examples",
      questions: ["Can you share successful examples from around the world?", "Can you share a successful example from Turkey?"],
    },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    :root{--bg:#F8F9FA;--surface:#FFFFFF;--primary:#2563EB;--accent:#2563EB;--accent-soft:color-mix(in oklab,var(--accent) 10%, var(--surface));--text:#111827;--text-secondary:#6B7280;--border:#E5E7EB;--shadow:0 8px 24px rgba(15,23,42,.06);--role-gradient:linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);--role-gradient-active:linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)}
    @media (prefers-color-scheme: dark){:root{--bg:#0F172A;--surface:#1E293B;--primary:#3B82F6;--accent:#3B82F6;--accent-soft:color-mix(in oklab,var(--accent) 16%, var(--surface));--text:#F1F5F9;--text-secondary:#94A3B8;--border:#334155;--shadow:0 8px 24px rgba(2,6,23,.45);--role-gradient:linear-gradient(135deg, #2563EB 0%, #1e40af 100%);--role-gradient-active:linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)}}
    *{box-sizing:border-box}
    body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
    .app{min-height:100vh;color:var(--text)}
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
    .main-container{max-width:100%;margin:1.2rem auto;padding:16px}
    .card{width:100%}
    .header-top{display:flex;justify-content:space-between;align-items:center;gap:.6rem;flex-wrap:wrap}
    .header-brand{display:flex;gap:.7rem;align-items:center}
    .header-actions{display:flex;gap:.5rem}
    .app-title{font-size:1.15rem;font-weight:600}
    .app-subtitle{font-size:.8rem}
    .advisor-layout{padding:0;display:flex;flex-direction:row;height:calc(100vh - 160px);overflow:hidden}
    .advisor-quick-panel{width:280px;flex-shrink:0;border-right:1px solid var(--border);padding:1rem;position:sticky;top:0;align-self:flex-start}
    .advisor-quick-list{display:grid;grid-template-columns:1fr;gap:.5rem}
    .advisor-chat-panel{flex:1;min-width:0;min-height:0}
    .advisor-chat-messages{display:grid;gap:.75rem;background:var(--surface)}
    .advisor-input-row{display:flex;gap:.5rem}
    .quick-group{overflow:hidden;transition:max-height .3s ease,opacity .3s ease;opacity:0;max-height:0}
    .quick-group.open{opacity:1;max-height:360px}
    @media (max-width: 768px){
      .two-col{flex-direction:column !important}
      .sidebar{width:100% !important;max-height:280px;overflow-y:auto}
      .chat-panel{height:calc(100vh - 420px) !important}
      .card{border-radius:8px !important}
      .header-top{flex-direction:column;align-items:flex-start}
      .header-actions{width:100%;flex-direction:column}
      .header-actions .btn{width:100%}
      .app-title{font-size:1rem}
      .app-subtitle{font-size:.74rem}
      .advisor-quick-panel{position:static;border-right:none;border-bottom:1px solid var(--border)}
      .advisor-chat-messages{max-height:none}
    }
    @media (min-width: 1400px){
      .main-container{max-width:1300px !important}
    }
  `;

  const resultCard = (content) => content && <div className="surface fade" style={{ padding: "1rem 1.2rem" }}><MD text={content} /></div>;

  if (!role) return (
    <div className="app" suppressHydrationWarning={true} style={{ minHeight: "100vh", backgroundImage: `url(${bgImage.src})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <style>{css}</style>
      <div className="header" style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 600 }}>⚖</div>
          <div><div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{L.appTitle}</div><div className="muted" style={{ fontSize: ".85rem" }}>{L.appSubtitle}</div></div>
        </div>
        <button className="btn btn-ghost" onClick={() => setLang(l => l === "tr" ? "en" : "tr")}>{L.langToggle}</button>
      </div>
      <div className="header" style={{ display: "flex", padding: "0 1rem", gap: "0.25rem", overflowX: "auto" }}>
        {navItems.map((item, i) => (
          <button
            key={i}
            className="tab"
            onClick={() => {
              if (item === "Rolünü Seç" || item === "Select Role") {
                document.getElementById("role-selector")?.scrollIntoView({ behavior: "smooth" });
              } else {
                setActiveNav(activeNav === item ? null : item);
              }
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="main-container" style={{ marginTop: "2.5rem" }}>
        <div className="surface" style={{ padding: "1.4rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 600 }}>{L.roleSelect.title}</h1>
          <p className="muted" style={{ margin: ".4rem 0 1.3rem" }}>{L.roleSelect.subtitle}</p>
          <div id="role-selector" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "0.9rem" }}>
            {L.roleSelect.roles.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                style={{
                  background: role === r.id ? "var(--role-gradient-active)" : "var(--role-gradient)",
                  border: role === r.id ? "2px solid rgba(255,255,255,0.5)" : "none",
                  borderRadius: 16,
                  padding: "28px 24px",
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: role === r.id ? "0 14px 32px rgba(37,99,235,0.45), inset 0 0 0 1px rgba(255,255,255,0.2)" : "0 8px 24px rgba(37,99,235,0.35)",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                  display: "grid",
                  gap: "0.45rem",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = role === r.id
                    ? "0 14px 32px rgba(37,99,235,0.45), inset 0 0 0 1px rgba(255,255,255,0.2)"
                    : "0 14px 32px rgba(37,99,235,0.45)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = role === r.id
                    ? "0 14px 32px rgba(37,99,235,0.45), inset 0 0 0 1px rgba(255,255,255,0.2)"
                    : "0 8px 24px rgba(37,99,235,0.35)";
                }}
              >
                <div style={{ fontSize: "2em", lineHeight: 1 }}>{r.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "1.1em", color: "#fff" }}>{r.label}</div>
                <div style={{ fontSize: "0.82em", color: "rgba(255,255,255,0.75)" }}>{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {activeNav && navContent[activeNav] && (
        <div
          onClick={() => setActiveNav(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px"
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--surface)", borderRadius: 16, padding: "32px",
              maxWidth: 600, width: "100%", maxHeight: "80vh", overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "var(--accent)", fontSize: "1.3em" }}>{activeNav}</h2>
              <button onClick={() => setActiveNav(null)} style={{ background: "none", border: "none", fontSize: "1.5em", cursor: "pointer", color: "var(--text-secondary)" }}>×</button>
            </div>
            <div style={{ whiteSpace: "pre-line", lineHeight: 1.8, color: "var(--text-primary)" }}>
              {navContent[activeNav]}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app" suppressHydrationWarning={true} style={{ minHeight: "100vh", backgroundImage: `url(${bgImage.src})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <style>{css}</style>
      <div className="header" style={{ padding: "0.8rem 1.2rem" }}>
        <div className="header-top">
        <div className="header-brand">
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 600 }}>⚖</div>
          <div><div className="app-title">{L.appTitle}</div><div className="muted app-subtitle">{L.appSubtitle}</div></div>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={handleRoleChange}>{L.chat.changeRole}</button>
          <button className="btn btn-ghost" onClick={() => setLang(l => l === "tr" ? "en" : "tr")}>{L.langToggle}</button>
        </div>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid var(--border)", padding: "0 28px", background: "var(--surface)", display: "flex", overflowX: "auto" }}>
        {currentTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTabId(tab.id)}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
              padding: "13px 18px", fontSize: "0.95em", whiteSpace: "nowrap",
              color: activeTabId === tab.id ? "var(--primary)" : "var(--text-secondary)",
              borderBottom: activeTabId === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
              transition: "all .2s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="main-container" style={{ paddingBottom: "1.5rem" }}>
        {activeTabId === "dashboard" && (
          <div style={{ minHeight: "calc(100vh - 160px)", display: "flex", flexDirection: "column" }}>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.92) 0%, rgba(29,78,216,0.95) 100%)",
                borderRadius: 16,
                padding: "48px 32px",
                textAlign: "center",
                marginBottom: 24,
                color: "#ffffff",
                boxShadow: "0 8px 32px rgba(37,99,235,0.3)",
              }}
            >
              <div style={{ fontSize: "2.8rem", fontWeight: 700, marginBottom: 12, letterSpacing: "-0.5px" }}>
                {lang === "tr" ? "Hoş Geldiniz" : "Welcome"} {L.roleSelect.roles.find(r => r.id === role)?.icon}
              </div>
              <div style={{ fontSize: "1.15em", opacity: 0.9, marginBottom: 4 }}>
                {ROLE_LABELS[lang][role]}
              </div>
              <div style={{ fontSize: "1em", opacity: 0.75 }}>
                {lang === "tr" ? "Bugün ne yapmak istiyorsunuz?" : "What would you like to do today?"}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {dashboardCards.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTabId(tab.id)}
                  className="card"
                  style={{
                    padding: "28px 20px",
                    borderRadius: 14,
                    fontSize: "1em",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    cursor: "pointer",
                    border: `1px solid ${C.border}`,
                    background: "var(--surface)",
                    transition: "all .2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <span style={{ fontSize: "2em" }}>{TAB_ICONS[tab.id] || "📌"}</span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "1.05em" }}>{tab.label}</span>
                  <span style={{ fontSize: "0.82em", color: "var(--text-secondary)" }}>
                    {lang === "tr" ? "Buraya tıklayın →" : "Click to open →"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTabId === 'policy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: 'calc(100vh - 160px)', background: 'var(--surface)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>

            {/* Header */}
            <div style={{ background: 'var(--surface)', borderBottom: `1px solid ${C.border}`, padding: '16px 20px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                🏛️ Politika Tasarımı Asistanı
              </div>
              <div style={{ fontSize: '0.85em', color: C.muted, marginTop: 2 }}>
                Politika fikrinizi kadın erkek eşitliği perspektifiyle yapılandırın
              </div>
            </div>

            {/* Start screen */}
            {!policyStarted && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 32, background: 'var(--bg)' }}>
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{ fontSize: '2em', marginBottom: 12 }}>🏛️</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                      Politika Tasarımı Asistanı
                    </div>
                    <div style={{ color: C.muted, lineHeight: 1.7, fontSize: '0.95em' }}>
                      Politika fikrinizi <strong>9 adımda</strong> kadın erkek eşitliği perspektifiyle yapılandıracağım. Her adımda sorular soracağım, sağ panelde canlı taslak oluşacak. Sonunda indirilebilir bir politika belgesi hazır olacak.
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 32 }}>
                    {POLICY_STEPS.map((step, i) => (
                      <div key={step.id} style={{
                        padding: '12px 14px', borderRadius: 10,
                        background: 'var(--surface)', border: `1px solid ${C.border}`,
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)',
                          color: '#fff', fontSize: '0.75em', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>{i + 1}</div>
                        <div style={{ fontSize: '0.82em', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.3 }}>
                          {step.title}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <button className='btn-primary'
                      onClick={() => {
                        setPolicyMessages([{ role: 'assistant', content: `Politika tasarımına başlıyoruz! 🎯\n\n**Modül 1: Bağlam Analizi**\n\n${POLICY_STEPS[0].aiPrompt}` }]);
                        setPolicyStep(0);
                        setPolicyStarted(true);
                      }}
                      style={{ padding: '14px 48px', borderRadius: 12, fontSize: '1.05em', fontWeight: 600 }}>
                      Politika Tasarımına Başla →
                    </button>
                    <div style={{ fontSize: '0.8em', color: C.muted, marginTop: 10 }}>
                      Yaklaşık 15-20 dakika sürer • İstediğiniz adımda durabilirsiniz
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main chat + output panel */}
            {policyStarted && (
              <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

                {/* Left: Chat */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.border}`, minHeight: 0 }}>

                  {/* Progress bar */}
                  <div style={{ padding: '10px 16px', background: 'var(--surface)', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      {POLICY_STEPS.map((s, i) => (
                        <div key={s.id} title={s.title}
                          style={{
                            flex: 1, height: 4, borderRadius: 2, marginRight: i < 8 ? 3 : 0,
                            background: i < policyStep ? 'var(--accent)' : i === policyStep ? 'var(--accent)' : C.border,
                            opacity: i <= policyStep ? 1 : 0.4,
                          }} />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.78em', color: C.muted }}>
                      Adım {policyStep + 1}/9: <strong style={{ color: 'var(--text-primary)' }}>{POLICY_STEPS[policyStep]?.title}</strong>
                    </div>
                  </div>

                  {/* Messages */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {policyMessages.map((m, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        {m.role === 'assistant' && (
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginRight: 8, flexShrink: 0, marginTop: 3 }}>🏛</div>
                        )}
                        <div style={{
                          maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                          background: m.role === 'user' ? 'var(--accent-soft)' : 'var(--surface)',
                          border: `1px solid ${m.role === 'user' ? 'var(--accent-border)' : C.border}`,
                          fontSize: '0.92em', lineHeight: 1.65, whiteSpace: 'pre-wrap',
                        }}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {policyLoading && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🏛</div>
                        <span style={{ color: C.muted, fontStyle: 'italic', fontSize: '0.9em' }} className='pulse'>Yanıt hazırlanıyor…</span>
                      </div>
                    )}
                  </div>

                  {policyStep === 3 && (
                    <div style={{ padding: '10px 16px', background: 'var(--bg)', borderTop: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: '0.8em', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                        📊 Etki Skoru — Her boyutu değerlendirin:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[
                          { key: 'access', label: 'Erişim' },
                          { key: 'benefit', label: 'Fayda' },
                          { key: 'participation', label: 'Katılım' },
                          { key: 'time', label: 'Zaman/Bakım' },
                          { key: 'safety', label: 'Güvenlik' },
                        ].map(dim => (
                          <div key={dim.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: '0.8em', color: C.muted, width: 80 }}>{dim.label}:</span>
                            {[-1, 0, 1].map(score => (
                              <button key={score}
                                onClick={() => setImpactScores(prev => ({ ...prev, [dim.key]: score }))}
                                style={{
                                  width: 32, height: 28, borderRadius: 6, fontSize: '0.85em', cursor: 'pointer',
                                  border: `1px solid ${impactScores[dim.key] === score ? 'var(--accent)' : C.border}`,
                                  background: impactScores[dim.key] === score
                                    ? score > 0 ? '#22c55e' : score < 0 ? '#ef4444' : '#94a3b8'
                                    : 'var(--surface)',
                                  color: impactScores[dim.key] === score ? '#fff' : 'var(--text-secondary)',
                                }}>
                                {score > 0 ? '+' : score < 0 ? '−' : '○'}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                      {(() => {
                        const total = Object.values(impactScores).reduce((a, b) => a + b, 0);
                        const riskLevel = total > 0 ? '🟢 Eşitlik destekleyici' : total < 0 ? '🔴 Eşitsizlik artırabilir' : '🟡 Nötr';
                        return (
                          <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 8, background: 'var(--surface)', fontSize: '0.82em' }}>
                            Toplam skor: <strong>{total > 0 ? '+' : ''}{total}</strong> → {riskLevel}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Quick chips */}
                  {policyStep < 9 && POLICY_STEPS[policyStep]?.chips && (
                    <div style={{ padding: '8px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {POLICY_STEPS[policyStep].chips.map(chip => (
                        <button key={chip} onClick={() => setPolicyInput(prev => prev ? prev + ', ' + chip : chip)}
                          style={{
                            padding: '5px 12px', borderRadius: 16, fontSize: '0.82em', cursor: 'pointer',
                            border: `1px solid ${C.border}`, background: 'var(--surface)', color: 'var(--text-secondary)',
                            transition: 'all .2s',
                          }}>
                          + {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
                    <textarea
                      value={policyInput}
                      onChange={e => setPolicyInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePolicySend(); } }}
                      placeholder={policyStep < 9 ? `${POLICY_STEPS[policyStep]?.title} için yanıtınızı yazın...` : 'Ek notlarınızı yazın...'}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: 10, fontSize: '0.92em', resize: 'none', height: 56, lineHeight: 1.5, border: `1px solid ${C.border}`, background: 'var(--surface)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                    />
                    <button className='btn-primary' onClick={handlePolicySend} disabled={policyLoading || !policyInput.trim()}
                      style={{ padding: '0 16px', borderRadius: 10, fontSize: '0.9em' }}>
                      {policyStep < 8 ? 'İleri →' : 'Tamamla'}
                    </button>
                  </div>
                </div>

                {/* Right: Live output */}
                <div style={{ width: 340, flexShrink: 0, overflowY: 'auto', background: 'var(--surface)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: '0.9em', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    📄 Canlı Politika Taslağı
                  </div>
                  {POLICY_STEPS.map(step => (
                    step.outputFields.some(f => policyData[f]) && (
                      <div key={step.id}>
                        <div style={{ background: 'var(--bg)', border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
                          <div style={{ fontSize: '0.78em', fontWeight: 600, color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {step.title}
                          </div>
                          {step.outputFields.map((field, fi) => policyData[field] && (
                            <div key={field} style={{ marginBottom: 8 }}>
                              <div style={{ fontSize: '0.75em', color: C.muted, marginBottom: 2 }}>{step.outputLabels[fi]}</div>
                              <div style={{ fontSize: '0.88em', color: 'var(--text-primary)', lineHeight: 1.5 }}>{policyData[field]}</div>
                            </div>
                          ))}
                        </div>
                        {step.id === 4 && policyData.risk_level && (
                          <div style={{
                            padding: '10px 14px', borderRadius: 10, marginTop: 8,
                            background: policyData.impact_score > 0 ? '#dcfce7' : policyData.impact_score < 0 ? '#fee2e2' : '#fef9c3',
                            border: `1px solid ${policyData.impact_score > 0 ? '#22c55e' : policyData.impact_score < 0 ? '#ef4444' : '#eab308'}`,
                            fontSize: '0.85em', fontWeight: 600,
                          }}>
                            {policyData.impact_score > 0 ? '🟢' : policyData.impact_score < 0 ? '🔴' : '🟡'} Risk Seviyesi: {policyData.risk_level}
                            <br/>
                            <span style={{ fontWeight: 400, fontSize: '0.9em' }}>Toplam skor: {policyData.impact_score > 0 ? '+' : ''}{policyData.impact_score}</span>
                          </div>
                        )}
                      </div>
                    )
                  ))}
                  {!Object.values(policyData).some(v => v) && (
                    <div style={{ color: C.muted, fontSize: '0.85em', textAlign: 'center', marginTop: 20 }}>
                      Sorulara yanıt verdikçe taslak burada oluşacak...
                    </div>
                  )}
                  {policyStep >= 8 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                      <button className='btn-primary'
                        onClick={() => {
                          const draft = generatePolicyDraft(policyData, lang);
                          const blob = new Blob([draft], { type: 'text/plain;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url; a.download = 'politika_taslagi.txt'; a.click();
                        }}
                        style={{ padding: '10px', borderRadius: 10, fontSize: '0.88em' }}>
                        📥 Politika Taslağını İndir
                      </button>
                      <button className='btn-ghost'
                        onClick={() => {
                          const draft = generatePolicyDraft(policyData, lang);
                          navigator.clipboard.writeText(draft);
                          alert('Taslak panoya kopyalandı!');
                        }}
                        style={{ padding: '10px', borderRadius: 10, fontSize: '0.88em' }}>
                        📋 Panoya Kopyala
                      </button>
                      <button className='btn-ghost'
                        onClick={() => { setPolicyStep(0); setPolicyData({}); setPolicyMessages([]); setPolicyStarted(false); setPolicyMode(null); setImpactScores({ access: 0, benefit: 0, participation: 0, time: 0, safety: 0 }); }}
                        style={{ padding: '10px', borderRadius: 10, fontSize: '0.88em' }}>
                        🔄 Yeni Politika Başlat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTabId === 'resources' && (
          <div className='card' style={{ padding: 24, minHeight: 400, background: 'var(--surface)' }}>

            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                📚 {lang === 'tr' ? 'Kaynaklar ve Referans Dokümanlar' : 'Resources & Reference Documents'}
              </div>
              <div style={{ color: C.muted, fontSize: '0.9em' }}>
                {lang === 'tr' ? 'KEEDB çalışmalarında kullanılan rehberler, raporlar ve araştırmalar' : 'Guides, reports and research used in GRB work'}
              </div>
            </div>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <input
                value={resourceSearch}
                onChange={e => setResourceSearch(e.target.value)}
                placeholder={lang === 'tr' ? 'Dokümanda ara...' : 'Search documents...'}
                style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 10, fontSize: '0.9em', border: `1px solid ${C.border}`, background: 'var(--surface)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
              {['all', 'Rehber', 'Rapor', 'Araştırma', 'Politika'].map(cat => (
                <button key={cat}
                  onClick={() => setResourceFilter(cat)}
                  style={{
                    padding: '8px 14px', borderRadius: 20, fontSize: '0.85em', cursor: 'pointer', fontFamily: 'inherit',
                    border: `1px solid ${resourceFilter === cat ? 'var(--accent)' : C.border}`,
                    background: resourceFilter === cat ? 'var(--accent)' : 'var(--surface)',
                    color: resourceFilter === cat ? '#fff' : 'var(--text-secondary)',
                    transition: 'all .2s',
                  }}>
                  {cat === 'all' ? (lang === 'tr' ? 'Tümü' : 'All') : cat}
                </button>
              ))}
            </div>

            {/* Loading */}
            {resourcesLoading && (
              <div style={{ textAlign: 'center', padding: 40, color: C.muted }} className='pulse'>
                {lang === 'tr' ? 'Dokümanlar yükleniyor...' : 'Loading documents...'}
              </div>
            )}

            {/* Document list */}
            {!resourcesLoading && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {resources
                  .filter(doc => resourceFilter === 'all' || doc.category === resourceFilter)
                  .filter(doc => !resourceSearch || doc.title.toLowerCase().includes(resourceSearch.toLowerCase()))
                  .map(doc => (
                    <div key={doc.id}
                      onClick={() => setSelectedResource(selectedResource?.id === doc.id ? null : doc)}
                      style={{
                        border: `1px solid ${selectedResource?.id === doc.id ? 'var(--accent)' : C.border}`,
                        borderRadius: 12, padding: '16px', cursor: 'pointer',
                        background: selectedResource?.id === doc.id ? 'var(--accent-soft)' : 'var(--bg)',
                        transition: 'all .2s',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ fontSize: '1.8em', flexShrink: 0 }}>
                          {doc.category === 'Rehber' ? '📘' : doc.category === 'Rapor' ? '📊' : doc.category === 'Araştırma' ? '🔬' : '📄'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95em', marginBottom: 4, lineHeight: 1.4 }}>
                            {doc.title}
                          </div>
                          <div style={{ fontSize: '0.78em', color: C.muted }}>
                            {doc.category} • {doc.year} • {doc.chunk_count} bölüm
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
                {resources.length === 0 && !resourcesLoading && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: C.muted }}>
                    {lang === 'tr' ? 'Henüz doküman yüklenmemiş.' : 'No documents uploaded yet.'}
                  </div>
                )}
              </div>
            )}

            {/* Selected document detail */}
            {selectedResource && (
              <div style={{ marginTop: 20, border: `1px solid var(--accent)`, borderRadius: 12, padding: 20, background: 'var(--surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.05em', color: 'var(--text-primary)' }}>{selectedResource.title}</div>
                    <div style={{ fontSize: '0.82em', color: C.muted, marginTop: 2 }}>
                      {selectedResource.category} • {selectedResource.year} • {selectedResource.chunk_count} bölüm
                    </div>
                  </div>
                  <button onClick={() => setSelectedResource(null)}
                    style={{ background: 'none', border: 'none', fontSize: '1.3em', cursor: 'pointer', color: C.muted }}>×</button>
                </div>
                <button className='btn-primary'
                  onClick={() => {
                    setActiveTabId('chat');
                    setTimeout(() => sendChat(`${selectedResource.title} hakkında bilgi ver`), 100);
                  }}
                  style={{ padding: '9px 18px', borderRadius: 10, fontSize: '0.88em' }}>
                  💬 {lang === 'tr' ? 'Bu doküman hakkında soru sor' : 'Ask about this document'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTabId === 'urban' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: 'calc(100vh - 160px)', background: 'var(--surface)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>

            {/* Header */}
            <div style={{ background: 'var(--surface)', borderBottom: `1px solid ${C.border}`, padding: '16px 20px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                🏙️ Eşitlik Odaklı Kentsel Planlama Asistanı
              </div>
              <div style={{ fontSize: '0.85em', color: C.muted, marginTop: 2 }}>
                Kentsel planlama kararlarınızı kadın erkek eşitliği perspektifiyle değerlendirin
              </div>
            </div>

            {/* Start screen */}
            {!urbanStarted && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--bg)' }}>
                <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
                  <div style={{ fontSize: '1em', color: 'var(--text-primary)', marginBottom: 24, lineHeight: 1.7 }}>
                    Kentsel planlama kararlarınızı adım adım sorgularla eşitlik perspektifiyle değerlendireceğim. Sonunda belediye meclisi sunumuna hazır bir planlama taslağı oluşacak.
                  </div>
                  <div style={{ fontSize: '1em', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
                    Planlamak istediğiniz alanı seçin:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 28 }}>
                    {URBAN_AREAS.map(area => (
                      <button key={area.id} onClick={() => setUrbanArea(area.id)}
                        className='card'
                        style={{
                          padding: '16px 10px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                          border: `2px solid ${urbanArea === area.id ? 'var(--accent)' : C.border}`,
                          background: urbanArea === area.id ? 'var(--accent-soft)' : 'var(--surface)',
                          transition: 'all .2s',
                        }}>
                        <div style={{ fontSize: '1.8em', marginBottom: 6 }}>{area.icon}</div>
                        <div style={{ fontSize: '0.82em', fontWeight: 600, color: 'var(--text-primary)' }}>{area.label}</div>
                      </button>
                    ))}
                  </div>
                  <button className='btn-primary' disabled={!urbanArea}
                    onClick={() => {
                      const areaLabel = URBAN_AREAS.find(a => a.id === urbanArea)?.label;
                      setUrbanMessages([{ role: 'assistant', content: `${areaLabel} alanında kentsel planlama çalışmasına başlıyoruz. ${URBAN_STEPS[0].aiPrompt}` }]);
                      setUrbanStep(0);
                      setUrbanStarted(true);
                    }}
                    style={{ padding: '14px 40px', borderRadius: 12, fontSize: '1em' }}>
                    Başla →
                  </button>
                </div>
              </div>
            )}

            {/* Main chat + output */}
            {urbanStarted && (
              <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

                {/* Left: Chat */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.border}`, minHeight: 0 }}>

                  {/* Progress */}
                  <div style={{ padding: '10px 16px', background: 'var(--surface)', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                      {URBAN_STEPS.map((s, i) => (
                        <div key={s.id} title={s.title} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= urbanStep ? 'var(--accent)' : C.border, opacity: i <= urbanStep ? 1 : 0.4 }} />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.78em', color: C.muted }}>
                      Adım {urbanStep + 1}/8: <strong style={{ color: 'var(--text-primary)' }}>{URBAN_STEPS[urbanStep]?.title}</strong>
                    </div>
                  </div>

                  {/* Messages */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {urbanMessages.map((m, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        {m.role === 'assistant' && (
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginRight: 8, flexShrink: 0, marginTop: 3 }}>🏙</div>
                        )}
                        <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: m.role === 'user' ? 'var(--accent-soft)' : 'var(--surface)', border: `1px solid ${m.role === 'user' ? 'var(--accent-border)' : C.border}`, fontSize: '0.92em', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {urbanLoading && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🏙</div>
                        <span style={{ color: C.muted, fontStyle: 'italic', fontSize: '0.9em' }} className='pulse'>Yanıt hazırlanıyor…</span>
                      </div>
                    )}
                  </div>

                  {/* Chips */}
                  {urbanStep < 8 && URBAN_STEPS[urbanStep]?.chips && (
                    <div style={{ padding: '8px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {URBAN_STEPS[urbanStep].chips.map(chip => (
                        <button key={chip} onClick={() => setUrbanInput(prev => prev ? prev + ', ' + chip : chip)}
                          style={{ padding: '5px 12px', borderRadius: 16, fontSize: '0.82em', cursor: 'pointer', border: `1px solid ${C.border}`, background: 'var(--surface)', color: 'var(--text-secondary)', transition: 'all .2s' }}>
                          + {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
                    <textarea value={urbanInput} onChange={e => setUrbanInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUrbanSend(); } }}
                      placeholder={`${URBAN_STEPS[urbanStep]?.title} için yanıtınızı yazın...`}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: 10, fontSize: '0.92em', resize: 'none', height: 56, lineHeight: 1.5, border: `1px solid ${C.border}`, background: 'var(--surface)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                    <button className='btn-primary' onClick={handleUrbanSend} disabled={urbanLoading || !urbanInput.trim()}
                      style={{ padding: '0 16px', borderRadius: 10, fontSize: '0.9em' }}>
                      {urbanStep < 7 ? 'İleri →' : 'Tamamla'}
                    </button>
                  </div>
                </div>

                {/* Right: Live output */}
                <div style={{ width: 340, flexShrink: 0, overflowY: 'auto', background: 'var(--surface)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: '0.9em', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    🗺️ Kentsel Planlama Taslağı
                  </div>
                  {URBAN_STEPS.map(step => (
                    step.outputFields.some(f => urbanData[f]) && (
                      <div key={step.id} style={{ background: 'var(--bg)', border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
                        <div style={{ fontSize: '0.78em', fontWeight: 600, color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{step.title}</div>
                        {step.outputFields.map((field, fi) => urbanData[field] && (
                          <div key={field} style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: '0.75em', color: C.muted, marginBottom: 2 }}>{step.outputLabels[fi]}</div>
                            <div style={{ fontSize: '0.88em', color: 'var(--text-primary)', lineHeight: 1.5 }}>{urbanData[field]}</div>
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                  {!Object.values(urbanData).some(v => v) && (
                    <div style={{ color: C.muted, fontSize: '0.85em', textAlign: 'center', marginTop: 20 }}>
                      Sorulara yanıt verdikçe planlama taslağı burada oluşacak...
                    </div>
                  )}
                  {urbanStep >= 8 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                      <button className='btn-primary' style={{ padding: '10px', borderRadius: 10, fontSize: '0.88em' }}>📝 Plan Notu Üret</button>
                      <button className='btn-ghost' style={{ padding: '10px', borderRadius: 10, fontSize: '0.88em' }}>🏛️ Meclis Sunumu</button>
                      <button className='btn-ghost' style={{ padding: '10px', borderRadius: 10, fontSize: '0.88em' }}>📋 Proje Özeti</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {["service", "monitoring", "bestpractice", "data", "advocacy"].map((tabId) => (
          activeTabId === tabId && (
            <div key={tabId} className="card" style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: "3em", marginBottom: 16 }}>🚧</div>
              <div style={{ fontSize: "1.3em", fontWeight: 600, marginBottom: 8 }}>
                {currentTabs.find(t => t.id === tabId)?.label}
              </div>
              <div style={{ color: "var(--muted)" }}>
                {lang === "tr" ? "Bu bölüm yakında aktif olacak." : "This section is coming soon."}
              </div>
            </div>
          )
        ))}

        {activeTabId === "chat" && (
          <div className="surface advisor-layout two-col card">
            <div className="advisor-quick-panel sidebar">
              <div className="muted" style={{ fontSize: ".86rem", marginBottom: ".4rem", fontWeight: 500 }}>{L.chat.quickTitle}</div>
              <div className="advisor-quick-list">
                {quickGroups.map((group, i) => {
                  const isOpen = openGroup === i;
                  return (
                    <div key={group.title}>
                      <button
                        className="btn"
                        onClick={() => setOpenGroup(isOpen ? -1 : i)}
                        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--accent-soft)", borderRadius: 8, padding: "10px 14px", fontWeight: 600, border: "1px solid var(--border)", color: "var(--text)" }}
                      >
                        <span>{group.title}</span>
                        <span>{isOpen ? "▲" : "▼"}</span>
                      </button>
                      <div className={`quick-group ${isOpen ? "open" : ""}`}>
                        <div style={{ display: "grid", gap: ".5rem", marginTop: ".5rem" }}>
                          {group.questions.map((q, questionIndex) => (
                            <button key={questionIndex} className="chip" onClick={() => sendChat(q, true)} style={{ background: activeQuick === q ? "var(--accent)" : "var(--surface)", color: activeQuick === q ? "#ffffff" : "var(--text-secondary)", border: `1px solid ${activeQuick === q ? "var(--accent)" : "var(--border)"}`, fontWeight: activeQuick === q ? 600 : 400 }}>{q}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="advisor-chat-panel chat-panel">
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: 0,
              overflow: "hidden"
            }}>
              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                minHeight: 0
              }}>
                <div className="advisor-chat-messages">
                  {messages.map((m, i) => <div key={i} className="fade" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}><div ref={m.role === "assistant" && i === lastAssistantIndex ? lastAssistantRef : m.role === "user" && i === lastUserIndex ? lastUserMsgRef : null} className="surface" style={{ maxWidth: "82%", padding: "0.8rem 0.9rem", borderRadius: 10, background: m.role === "user" ? "color-mix(in oklab,var(--primary) 14%, var(--surface))" : "var(--surface)" }}>{m.role === "assistant" ? <MD text={m.content} /> : <p style={{ margin: 0 }}>{m.content}</p>}</div></div>)}
                  {chatLoading && <div ref={endRef} className="muted pulse">{L.chat.thinking}</div>}
                </div>
              </div>
              <div style={{
                flexShrink: 0,
                borderTop: "1px solid var(--border)",
                padding: "12px 16px",
                background: "var(--surface)",
                display: "flex",
                gap: 9
              }}>
                <textarea value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }} placeholder={L.chat.placeholder} style={{ height: 64, resize: "none" }} />
                <button className="btn btn-primary" onClick={() => sendChat()} disabled={chatLoading || !chatInput.trim()}>{L.chat.send}</button>
              </div>
            </div>
            </div>
          </div>
        )}

        {activeTabId === "doc" && (
          <div className="surface card" style={{ width: "100%", padding: "1rem", display: "grid", gap: "1rem" }}>
            <div><div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{L.docAnalysis.title}</div><div className="muted">{L.docAnalysis.subtitle}</div></div>
            <div>
              <div className="muted" style={{ fontWeight: 500, marginBottom: ".4rem" }}>{L.docAnalysis.uploadSection}</div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) await handleDocFileSelect(f);
                }}
              />
              <div
                role="button"
                tabIndex={0}
                style={{
                  border: `2px dashed ${docDragActive ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: 10,
                  padding: "1.2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: docDragActive ? "rgba(37,99,235,.06)" : "transparent",
                }}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDocDragActive(true);
                }}
                onDragLeave={() => setDocDragActive(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setDocDragActive(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) await handleDocFileSelect(f);
                }}
              >
                <div style={{ fontSize: "1.6rem" }}>📄</div><div>{L.docAnalysis.upload}</div><div className="muted" style={{ fontSize: ".85rem" }}>{L.docAnalysis.uploadHint}</div>
                {docFileName && (
                  <div className="muted" style={{ marginTop: ".5rem", fontSize: ".85rem" }}>
                    {L.docAnalysis.selectedFile}: <strong>{docFileName}</strong> • {docFileChars} {L.docAnalysis.charCount}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="muted" style={{ fontWeight: 500 }}>{L.docAnalysis.pasteSection}</div>
              <textarea value={pastedDocText} onChange={e => setPastedDocText(e.target.value)} placeholder={L.docAnalysis.pastePlaceholder} style={{ minHeight: 150 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
              <div className="muted" style={{ fontSize: ".85rem" }}>{L.docAnalysis.wordCount}: {analysisWordCount}</div>
              <button className="btn" onClick={clearDocInputs}>{L.docAnalysis.clear}</button>
            </div>
              <button className="btn btn-primary" onClick={async () => { setDocLoading(true); setDocResult(""); const r = await callClaude(buildDocPrompt(lang, analysisText), buildSystemPrompt(lang, role)); setDocResult(r); setDocLoading(false); }} disabled={isAnalyzeDisabled}>{docLoading ? L.docAnalysis.analyzing : L.docAnalysis.analyze}</button>
            {docLoading && <span className="muted pulse">{L.docAnalysis.analyzing}</span>}
            {resultCard(docResult)}
          </div>
        )}

        {activeTabId === "checklist" && (
          <div className="surface card" style={{ width: "100%", padding: "1rem", display: "grid", gap: "1rem" }}>
            <div><div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{L.checklist.title}</div><div className="muted">{L.checklist.subtitle}</div></div>
            {[{ label: L.checklist.phaseLabel, items: L.checklist.phases, val: phase, set: setPhase }, { label: L.checklist.sectorLabel, items: L.checklist.sectors, val: sector, set: setSector }].map(({ label, items, val, set }, idx) => (
              <div key={idx}><div className="muted" style={{ fontWeight: 500, marginBottom: ".4rem" }}>{label}</div><div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>{items.map((it, i) => <button key={i} className={`seg ${val === i ? "selected" : ""}`} onClick={() => set(i)} style={{ width: "auto" }}>{it}</button>)}</div></div>
            ))}
            <button className="btn btn-primary" onClick={() => {
              const phaseName = L.checklist.phases[phase];
              const sectorName = L.checklist.sectors[sector];
              const activePresets = lang === "en" ? CHECKLIST_PRESETS_EN : CHECKLIST_PRESETS;
              const preset = activePresets[L.checklist.phases[phase]]?.[L.checklist.sectors[sector]];
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

        {activeTabId === "report" && (
          <div className="surface card" style={{ width: "100%", padding: "1rem", display: "grid", gap: "1rem" }}>
            <div><div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{L.report.title}</div><div className="muted">{L.report.subtitle}</div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: ".75rem" }}>
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
