export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  proof?: string;
};

export const transactions: Transaction[] = [
  { id: "1", date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), description: "Penjualan Kopi Susu", amount: 250000, type: "income", category: "Penjualan Produk" },
  { id: "2", date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), description: "Pembelian Biji Kopi", amount: 150000, type: "expense", category: "Bahan Baku" },
  { id: "3", date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), description: "Penjualan Croissant", amount: 180000, type: "income", category: "Penjualan Produk" },
  { id: "4", date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), description: "Bayar Listrik", amount: 200000, type: "expense", category: "Operasional" },
  { id: "5", date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), description: "Penjualan Merchandise", amount: 300000, type: "income", category: "Penjualan Lainnya" },
  { id: "6", date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), description: "Gaji Karyawan", amount: 1000000, type: "expense", category: "Gaji" },
  { id: "7", date: new Date().toISOString(), description: "Penjualan Kue Coklat", amount: 120000, type: "income", category: "Penjualan Produk" },
];

export const umkmProfile = {
  name: "Kopi Senja",
  owner: "Andi Pratama",
  email: "andi.pratama@kopisenja.com",
  phone: "081234567890",
  address: "Jl. Merdeka No. 17, Jakarta",
  avatarUrl: "https://picsum.photos/seed/kopi/200/200",
  avatarFallback: "KS",
};

export const monthlyReportData = [
  { month: "Jan", income: 4000, expense: 2400 },
  { month: "Feb", income: 3000, expense: 1398 },
  { month: "Mar", income: 2000, expense: 9800 },
  { month: "Apr", income: 2780, expense: 3908 },
  { month: "May", income: 1890, expense: 4800 },
  { month: "Jun", income: 2390, expense: 3800 },
  { month: "Jul", income: 3490, expense: 4300 },
];

export const dailyReportData = [
  { day: "Mon", income: 220, expense: 140 },
  { day: "Tue", income: 380, expense: 200 },
  { day: "Wed", income: 150, expense: 80 },
  { day: "Thu", income: 450, expense: 300 },
  { day: "Fri", income: 600, expense: 250 },
  { day: "Sat", income: 800, expense: 400 },
  { day: "Sun", income: 750, expense: 350 },
];
