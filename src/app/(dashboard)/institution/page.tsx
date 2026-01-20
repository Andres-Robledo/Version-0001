'use client';

import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { CompanyContext } from '@/context/company-context';
import { 
    Building, 
    Edit, 
    Hash,
    MapPin,
    Phone,
    Globe
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold">{value || 'N/A'}</p>
            </div>
        </div>
    )
}


export default function InstitutionPage() {
  const { 
      companyName, 
      companyLogo,
      address,
      nit,
      phone,
      city,
    } = useContext(CompanyContext);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Institución</h2>
        <Button asChild>
            <Link href="/settings">
                <Edit className="mr-2 h-4 w-4" />
                Editar Información
            </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 md:p-10 flex flex-col items-center">
            <div className="mb-6">
                {companyLogo ? (
                  <Image
                    src={companyLogo}
                    alt={`Logo de ${companyName}`}
                    width={300}
                    height={100}
                    className="object-contain"
                    priority
                  />
                ) : (
                    <div className="flex h-24 w-72 items-center justify-center rounded-md border bg-muted">
                        <Building className="h-16 w-16 text-muted-foreground" />
                    </div>
                )}
            </div>
            <CardTitle className="text-4xl font-bold text-center">{companyName}</CardTitle>
            <CardDescription className="mt-2 text-center max-w-md">
              Información general y de contacto de la empresa.
            </CardDescription>

            <Separator className="my-8" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8 w-full">
              <InfoItem icon={Hash} label="NIT" value={nit} />
              <InfoItem icon={Phone} label="Celular" value={phone} />
              <InfoItem icon={MapPin} label="Dirección" value={address} />
              <InfoItem icon={Globe} label="Ciudad" value={city} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
