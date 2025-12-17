'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UmkmProfile } from '@/lib/data';
import { useEffect, useState } from 'react';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';

export default function ProfilePage() {
  const { firestore, user, auth } = useFirebase();
  const { toast } = useToast();

  const umkmProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/umkm_profiles/main`);
  }, [firestore, user]);

  const { data: umkmProfile, isLoading } = useDoc<UmkmProfile>(umkmProfileRef);

  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (umkmProfile) {
      setName(umkmProfile.name || '');
      setOwnerName(user?.displayName || '');
      setEmail(umkmProfile.email || user?.email || '');
      setPhone(umkmProfile.contactNumber || '');
      setAddress(umkmProfile.address || '');
    } else if (user) {
        // Pre-fill from user object if profile doesn't exist
        setOwnerName(user.displayName || '');
        setEmail(user.email || '');
    }
  }, [umkmProfile, user]);

  const handleSaveChanges = () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    
    // Update user profile in Auth
    updateProfile(user, { displayName: ownerName }).catch(error => {
         toast({ variant: 'destructive', title: 'Error updating name', description: error.message });
    });

    // Create or update UMKM profile in Firestore
    const profileData = {
      name,
      userId: user.uid,
      email,
      contactNumber: phone,
      address,
      id: 'main'
    };
    
    if (umkmProfileRef){
        setDocumentNonBlocking(umkmProfileRef, profileData, { merge: true });
        toast({ title: 'Sukses', description: 'Profil berhasil diperbarui.' });
    }
  };
  
  if (isLoading) {
      return <div>Loading profile...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold font-headline">Profil UMKM</h1>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Usaha</CardTitle>
          <CardDescription>
            Lengkapi atau perbarui informasi mengenai usaha Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL || ''} alt={name} data-ai-hint="logo" />
              <AvatarFallback>{name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Ganti Foto</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="umkm-name">Nama Usaha</Label>
              <Input id="umkm-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kopi Senja"/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="owner-name">Nama Pemilik</Label>
              <Input id="owner-name" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveChanges}>Simpan Perubahan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
