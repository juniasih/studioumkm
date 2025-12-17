'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Line, LineChart } from "recharts";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Transaction } from '@/lib/data';
import { useMemo } from "react";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, getMonth, getYear, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

const chartConfig: ChartConfig = {
  income: {
    label: "Pemasukan",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Pengeluaran",
    color: "hsl(var(--chart-2))",
  },
};

export default function ReportsPage() {
  const { firestore, user } = useFirebase();

  const transactionsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, `users/${user.uid}/umkm_profiles/main/transactions`),
      orderBy('date', 'desc')
    );
  }, [firestore, user]);

  const { data: transactions, isLoading } = useCollection<Transaction>(transactionsQuery);

  const totalIncome = transactions?.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) || 0;
  const totalExpense = transactions?.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0) || 0;
  const netProfit = totalIncome - totalExpense;

  const monthlyReportData = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return last6Months.map(month => {
      const monthStr = format(month, 'MMM', { locale: localeID });
      const monthYear = getYear(month);
      
      const income = transactions
        ?.filter(t => t.type === 'income' && getMonth(new Date(t.date)) === getMonth(month) && getYear(new Date(t.date)) === monthYear)
        .reduce((acc, t) => acc + t.amount, 0) || 0;
        
      const expense = transactions
        ?.filter(t => t.type === 'expense' && getMonth(new Date(t.date)) === getMonth(month) && getYear(new Date(t.date)) === monthYear)
        .reduce((acc, t) => acc + t.amount, 0) || 0;

      return { month: monthStr, income, expense };
    });
  }, [transactions]);
  
  const dailyReportData = useMemo(() => {
    const today = new Date();
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: startOfThisWeek, end: endOfThisWeek });

    return daysInWeek.map(day => {
      const dayStr = format(day, 'EEE', { locale: localeID });

      const income = transactions
        ?.filter(t => t.type === 'income' && format(new Date(t.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
        .reduce((acc, t) => acc + t.amount, 0) || 0;

      const expense = transactions
        ?.filter(t => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
        .reduce((acc, t) => acc + t.amount, 0) || 0;

      return { day: dayStr, income, expense };
    });
  }, [transactions]);

  if (isLoading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold font-headline">Laporan Keuangan</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">Total sepanjang waktu</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalExpense)}</div>
            <p className="text-xs text-muted-foreground">Total sepanjang waktu</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keuntungan Bersih</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(netProfit)}</div>
            <p className="text-xs text-muted-foreground">Total sepanjang waktu</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">Bulanan</TabsTrigger>
          <TabsTrigger value="daily">Harian</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Laporan Bulanan</CardTitle>
              <CardDescription>Grafik pemasukan dan pengeluaran per bulan.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer>
                  <BarChart data={monthlyReportData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                    <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Laporan Harian</CardTitle>
              <CardDescription>Grafik pemasukan dan pengeluaran minggu ini.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                 <ResponsiveContainer>
                    <LineChart data={dailyReportData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} />
                        <Line type="monotone" dataKey="expense" stroke="var(--color-expense)" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
