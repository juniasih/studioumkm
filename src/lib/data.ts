
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
