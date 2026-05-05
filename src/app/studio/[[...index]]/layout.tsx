
export const metadata = {
  title: 'InfoFlow Studio',
  description: 'Kelola konten berita InfoFlow',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-white">
      {/* 
        PENTING: Kita menggunakan fixed inset-0 untuk memastikan Studio 
        menutupi seluruh layar dan tidak terpengaruh oleh Navbar/Footer utama.
      */}
      {children}
    </div>
  );
}
