/**
 * Utilitas untuk memformat tanggal rilis sesuai standar jurnalisme PatureNews.
 */
export function formatReleaseDate(dateInput: any): string {
  if (!dateInput) return "";
  
  // Menangani objek Timestamp Firestore atau string ISO
  const date = dateInput?.toDate ? dateInput.toDate() : new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 0) return "baru saja";

  if (diffInSeconds < 60) return "baru saja";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;

  // Di atas satu minggu
  const day = date.getDate();
  const monthsArr = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const month = monthsArr[date.getMonth()];
  const year = date.getFullYear();
  const dateStr = `${day} ${month} ${year}`;

  const diffInMonths = Math.floor(diffInSeconds / (86400 * 30));
  const diffInYears = Math.floor(diffInSeconds / (86400 * 365));

  if (diffInYears >= 1) {
    return `${dateStr} - ${diffInYears} tahun yang lalu`;
  }
  if (diffInMonths >= 1) {
    return `${dateStr} - ${diffInMonths} bulan yang lalu`;
  }
  
  return dateStr;
}
