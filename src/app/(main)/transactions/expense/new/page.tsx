"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from 'firebase/firestore';
import { useRouter } from "next/navigation";


export default function NewExpensePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const { toast } = useToast();
  const { firestore, user } = useFirebase();
  const router = useRouter();


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    if (!category) {
        toast({ variant: 'destructive', title: 'Error', description: 'Silakan pilih kategori.' });
        return;
    }

    const expenseData = {
        umkmId: 'main',
        date: date?.toISOString() || new Date().toISOString(),
        amount: Number(amount),
        description,
        category,
        type: 'expense'
    };
    
    const collectionRef = collection(firestore, `users/${user.uid}/umkm_profiles/main/transactions`);
    addDocumentNonBlocking(collectionRef, expenseData);

    toast({
      title: "Sukses!",
      description: "Pencatatan pengeluaran baru berhasil disimpan.",
      className: "bg-green-100 text-green-800 border-green-200",
    });
    router.push('/transactions');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/transactions">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <CardTitle className="font-headline text-2xl">Catat Pengeluaran</CardTitle>
              <CardDescription>
                Masukkan detail pengeluaran baru Anda.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Jumlah (IDR)</Label>
              <Input id="amount" type="number" placeholder="150000" required value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Tanggal Transaksi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Contoh: Pembelian 5kg Biji Kopi Robusta"
              value={description} 
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Kategori</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori pengeluaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bahan Baku">Bahan Baku</SelectItem>
                <SelectItem value="Gaji Karyawan">Gaji Karyawan</SelectItem>
                <SelectItem value="Operasional">Operasional (Listrik, Air)</SelectItem>
                <SelectItem value="Pemasaran">Pemasaran</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Simpan Pengeluaran
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
