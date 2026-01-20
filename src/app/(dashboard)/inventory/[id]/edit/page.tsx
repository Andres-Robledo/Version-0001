'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
    ChevronLeft, 
    Pencil, 
    Calendar,
    Tag,
    MapPin,
    Barcode,
    Building,
    Cpu,
    Puzzle,
    FileText,
    DollarSign,
    ShieldCheck,
    Building2,
    History,
    Package,
    Info,
    Users,
    Ship,
    Truck,
    Wrench,
    CheckSquare,
    AlertTriangle as AlertTriangleIcon,
    Clock,
    Zap,
    Wind,
    Droplets,
    PlusCircle,
    Trash2,
    SlidersHorizontal,
    HardDrive,
    Briefcase,
    Server,
    CheckCircle,
    XCircle,
    Upload,
} from 'lucide-react';
import { useState, useRef, useEffect, useContext } from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EquipmentContext } from '@/context/equipment-context';
import type { Equipment, Supply, Characteristic, Accessory } from '@/context/equipment-context';
import { ImageEditorDialog } from '../../components/image-editor';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';


const technologyOptions = [
    'Eléctrica', 'Mecánica', 'Electrónica', 'Hidráulica', 'Neumática', 'Software'
];

const supplyOptions = [
    'Agua', 'Oxígeno', 'Vacío', 'Electricidad', 'Vapor', 'Refrigerante', 'Aire', 'Aceite', 'Otro'
];

const characteristicOptions = [
    'Peso', 'Velocidad', 'Humedad', 'Temperatura', 'Dimensiones', 'Capacidad', 'Otro'
];

export default function EquipmentEditPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { equipmentList, updateEquipment, isLoading: isEquipmentLoading } = useContext(EquipmentContext);
  
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEquipmentLoading) {
      const equipmentData = equipmentList.find((e) => e.id === params.id);
      if (equipmentData) {
          setEquipment({
            ...equipmentData,
            brand: equipmentData.brand || '',
            price: typeof equipmentData.price === 'string' 
              ? { amount: (equipmentData.price as string).replace(/[^0-9]/g, ''), currency: 'COP' } 
              : (equipmentData.price || { amount: '', currency: 'COP' }),
            predominantTechnologies: Array.isArray(equipmentData.predominantTechnologies) ? equipmentData.predominantTechnologies : (typeof equipmentData.predominantTechnologies === 'string' ? [equipmentData.predominantTechnologies] : []),
            supplies: Array.isArray(equipmentData.supplies) ? equipmentData.supplies : [],
            otherCharacteristics: Array.isArray(equipmentData.otherCharacteristics) ? equipmentData.otherCharacteristics : [],
            accessories: Array.isArray(equipmentData.accessories) 
                ? equipmentData.accessories.map(acc => typeof acc === 'string' ? { name: acc, observation: '' } : acc) 
                : (typeof equipmentData.accessories === 'string' ? [{ name: equipmentData.accessories, observation: '' }] : []),
          });
          setImagePreview(equipmentData.imageUrl);
          setIsLoading(false);
      } else {
          notFound();
      }
    }
  }, [params.id, equipmentList, isEquipmentLoading]);


  if (isLoading || isEquipmentLoading || !equipment) {
    return <div>Cargando...</div>;
  }


  const handleCancel = () => {
    router.back();
  };
  
  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (equipment) {
        // Before saving, replace 'Otro' with the custom value if it exists
        const processedEquipment = {
            ...equipment,
            supplies: equipment.supplies.map(s => s.name === 'Otro' ? { ...s, name: s.otherName || 'Otro' } : s),
            otherCharacteristics: equipment.otherCharacteristics.map(c => c.name === 'Otro' ? { ...c, name: c.otherName || 'Otro' } : c),
        };
        updateEquipment(equipment.id, processedEquipment);
        toast({
            title: "¡Guardado!",
            description: `Los cambios para ${equipment.name} han sido guardados.`
        });
        router.push(`/inventory/${equipment.id}`);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEquipment(prev => prev ? { ...prev, [id]: value } : null);
  };
  
  const handlePriceChange = (field: 'amount' | 'currency', value: string) => {
    if (!equipment) return;
    setEquipment(prev => ({
      ...prev!,
      price: {
        ...prev!.price,
        [field]: value,
      }
    }));
  };

  const handleTechParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (!equipment) return;
    setEquipment(prev => ({
        ...prev!,
        technicalParameters: {
            ...prev!.technicalParameters,
            [id]: value
        }
    }));
  };
  
   const handleSelectChange = (id: string, value: string) => {
    setEquipment(prev => prev ? { ...prev, [id]: value } : null);
  };

  const handleCheckboxChange = (id: keyof Equipment['requiredDocumentation'], checked: boolean) => {
    setEquipment(prev => {
        if (!prev) return null;
        const newDocStatus = {
            ...prev.requiredDocumentation,
            [id]: checked,
        };
        return {
            ...prev,
            requiredDocumentation: newDocStatus,
        };
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setEquipment(prev => prev ? { ...prev, imageUrl: result } : null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageSettingsSave = (settings: { zoom: number; positionX: number; positionY: number }) => {
    setEquipment(prev => prev ? {
        ...prev,
        imageZoom: settings.zoom,
        imagePositionX: settings.positionX,
        imagePositionY: settings.positionY,
    } : null);
  };
  
  const handleTechnologyChange = (technology: string) => {
    setEquipment(prev => {
        if (!prev) return null;
        const currentTechs = prev.predominantTechnologies || [];
        const newTechs = currentTechs.includes(technology)
            ? currentTechs.filter(t => t !== technology)
            : [...currentTechs, technology];
        return { ...prev, predominantTechnologies: newTechs };
    });
  };

  const handleAddSupply = () => {
    setEquipment(prev => {
        if (!prev) return null;
        const newSupplies = [...(prev.supplies || []), { name: '', value: '', otherName: '' }];
        return { ...prev, supplies: newSupplies };
    });
  };

  const handleRemoveSupply = (index: number) => {
      setEquipment(prev => {
          if (!prev) return null;
          const newSupplies = [...(prev.supplies || [])];
          newSupplies.splice(index, 1);
          return { ...prev, supplies: newSupplies };
      });
  };

  const handleSupplyChange = (index: number, field: keyof Supply, value: string) => {
      setEquipment(prev => {
          if (!prev) return null;
          const newSupplies = [...(prev.supplies || [])] as Supply[];
          newSupplies[index] = { ...newSupplies[index], [field]: value };
          return { ...prev, supplies: newSupplies };
      });
  };
  
  const handleAddCharacteristic = () => {
    setEquipment(prev => {
        if (!prev) return null;
        const newItems = [...(prev.otherCharacteristics || []), { name: '', value: '', otherName: '' }];
        return { ...prev, otherCharacteristics: newItems };
    });
  };

  const handleRemoveCharacteristic = (index: number) => {
      setEquipment(prev => {
          if (!prev) return null;
          const newItems = [...(prev.otherCharacteristics || [])];
          newItems.splice(index, 1);
          return { ...prev, otherCharacteristics: newItems };
      });
  };

  const handleCharacteristicChange = (index: number, field: keyof Characteristic, value: string) => {
      setEquipment(prev => {
          if (!prev) return null;
          const newItems = [...(prev.otherCharacteristics || [])] as Characteristic[];
          newItems[index] = { ...newItems[index], [field]: value };
          return { ...prev, otherCharacteristics: newItems };
      });
  };

  const handleAddAccessory = () => {
    setEquipment(prev => {
        if (!prev) return null;
        const newItems = [...(prev.accessories || []), { name: '', observation: '' }];
        return { ...prev, accessories: newItems };
    });
  };

  const handleRemoveAccessory = (index: number) => {
      setEquipment(prev => {
          if (!prev) return null;
          const newItems = [...(prev.accessories || [])];
          newItems.splice(index, 1);
          return { ...prev, accessories: newItems };
      });
  };
  
  const handleAccessoryChange = (index: number, field: keyof Accessory, value: string) => {
      setEquipment(prev => {
          if (!prev) return null;
          const newItems = [...(prev.accessories || [])] as Accessory[];
          newItems[index] = { ...newItems[index], [field]: value };
          return { ...prev, accessories: newItems };
      });
  };

  const translateX = (equipment.imagePositionX || 50) - 50;
  const translateY = (equipment.imagePositionY || 50) - 50;

  const renderTechnicalParameters = () => {
    if (!equipment?.predominantTechnologies) return null;

    const showElectric = equipment.predominantTechnologies.includes('Eléctrica') || equipment.predominantTechnologies.includes('Electrónica');
    const showPneumatic = equipment.predominantTechnologies.includes('Hidráulica') || equipment.predominantTechnologies.includes('Neumática');
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showElectric && (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="voltage" className="flex items-center gap-2"><Zap />Voltaje</Label>
                        <Input id="voltage" value={equipment.technicalParameters?.voltage || ''} onChange={handleTechParamChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="current">Corriente</Label>
                        <Input id="current" value={equipment.technicalParameters?.current || ''} onChange={handleTechParamChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="frequency">Frecuencia</Label>
                        <Input id="frequency" value={equipment.technicalParameters?.frequency || ''} onChange={handleTechParamChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="power">Potencia</Label>
                        <Input id="power" value={equipment.technicalParameters?.power || ''} onChange={handleTechParamChange} />
                    </div>
                </>
            )}
            {showPneumatic && (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="pressure" className="flex items-center gap-2"><Wind />Presión</Label>
                        <Input id="pressure" value={equipment.technicalParameters?.pressure || ''} onChange={handleTechParamChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="flow">Flujo</Label>
                        <Input id="flow" value={equipment.technicalParameters?.flow || ''} onChange={handleTechParamChange} />
                    </div>
                </>
            )}
        </div>
    );
  };


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-7 w-7">
          <Link href={`/inventory/${equipment.id}`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Atrás</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          EDITAR EQUIPO
        </h1>
      </div>
       <form className="grid gap-6" onSubmit={handleSave}>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 grid gap-6">
                   <Card>
                        <CardHeader>
                            <CardTitle>Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="flex items-center gap-2"><Tag />Nombre del Equipo</Label>
                                    <Input id="name" value={equipment.name} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="brand" className="flex items-center gap-2"><Building />Marca</Label>
                                    <Input id="brand" value={equipment.brand} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="model" className="flex items-center gap-2"><Puzzle />Modelo</Label>
                                    <Input id="model" value={equipment.model} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="serial" className="flex items-center gap-2"><Barcode />Serie</Label>
                                    <Input id="serial" value={equipment.serial} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="grid gap-2">
                                    <Label htmlFor="internalId" className="flex items-center gap-2"><HardDrive />ID Interno</Label>
                                    <Input id="internalId" value={equipment.internalId} onChange={handleInputChange} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="invima" className="flex items-center gap-2"><FileText />Registro Sanitario</Label>
                                    <Input id="invima" value={equipment.invima} onChange={handleInputChange} />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="sede" className="flex items-center gap-2"><Building2 />Sede</Label>
                                    <Input id="sede" value={equipment.sede} onChange={handleInputChange}/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location" className="flex items-center gap-2"><MapPin />Ubicación</Label>
                                    <Input id="location" value={equipment.location} onChange={handleInputChange}/>
                                </div>
                            </div>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="risk" className="flex items-center gap-2"><AlertTriangleIcon />Clasificación de Riesgo</Label>
                                    <Select value={equipment.risk} onValueChange={(value) => handleSelectChange('risk', value)}>
                                        <SelectTrigger id="risk">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="I">Clase I – Riesgo Bajo</SelectItem>
                                            <SelectItem value="IIa">Clase IIA – Riesgo Moderado</SelectItem>
                                            <SelectItem value="IIb">Clase IIB – Riesgo Alto</SelectItem>
                                            <SelectItem value="III">Clase III – Riesgo Muy Alto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="classificationByUse" className="flex items-center gap-2"><Briefcase />Clasificación por Uso</Label>
                                    <Select value={equipment.classificationByUse} onValueChange={(value) => handleSelectChange('classificationByUse', value)}>
                                      <SelectTrigger id="classificationByUse"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
                                          <SelectItem value="Tratamiento">Tratamiento y Mantenimiento de la Vida</SelectItem>
                                          <SelectItem value="Rehabilitación">Rehabilitación</SelectItem>
                                          <SelectItem value="Prevención">Prevención</SelectItem>
                                          <SelectItem value="Análisis de Laboratorio">Análisis de Laboratorio</SelectItem>
                                      </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status" className="flex items-center gap-2"><Server />Estado</Label>
                                    <Select value={equipment.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Activo"><div className="flex items-center gap-2"><CheckCircle className="text-green-500" /> Activo</div></SelectItem>
                                            <SelectItem value="Fuera de Servicio"><div className="flex items-center gap-2"><AlertTriangleIcon className="text-yellow-500" /> Fuera de Servicio</div></SelectItem>
                                            <SelectItem value="Dado de Baja"><div className="flex items-center gap-2"><XCircle className="text-red-500" /> Dado de Baja</div></SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                   </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><History />Registro Histórico</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-6 pt-2">
                             <div className="grid gap-2">
                                <Label htmlFor="acquisitionType" className="flex items-center gap-2"><Wrench />Tipo de Adquisición</Label>
                                <Input id="acquisitionType" value={equipment.acquisitionType} onChange={handleInputChange} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="manufacturer" className="flex items-center gap-2"><Building />Fabricante</Label>
                                <Input id="manufacturer" value={equipment.manufacturer} onChange={handleInputChange} required/>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="importer" className="flex items-center gap-2"><Ship />Importador</Label>
                                <Input id="importer" value={equipment.importer} onChange={handleInputChange} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="provider" className="flex items-center gap-2"><Truck />Proveedor</Label>
                                <Input id="provider" value={equipment.provider} onChange={handleInputChange} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="price" className="flex items-center gap-2"><DollarSign />Costo</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id="price-amount"
                                    type="text"
                                    value={equipment.price.amount}
                                    onChange={(e) => handlePriceChange('amount', e.target.value)}
                                    placeholder="0"
                                  />
                                  <Select value={equipment.price.currency} onValueChange={(value) => handlePriceChange('currency', value)}>
                                    <SelectTrigger className="w-[80px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="COP">COP</SelectItem>
                                      <SelectItem value="USD">USD</SelectItem>
                                      <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                             <div className="grid gap-2">
                                <Label htmlFor="warranty" className="flex items-center gap-2"><ShieldCheck />Garantía</Label>
                                <Input id="warranty" value={equipment.warranty} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="acquisitionDate" className="flex items-center gap-2"><Calendar />Fecha de Adquisición</Label>
                                <Input id="acquisitionDate" type="date" value={equipment.acquisitionDate} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="installationDate">Fecha de Instalación</Label>
                                <Input id="installationDate" type="date" value={equipment.installationDate} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Cpu />Información Técnica</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                           <div className="grid gap-2">
                                <Label>Tecnologías Predominantes</Label>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {technologyOptions.map(tech => (
                                        <Button
                                            key={tech}
                                            type="button"
                                            variant={(equipment.predominantTechnologies || []).includes(tech) ? "default" : "outline"}
                                            onClick={() => handleTechnologyChange(tech)}
                                            className="rounded-full"
                                        >
                                            {(equipment.predominantTechnologies || []).includes(tech) && <CheckCircle className="mr-2 h-4 w-4" />}
                                            {tech}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-4">
                                {renderTechnicalParameters()}
                            </div>
                             <Separator />
                            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="grid gap-4">
                                    <Label className="flex items-center gap-2"><Droplets />Suministro</Label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {(equipment.supplies || []).map((supply, index) => (
                                            <div key={index} className="grid gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Select value={supply.name} onValueChange={(value) => handleSupplyChange(index, 'name', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {supplyOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        value={supply.value}
                                                        onChange={(e) => handleSupplyChange(index, 'value', e.target.value)}
                                                        placeholder="Valor"
                                                        className="flex-grow"
                                                    />
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSupply(index)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                                 {supply.name === 'Otro' && (
                                                    <Input
                                                        value={supply.otherName || ''}
                                                        onChange={(e) => handleSupplyChange(index, 'otherName', e.target.value)}
                                                        placeholder="Nombre del suministro"
                                                        className="mt-2"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="outline" onClick={handleAddSupply} className="w-full">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Suministro
                                    </Button>
                                </div>
                                  <div className="grid gap-4">
                                      <Label className="flex items-center gap-2"><SlidersHorizontal />Otras Características</Label>
                                      <div className="grid grid-cols-1 gap-4">
                                        {(equipment.otherCharacteristics || []).map((char, index) => (
                                            <div key={index} className="grid gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Select value={char.name} onValueChange={(value) => handleCharacteristicChange(index, 'name', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {characteristicOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        value={char.value}
                                                        onChange={(e) => handleCharacteristicChange(index, 'value', e.target.value)}
                                                        placeholder="Valor"
                                                        className="flex-grow"
                                                    />
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCharacteristic(index)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                                 {char.name === 'Otro' && (
                                                    <Input
                                                        value={char.otherName || ''}
                                                        onChange={(e) => handleCharacteristicChange(index, 'otherName', e.target.value)}
                                                        placeholder="Nombre de la característica"
                                                        className="mt-2"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                      </div>
                                      <Button type="button" variant="outline" onClick={handleAddCharacteristic} className="w-full">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Característica
                                      </Button>
                                  </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-1 grid auto-rows-max gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Imagen del Equipo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative group aspect-video w-full overflow-hidden rounded-md border">
                                {imagePreview && (
                                    <div
                                        className="relative w-full h-full"
                                    >
                                        <Image 
                                            src={imagePreview}
                                            alt={`Imagen de ${equipment.name}`}
                                            fill
                                            className="object-cover"
                                            style={{
                                                transform: `scale(${equipment.imageZoom || 1}) translate(${translateX}%, ${translateY}%)`,
                                                transformOrigin: 'center center',
                                            }}
                                        />
                                    </div>
                                )}
                                <div 
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => setIsEditorOpen(true)}
                                >
                                    <Pencil className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif"
                            />
                            <div className="flex gap-2 mt-4">
                                <Button type="button" variant="outline" className="flex-1" onClick={handleUploadClick}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Subir Imagen
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Info />Descripción y Uso</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea 
                                    id="description" 
                                    value={equipment.description}
                                    onChange={handleInputChange}
                                    rows={6}
                                />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Package />Accesorios</CardTitle>
                            </CardHeader>
                           <CardContent className="grid gap-4">
                              {(equipment.accessories || []).map((accessory, index) => (
                                  <div key={index} className="grid grid-cols-[1fr,1fr,auto] items-center gap-2">
                                    <Input
                                        value={accessory.name}
                                        onChange={(e) => handleAccessoryChange(index, 'name', e.target.value)}
                                        placeholder="Nombre del accesorio"
                                    />
                                    <Input
                                        value={accessory.observation}
                                        onChange={(e) => handleAccessoryChange(index, 'observation', e.target.value)}
                                        placeholder="Observaciones"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveAccessory(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                              ))}
                              <Button type="button" variant="outline" onClick={handleAddAccessory} className="w-full">
                                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Accesorio
                              </Button>
                          </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Clock />Cronograma</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6 pt-2">
                            <div className="grid gap-2">
                                <Label htmlFor="maintenancePeriod">Periodicidad Mantenimiento</Label>
                                <Select value={equipment.maintenancePeriod} onValueChange={(value) => handleSelectChange('maintenancePeriod', value)}>
                                    <SelectTrigger id="maintenancePeriod">
                                        <SelectValue placeholder="Seleccionar período" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="No Aplica">No Aplica</SelectItem>
                                        <SelectItem value="Mensual">Mensual</SelectItem>
                                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                                        <SelectItem value="Cuatrimestral">Cuatrimestral</SelectItem>
                                        <SelectItem value="Semestral">Semestral</SelectItem>
                                        <SelectItem value="Anual">Anual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="calibrationPeriod">Periodicidad Calibración</Label>
                                <Select value={equipment.calibrationPeriod} onValueChange={(value) => handleSelectChange('calibrationPeriod', value)}>
                                    <SelectTrigger id="calibrationPeriod">
                                        <SelectValue placeholder="Seleccionar período" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="No Aplica">No Aplica</SelectItem>
                                        <SelectItem value="Mensual">Mensual</SelectItem>
                                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                                        <SelectItem value="Cuatrimestral">Cuatrimestral</SelectItem>
                                        <SelectItem value="Semestral">Semestral</SelectItem>
                                        <SelectItem value="Anual">Anual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CheckSquare />Documentación Requerida</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="invimaDoc" checked={!!equipment.requiredDocumentation?.invima} onCheckedChange={(checked) => handleCheckboxChange('invima', checked as boolean)} />
                                <Label htmlFor="invimaDoc" className="text-sm font-normal">Registro Sanitario</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="importDeclaration" checked={!!equipment.requiredDocumentation?.importDeclaration} onCheckedChange={(checked) => handleCheckboxChange('importDeclaration', checked as boolean)} />
                                <Label htmlFor="importDeclaration" className="text-sm font-normal">Declaración Importación</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="userManual" checked={!!equipment.requiredDocumentation?.userManual} onCheckedChange={(checked) => handleCheckboxChange('userManual', checked as boolean)} />
                                <Label htmlFor="userManual" className="text-sm font-normal">Manual de Usuario</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="serviceManual" checked={!!equipment.requiredDocumentation?.serviceManual} onCheckedChange={(checked) => handleCheckboxChange('serviceManual', checked as boolean)} />
                                <Label htmlFor="serviceManual" className="text-sm font-normal">Manual de Servicio</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="quickGuide" checked={!!equipment.requiredDocumentation?.quickGuide} onCheckedChange={(checked) => handleCheckboxChange('quickGuide', checked as boolean)} />
                                <Label htmlFor="quickGuide" className="text-sm font-normal">Guía Rápida</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="otherDoc" checked={!!equipment.requiredDocumentation?.other} onCheckedChange={(checked) => handleCheckboxChange('other', checked as boolean)} />
                                <Label htmlFor="otherDoc" className="text-sm font-normal">Otro</Label>
                            </div>
                        </CardContent>
                        {equipment.requiredDocumentation?.other && (
                            <CardContent className="pt-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="otherDocumentationDetail">Especificar Otro Documento</Label>
                                    <Input 
                                        id="otherDocumentationDetail" 
                                        value={equipment.otherDocumentationDetail}
                                        onChange={handleInputChange}
                                        placeholder="Especifique el documento..."
                                    />
                                </div>
                            </CardContent>
                        )}
                    </Card>
                </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
      

      {imagePreview && (
        <ImageEditorDialog
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleImageSettingsSave}
          imageUrl={imagePreview}
          initialZoom={equipment.imageZoom || 1}
          initialPositionX={equipment.imagePositionX || 50}
          initialPositionY={equipment.imagePositionY || 50}
        />
      )}
    </div>
  );
}

    
