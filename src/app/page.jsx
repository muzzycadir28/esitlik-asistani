"use client";
import { useState, useRef } from "react";
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
      { id: "dashboard", label: "Dashboard" },
      { id: "chat", label: "Danışman" },
      { id: "policy", label: "Politika Tasarımı" },
      { id: "doc", label: "Belge Analizi" },
      { id: "checklist", label: "Rehber & Kontrol" },
      { id: "report", label: "Rapor Oluştur" },
      { id: "resources", label: "Kaynaklar" },
    ],
    local: [
      { id: "dashboard", label: "Dashboard" },
      { id: "chat", label: "Danışman" },
      { id: "doc", label: "Belge Analizi" },
      { id: "checklist", label: "Rehber & Kontrol" },
      { id: "report", label: "Rapor Oluştur" },
      { id: "resources", label: "Kaynaklar" },
    ],
    academic: [
      { id: "dashboard", label: "Dashboard" },
      { id: "chat", label: "Danışman" },
      { id: "doc", label: "Belge Analizi" },
      { id: "checklist", label: "Rehber & Kontrol" },
      { id: "resources", label: "Kaynaklar" },
    ],
    ngo: [
      { id: "dashboard", label: "Dashboard" },
      { id: "chat", label: "Danışman" },
      { id: "doc", label: "Belge Analizi" },
      { id: "checklist", label: "Rehber & Kontrol" },
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
      { id: "doc", label: "Document Analysis" },
      { id: "checklist", label: "Guide & Checklist" },
      { id: "report", label: "Generate Report" },
      { id: "resources", label: "Resources" },
    ],
    academic: [
      { id: "dashboard", label: "Dashboard" },
      { id: "chat", label: "Advisor" },
      { id: "doc", label: "Document Analysis" },
      { id: "checklist", label: "Guide & Checklist" },
      { id: "resources", label: "Resources" },
    ],
    ngo: [
      { id: "dashboard", label: "Dashboard" },
      { id: "chat", label: "Advisor" },
      { id: "doc", label: "Document Analysis" },
      { id: "checklist", label: "Guide & Checklist" },
      { id: "resources", label: "Resources" },
    ],
  },
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EsitlikAsistani() {
  const [lang, setLang] = useState("tr");
  const [activeTabId, setActiveTabId] = useState("dashboard");
  const [role, setRole] = useState(null);
  const [activeNav, setActiveNav] = useState(null);
  const L = LANG[lang];
  const currentTabs = ROLE_TABS[lang]?.[role] || ROLE_TABS.tr.official;

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
  };

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

  const extractPdfText = async (file) => {
    return extractTextFromPdf(file);
  };

  const extractDocText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleDocFile = async (file) => {
    if (!file) return;
    const extension = getExtension(file.name);
    const supported = [".txt", ".pdf", ".doc", ".docx"];
    if (!supported.includes(extension)) return;

    setDocLoading(true);
    setDocResult("");
    try {
      let extracted = "";
      if (extension === ".txt") extracted = await readTxtFile(file);
      if (extension === ".pdf") extracted = await extractPdfText(file);
      if (extension === ".doc" || extension === ".docx") extracted = await extractDocText(file);
      setDocText(extracted);
      setDocFileName(file.name);
      setDocFileChars(extracted.length);
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

  const analysisText = docText.trim() ? docText : pastedDocText;
  const analysisWordCount = analysisText.trim() ? analysisText.trim().split(/\s+/).length : 0;

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
    <div className="app" suppressHydrationWarning style={{ minHeight: "100vh", backgroundImage: `url(${bgImage.src})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
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
    <div className="app" suppressHydrationWarning style={{ minHeight: "100vh", backgroundImage: `url(${bgImage.src})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
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
          <div className="card" style={{ padding: 32 }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
              {lang === "tr" ? "Hoş Geldiniz" : "Welcome"} {L.roleSelect.roles.find(r => r.id === role)?.icon}
            </div>
            <div style={{ color: "var(--muted)", marginBottom: 32, fontSize: "0.95em" }}>
              {lang === "tr" ? "Bugün ne yapmak istiyorsunuz?" : "What would you like to do today?"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {currentTabs.filter(t => t.id !== "dashboard").map((tab) => (
                <button key={tab.id} onClick={() => setActiveTabId(tab.id)}
                  className="btn-primary"
                  style={{ padding: "20px 16px", borderRadius: 12, fontSize: "1em", textAlign: "left",
                    display: "flex", flexDirection: "column", gap: 8, cursor: "pointer" }}>
                  <span style={{ fontSize: "1.4em" }}>
                    {tab.id === "chat" ? "💬" : tab.id === "policy" ? "📋" : tab.id === "doc" ? "📄" : tab.id === "checklist" ? "✅" : tab.id === "report" ? "📊" : "📚"}
                  </span>
                  <span style={{ fontWeight: 600 }}>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTabId === "policy" && (
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: "3em", marginBottom: 16 }}>🚧</div>
            <div style={{ fontSize: "1.3em", fontWeight: 600, marginBottom: 8 }}>
              {lang === "tr" ? "Politika Tasarımı" : "Policy Design"}
            </div>
            <div style={{ color: "var(--muted)" }}>
              {lang === "tr" ? "Bu bölüm yakında aktif olacak." : "This section is coming soon."}
            </div>
          </div>
        )}

        {activeTabId === "resources" && (
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: "3em", marginBottom: 16 }}>📚</div>
            <div style={{ fontSize: "1.3em", fontWeight: 600, marginBottom: 8 }}>
              {lang === "tr" ? "Kaynaklar" : "Resources"}
            </div>
            <div style={{ color: "var(--muted)" }}>
              {lang === "tr" ? "Bu bölüm yakında aktif olacak." : "This section is coming soon."}
            </div>
          </div>
        )}

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
                  if (f) await handleDocFile(f);
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
                  if (f) await handleDocFile(f);
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
              <button className="btn btn-primary" onClick={async () => { setDocLoading(true); setDocResult(""); const r = await callClaude(buildDocPrompt(lang, analysisText), buildSystemPrompt(lang, role)); setDocResult(r); setDocLoading(false); }} disabled={docLoading || !analysisText.trim()}>{docLoading ? L.docAnalysis.analyzing : L.docAnalysis.analyze}</button>
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
