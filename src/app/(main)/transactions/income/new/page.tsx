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
import { Calendar as CalendarIcon, Upload, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function NewIncomePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Sukses!",
      description: "Pencatatan pemasukan baru berhasil disimpan.",
      className: "bg-green-100 text-green-800 border-green-200",
    });
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
              <CardTitle className="font-headline text-2xl">Catat Pemasukan</CardTitle>
              <CardDescription>
                Masukkan detail pemasukan baru Anda.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Jumlah (IDR)</Label>
              <Input id="amount" type="number" placeholder="500000" required />
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
              placeholder="Contoh: Penjualan 10x Kopi Susu Gula Aren"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Kategori</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori pemasukan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="penjualan-produk">Penjualan Produk</SelectItem>
                <SelectItem value="penjualan-jasa">Penjualan Jasa</SelectItem>
                <SelectItem value="penjualan-lainnya">Penjualan Lainnya</SelectItem>
                <SelectItem value="modal">Modal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="proof">Upload Bukti Pembayaran (Opsional)</Label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Klik untuk upload</span> atau seret file</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, atau PDF</p>
                  </div>
                  <Input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div> 
          </div>
          <Button type="submit" className="w-full">
            Simpan Pemasukan
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
