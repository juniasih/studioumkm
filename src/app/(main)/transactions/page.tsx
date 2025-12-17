'use client';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Transaction } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';


const TransactionRow = ({ transaction }: { transaction: Transaction }) => (
  <TableRow>
    <TableCell>
      <div className="font-medium">{transaction.description}</div>
      <div className="text-sm text-muted-foreground md:inline">
        {new Date(transaction.date).toLocaleDateString("id-ID", {
          day: 'numeric', month: 'long', year: 'numeric'
        })}
      </div>
    </TableCell>
    <TableCell className="hidden sm:table-cell">{transaction.category}</TableCell>
    <TableCell className="hidden sm:table-cell">
      <Badge
        className={transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
        variant="outline"
      >
        {transaction.type === "income" ? "Pemasukan" : "Pengeluaran"}
      </Badge>
    </TableCell>
    <TableCell
      className={`text-right font-semibold ${
        transaction.type === "income" ? "text-green-600" : "text-red-600"
      }`}
    >
      {transaction.type === "income" ? "+ " : "- "}
      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(transaction.amount)}
    </TableCell>
  </TableRow>
);

const TransactionTable = ({ transactions }: { transactions: Transaction[] }) => (
  <Card>
    <CardContent className="pt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="hidden sm:table-cell">Kategori</TableHead>
            <TableHead className="hidden sm:table-cell">Tipe</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => <TransactionRow key={t.id} transaction={t} />)}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default function TransactionsPage() {
    const { firestore, user } = useFirebase();

    const transactionsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
        collection(firestore, `users/${user.uid}/umkm_profiles/main/transactions`),
        orderBy('date', 'desc')
        );
    }, [firestore, user]);

    const { data: transactions, isLoading } = useCollection<Transaction>(transactionsQuery);

  const incomeTransactions = transactions?.filter((t) => t.type === "income") || [];
  const expenseTransactions = transactions?.filter((t) => t.type === "expense") || [];
  
  if (isLoading) {
      return <div>Loading transactions...</div>
  }

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-headline">Riwayat Transaksi</h1>
            <div className="flex gap-2">
                <Link href="/transactions/income/new">
                    <Button><Plus className="mr-2 h-4 w-4" /> Pemasukan</Button>
                </Link>
                <Link href="/transactions/expense/new">
                    <Button variant="secondary"><Minus className="mr-2 h-4 w-4" /> Pengeluaran</Button>
                </Link>
            </div>
        </div>
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="income">Pemasukan</TabsTrigger>
          <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TransactionTable transactions={transactions || []} />
        </TabsContent>
        <TabsContent value="income">
          <TransactionTable transactions={incomeTransactions} />
        </TabsContent>
        <TabsContent value="expense">
          <TransactionTable transactions={expenseTransactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
