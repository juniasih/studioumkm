
export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  proof?: string;
  umkmId: string;
};

export type UmkmProfile = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  website?: string;
  owner?:string; // Should be in User, but for simplicity
  avatarUrl?: string;
  avatarFallback?: string;
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
