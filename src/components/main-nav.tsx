"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  QrCode,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons";
import { useAuth } from "@/firebase";
import { initiateSignOut } from "@/firebase/non-blocking-login";
import { Button } from "./ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: ArrowLeftRight, label: "Transaksi" },
  { href: "/reports", icon: BarChart3, label: "Laporan" },
  { href: "/payment/qr", icon: QrCode, label: "QR Pembayaran" },
  { href: "/profile", icon: UserCircle, label: "Profil UMKM" },
];

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    initiateSignOut(auth).then(() => {
      router.push('/login');
    });
  };


  return (
    <nav className={cn("flex flex-col h-full", className)}>
      <div className="flex h-16 items-center px-4 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo className="h-7 w-7 text-primary" />
          <span className="font-headline text-lg">UMKM Track</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <div className="flex flex-col gap-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:text-foreground hover:bg-accent",
                (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))) &&
                  "bg-accent text-foreground font-semibold"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4 border-t border-border/50">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="flex w-full justify-start items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:text-foreground hover:bg-accent"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </nav>
  );
}
