export const metadata = {
  title: "Eşitlik Asistanı",
  description: "Kadın Erkek Eşitliğine Duyarlı Bütçeleme Destek Sistemi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
