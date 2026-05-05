
export const metadata = {
  title: 'PatureNews Studio',
  description: 'Kelola konten berita PatureNews secara mandiri.',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-white">
      {children}
    </div>
  );
}
