import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { umkmProfile } from "@/lib/data";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold font-headline">Profil UMKM</h1>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Usaha</CardTitle>
          <CardDescription>
            Lihat dan perbarui informasi mengenai usaha Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={umkmProfile.avatarUrl} alt={umkmProfile.name} data-ai-hint="logo" />
              <AvatarFallback>{umkmProfile.avatarFallback}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Ganti Foto</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="umkm-name">Nama Usaha</Label>
              <Input id="umkm-name" defaultValue={umkmProfile.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="owner-name">Nama Pemilik</Label>
              <Input id="owner-name" defaultValue={umkmProfile.owner} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={umkmProfile.email} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input id="phone" type="tel" defaultValue={umkmProfile.phone} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" defaultValue={umkmProfile.address} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Simpan Perubahan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
