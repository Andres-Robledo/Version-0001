'use client';

import { useState, useRef, useContext, useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { User, Building, Image as ImageIcon, Hash, Phone, MapPin, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserContext } from '@/context/user-context';
import { CompanyContext } from '@/context/company-context';

export default function SettingsPage() {
  const { user, setUser } = useContext(UserContext);
  const { 
    companyName, 
    companyLogo, 
    companyIcon, 
    address,
    nit,
    phone,
    city,
    setCompanyInfo 
  } = useContext(CompanyContext);
  const { toast } = useToast();
  
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [previewImage, setPreviewImage] = useState<string | null>(user.avatar);

  const [currentCompanyName, setCurrentCompanyName] = useState(companyName);
  const [currentAddress, setCurrentAddress] = useState(address);
  const [currentNit, setCurrentNit] = useState(nit);
  const [currentPhone, setCurrentPhone] = useState(phone);
  const [currentCity, setCurrentCity] = useState(city);
  const [previewLogo, setPreviewLogo] = useState<string | null>(companyLogo);
  const [previewIcon, setPreviewIcon] = useState<string | null>(companyIcon);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPreviewImage(user.avatar);
  }, [user]);

  useEffect(() => {
    setCurrentCompanyName(companyName);
    setPreviewLogo(companyLogo);
    setPreviewIcon(companyIcon);
    setCurrentAddress(address);
    setCurrentNit(nit);
    setCurrentPhone(phone);
    setCurrentCity(city);
  }, [companyName, companyLogo, companyIcon, address, nit, phone, city]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
    const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoUploadClick = () => {
    logoInputRef.current?.click();
  }
  
  const handleIconUploadClick = () => {
    iconInputRef.current?.click();
  }
  
  const handleSaveChanges = () => {
    setUser({
      name,
      email,
      avatar: previewImage || user.avatar,
    });
    setCompanyInfo({
        name: currentCompanyName,
        logo: previewLogo || companyLogo,
        icon: previewIcon || companyIcon,
        address: currentAddress,
        nit: currentNit,
        phone: currentPhone,
        city: currentCity,
    });
    toast({
      title: '¡Éxito!',
      description: 'Tus cambios han sido guardados correctamente.',
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Mi Perfil</h2>
        <p className="text-muted-foreground">
          Gestiona la configuración de tu cuenta y tus preferencias.
        </p>
      </div>
      <Separator />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
            <CardDescription>
              Actualiza los datos de tu empresa, el logo principal y el ícono.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre de la Empresa</Label>
              <Input id="companyName" value={currentCompanyName} onChange={(e) => setCurrentCompanyName(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyNit" className="flex items-center gap-2"><Hash />NIT</Label>
                  <Input id="companyNit" value={currentNit} onChange={(e) => setCurrentNit(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone" className="flex items-center gap-2"><Phone />Celular</Label>
                  <Input id="companyPhone" value={currentPhone} onChange={(e) => setCurrentPhone(e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyAddress" className="flex items-center gap-2"><MapPin />Dirección</Label>
                  <Input id="companyAddress" value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyCity" className="flex items-center gap-2"><Globe />Ciudad</Label>
                  <Input id="companyCity" value={currentCity} onChange={(e) => setCurrentCity(e.target.value)} />
                </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Logo (Expandido)</Label>
                    <div className="flex items-center gap-4">
                        {previewLogo ? (
                            <img src={previewLogo} alt="Company Logo" className="h-20 w-auto max-w-[200px] rounded-md object-contain border p-1" />
                        ) : (
                            <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted">
                                <Building className="h-10 w-10 text-muted-foreground" />
                            </div>
                        )}
                        <input
                            type="file"
                            ref={logoInputRef}
                            onChange={handleLogoChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif, image/svg+xml"
                        />
                        <Button variant="outline" onClick={handleLogoUploadClick}>Cambiar Logo</Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Ícono (Colapsado)</Label>
                    <div className="flex items-center gap-4">
                        {previewIcon ? (
                            <img src={previewIcon} alt="Company Icon" className="h-20 w-20 rounded-md object-contain border p-1" />
                        ) : (
                            <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted">
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            </div>
                        )}
                        <input
                            type="file"
                            ref={iconInputRef}
                            onChange={handleIconChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif, image/svg+xml"
                        />
                        <Button variant="outline" onClick={handleIconUploadClick}>Cambiar Ícono</Button>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Actualiza los datos de tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>
              Sube una nueva foto de perfil.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={previewImage || ''}
                alt="User avatar"
              />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />
            <Button variant="outline" onClick={handleUploadClick}>Cambiar Foto</Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
        </div>
      </div>
    </div>
  );
}
