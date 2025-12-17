import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { umkmProfile } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

export default function QrPaymentPage() {
  const qrImage = PlaceHolderImages.find(img => img.id === 'qr-code');

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl font-bold font-headline text-center">QR Pembayaran</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Tunjukkan QR Code ini kepada pelanggan Anda untuk menerima pembayaran digital secara instan.
      </p>
      
      <Card className="w-full max-w-sm shadow-lg overflow-hidden">
        <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-white rounded-lg border">
            {qrImage && (
              <Image
                src={qrImage.imageUrl}
                alt={qrImage.description}
                width={250}
                height={250}
                className="rounded-md"
                data-ai-hint={qrImage.imageHint}
              />
            )}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold font-headline">{umkmProfile.name}</h2>
            <p className="text-muted-foreground">{umkmProfile.owner}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-4">
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Unduh QR
        </Button>
        <Button variant="secondary">
          <Share2 className="mr-2 h-4 w-4" />
          Bagikan
        </Button>
      </div>
    </div>
  );
}
