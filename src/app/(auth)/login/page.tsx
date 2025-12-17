'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { useUser } from '@/firebase';
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await initiateEmailSignIn(auth, email, password);
      toast({
        title: 'Mencoba Masuk...',
        description: 'Silakan tunggu sebentar.',
      });
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
        toast({
          variant: 'destructive',
          title: 'Login Gagal',
          description: 'Email atau password yang Anda masukkan salah.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Oh tidak! Terjadi kesalahan.',
          description: 'Tidak dapat masuk. Silakan coba lagi nanti.',
        });
      }
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-sm w-full shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center items-center mb-4">
          <Logo className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline">
          Selamat Datang Kembali
        </CardTitle>
        <CardDescription>
          Masukkan email Anda untuk masuk ke akun UMKM Track
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@contoh.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Lupa password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Belum punya akun?{' '}
          <Link href="/register" className="underline">
            Daftar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
