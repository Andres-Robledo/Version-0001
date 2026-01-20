'use client';

import { notFound, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  Wrench,
  Tag,
  MapPin,
  Barcode,
  Building,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Briefcase,
  Cpu,
  Puzzle,
  FileText,
  DollarSign,
  ShieldCheck,
  Building2,
  History,
  HardDrive,
  Package,
  CheckSquare,
  Info,
  Users,
  Ship,
  Truck,
  FilePlus,
  Upload,
  FilePlus2,
  Eye,
  Trash2,
  Search,
  Pencil,
  Zap,
  Wind,
  Droplets,
  SlidersHorizontal,
  HeartPulse,
  FileWarning,
} from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { EOLForecaster } from './components/eol-forecaster';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EquipmentContext, EquipmentDocument } from '@/context/equipment-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyContext } from '@/context/company-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Equipment } from '@/context/equipment-context';


const riskTextMap = {
    I: 'Clase I',
    IIa: 'Clase IIA',
    IIb: 'Clase IIB',
    III: 'Clase III',
} as const;

const docTypeLabels: Record<keyof Equipment['requiredDocumentation'], string> = {
  invima: 'Registro Sanitario',
  importDeclaration: 'Declaración de Importación',
  userManual: 'Manual de Usuario',
  serviceManual: 'Manual de Servicio',
  quickGuide: 'Guía Rápida',
  other: 'Otro',
};

type Document = { 
  id: string; 
  name: string; 
  date: string; 
  author: string,
  type: 'Preventivo' | 'Correctivo' 
};

const INITIAL_REPORTS: Document[] = [
    { id: 'RMP-001', name: 'RMP - NVM0001', date: '2024-05-24', author: 'Jane Doe', type: 'Preventivo' },
    { id: 'CAL-002', name: 'CAL - XYZ002', date: '2024-06-15', author: 'John Smith', type: 'Preventivo' },
    { id: 'INC-003', name: 'INC - ABC003', date: '2024-07-01', author: 'Jane Doe', type: 'Correctivo' },
];

const INITIAL_CERTIFICATES: Omit<Document, 'type'>[] = [
  { id: 'CERT-001', name: 'Certificado de Calibración', date: '2024-01-20', author: 'Metrology Inc.' },
];


function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="text-base font-semibold ml-6">{value || 'N/A'}</div>
    </div>
  )
}

export default function EquipmentDetailPage() {
  const params = useParams();
  const { equipmentList, addDocument, deleteDocument } = React.useContext(EquipmentContext);
  const { companyName } = React.useContext(CompanyContext);
  
  const [reports, setReports] = useState<Document[]>(INITIAL_REPORTS);
  const [certificates, setCertificates] = useState<Omit<Document, 'type'>[]>(INITIAL_CERTIFICATES);

  const [reportSearchTerm, setReportSearchTerm] = useState('');
  const [certificateSearchTerm, setCertificateSearchTerm] = useState('');
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<Document | Omit<Document, 'type'> | null>(null);
  const [editDialogType, setEditDialogType] = useState<'report' | 'certificate' | null>(null);
  
  const [uploadDialogState, setUploadDialogState] = useState<{ open: boolean; docType: keyof Equipment['requiredDocumentation'] | null }>({ open: false, docType: null });
  const [deleteDocDialogState, setDeleteDocDialogState] = useState<{ open: boolean; docType: keyof Equipment['requiredDocumentation'] | null }>({ open: false, docType: null });
  const [newDocumentName, setNewDocumentName] = useState('');

  const equipment = equipmentList.find((e) => e.id === params.id);

  if (!equipment) {
    if (equipmentList.length === 0) {
      return <div>Cargando...</div>;
    }
    notFound();
  }

  const handleUploadDocument = () => {
    if (!uploadDialogState.docType || !newDocumentName || !equipment) return;
    
    const newDocument: EquipmentDocument = {
        type: uploadDialogState.docType,
        name: newDocumentName,
        date: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    addDocument(equipment.id, newDocument);
    setUploadDialogState({ open: false, docType: null });
    setNewDocumentName('');
  };

  const handleDeleteDocumentConfirm = () => {
    if (!deleteDocDialogState.docType || !equipment) return;
    deleteDocument(equipment.id, deleteDocDialogState.docType);
    setDeleteDocDialogState({ open: false, docType: null });
  };


  const getMostRecentDate = (docs: (Document | Omit<Document, 'type'>)[]): string => {
    if (docs.length === 0) return 'N/A';
    
    const mostRecentDoc = docs.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    });

    return new Date(mostRecentDoc.date + 'T00:00:00').toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
  };

  const lastMaintenanceDate = getMostRecentDate(reports.filter(r => r.type === 'Preventivo'));
  const lastCalibrationDate = getMostRecentDate(certificates);
  
  const riskLabel = riskTextMap[equipment.risk as keyof typeof riskTextMap] || equipment.risk;

  const statusConfig = {
      Activo: {
        icon: CheckCircle,
        variant: 'success',
        label: 'ACTIVO',
      },
      'Fuera de Servicio': {
        icon: AlertTriangle,
        variant: 'warning',
        label: 'FUERA DE SERVICIO',
      },
      'Dado de Baja': {
        icon: XCircle,
        variant: 'destructive',
        label: 'DADO DE BAJA',
      },
  } as const;
  const currentStatus = equipment.status as keyof typeof statusConfig;
  const statusInfo = statusConfig[currentStatus];

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(reportSearchTerm.toLowerCase())
  );
  
  const preventiveReports = filteredReports.filter(r => r.type === 'Preventivo');
  const correctiveReports = filteredReports.filter(r => r.type === 'Correctivo');

  const filteredCertificates = certificates.filter(cert =>
    cert.name.toLowerCase().includes(certificateSearchTerm.toLowerCase())
  );
  
  const handleEditDocument = (doc: Document | Omit<Document, 'type'>, type: 'report' | 'certificate') => {
    setDocumentToEdit({ ...doc });
    setEditDialogType(type);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveDocument = () => {
    if (!documentToEdit || !editDialogType) return;

    if (editDialogType === 'report') {
        setReports(reports.map(r => r.id === documentToEdit!.id ? documentToEdit! as Document : r));
    } else if (editDialogType === 'certificate') {
        setCertificates(certificates.map(c => c.id === documentToEdit!.id ? documentToEdit! : c));
    }

    setIsEditDialogOpen(false);
    setDocumentToEdit(null);
    setEditDialogType(null);
  };
  
  const handleDeleteReport = (docId: string, type: 'report' | 'certificate') => {
    if (type === 'report') {
      setReports(reports.filter(r => r.id !== docId));
    } else if (type === 'certificate') {
      setCertificates(certificates.filter(c => c.id !== docId));
    }
  }

  const translateX = (equipment.imagePositionX || 50) - 50;
  const translateY = (equipment.imagePositionY || 50) - 50;

  const renderAccessoriesList = () => {
    const accessories = Array.isArray(equipment.accessories) ? equipment.accessories : [];
    if (!accessories || accessories.length === 0 || accessories.every(acc => !acc.name.trim())) {
        return <p className="text-sm text-muted-foreground">N/A</p>;
    }
    
    return (
        <ul className="space-y-2">
            {accessories.map((acc, index) => acc.name.trim() && (
                <li key={index} className="text-sm">
                    <p className="font-semibold text-foreground">{acc.name}</p>
                    {acc.observation && (
                        <p className="text-xs text-muted-foreground pl-2">&#8227; {acc.observation}</p>
                    )}
                </li>
            ))}
        </ul>
    );
  };

  const renderTechnicalParameters = () => {
    if (!equipment) return null;

    const params = [
        { icon: Zap, label: 'Voltaje', value: equipment.technicalParameters?.voltage },
        { icon: Zap, label: 'Corriente', value: equipment.technicalParameters?.current },
        { icon: Zap, label: 'Potencia', value: equipment.technicalParameters?.power },
        { icon: Zap, label: 'Frecuencia', value: equipment.technicalParameters?.frequency },
        { icon: Wind, label: 'Presión', value: equipment.technicalParameters?.pressure },
        { icon: Wind, label: 'Flujo', value: equipment.technicalParameters?.flow },
    ];
    
    const availableParams = params.filter(p => p.value);
    
    const technologies = Array.isArray(equipment.predominantTechnologies) ? equipment.predominantTechnologies : (typeof equipment.predominantTechnologies === 'string' ? [equipment.predominantTechnologies] : []);
    const supplies = Array.isArray(equipment.supplies) ? equipment.supplies : [];
    const otherCharacteristics = Array.isArray(equipment.otherCharacteristics) ? equipment.otherCharacteristics : [];

    return (
        <>
            <div className="md:col-span-2">
                <DetailItem 
                    icon={Cpu} 
                    label="Tecnologías Predominantes" 
                    value={
                        technologies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {technologies.map(tech => (
                                <Badge key={tech} variant="secondary">{tech}</Badge>
                            ))}
                        </div>
                    ) : 'N/A'} 
                />
            </div>
            {availableParams.map(param => (
                <DetailItem key={param.label} icon={param.icon} label={param.label} value={param.value} />
            ))}
             <div className="md:col-span-2">
                <DetailItem 
                    icon={Droplets} 
                    label="Suministro" 
                    value={
                        supplies.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {supplies.map((supply) => (
                                <div key={supply.name} className="text-sm">
                                    <span className="font-semibold">{supply.name}:</span>{' '}
                                    <span className="text-muted-foreground">{supply.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : 'N/A'} 
                />
            </div>
            <div className="md:col-span-2">
                <DetailItem 
                    icon={SlidersHorizontal} 
                    label="Otras Características" 
                    value={
                        otherCharacteristics.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {otherCharacteristics.map((char) => (
                                <div key={char.name} className="text-sm">
                                    <span className="font-semibold">{char.name}:</span>{' '}
                                    <span className="text-muted-foreground">{char.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : 'N/A'} 
                />
            </div>
        </>
    );
  };
  
  const formatPrice = (price: Equipment['price']) => {
    if (!price || !price.amount) return 'N/A';
    const amount = Number(price.amount);
    if (isNaN(amount)) return 'N/A';
    return `${price.currency} ${amount.toLocaleString('es-CO')}`;
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-7 w-7">
          <Link href="/inventory">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Atrás</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          HOJA DE VIDA
        </h1>
        <div className="items-center gap-2 md:ml-auto flex">
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="uppercase">ELIMINAR</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente
                        el equipo y todos sus datos asociados de nuestros servidores.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction>Continuar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button asChild size="sm" className="uppercase bg-[#256dbf] hover:bg-[#256dbf]/90 text-white">
            <Link href={`/inventory/${equipment.id}/edit`}>EDITAR</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Tabs defaultValue="informacion">
                <TabsList className="grid w-full grid-cols-4 bg-primary text-primary-foreground">
                    <TabsTrigger value="informacion" className="uppercase data-[state=active]:bg-background data-[state=active]:text-foreground">Información</TabsTrigger>
                    <TabsTrigger value="reportes" className="uppercase data-[state=active]:bg-background data-[state=active]:text-foreground">Reportes</TabsTrigger>
                    <TabsTrigger value="certificados" className="uppercase data-[state=active]:bg-background data-[state=active]:text-foreground">Certificados</TabsTrigger>
                    <TabsTrigger value="documentos" className="uppercase data-[state=active]:bg-background data-[state=active]:text-foreground">Documentos</TabsTrigger>
                </TabsList>
                <TabsContent value="informacion">
                   <div className="grid gap-6 mt-6">
                        <Card>
                             <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                                <FileText className="h-6 w-6" />
                                <CardTitle className='text-lg'>Información General del Equipo</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2 grid md:grid-cols-3 gap-y-4 gap-x-6">
                                <DetailItem icon={Tag} label="Nombre del Equipo" value={equipment.name} />
                                <DetailItem icon={Building} label="Marca" value={equipment.manufacturer} />
                                <DetailItem icon={Puzzle} label="Modelo" value={equipment.model} />
                                <DetailItem icon={Barcode} label="Serie" value={equipment.serial} />
                                <DetailItem icon={HardDrive} label="ID Interno" value={equipment.id} />
                                <DetailItem icon={FileText} label="Registro Sanitario" value={equipment.invima} />
                                <DetailItem icon={Building2} label="Sede" value={equipment.sede} />
                                <DetailItem icon={MapPin} label="Ubicación" value={equipment.location} />
                                <DetailItem icon={Users} label="Institución" value={companyName} />
                                <DetailItem icon={Briefcase} label="Clasificación por Uso" value={"Diagnóstico"} />
                                <DetailItem icon={AlertTriangle} label="Clasificación de Riesgo" value={riskLabel} />
                                {statusInfo && (
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                      <statusInfo.icon className="h-4 w-4" />
                                      <span>Estado</span>
                                    </div>

                                    <div className="ml-6">
                                      <Badge variant={statusInfo.variant}>
                                        {statusInfo.label}
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                             <Card>
                                <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                                    <Package className="h-6 w-6" />
                                    <CardTitle className="text-lg">Accesorios</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderAccessoriesList()}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                                    <Info className="h-6 w-6" />
                                    <CardTitle className="text-lg">Descripción y Uso</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                       {equipment.description}
                                    </p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                                    <Cpu className="h-6 w-6" />
                                    <CardTitle className="text-lg">Información Técnica</CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-x-4 gap-y-4 pt-2">
                                  {renderTechnicalParameters()}
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                                    <History className="h-6 w-6" />
                                    <CardTitle className="text-lg">Registro Histórico</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-4 pt-2">
                                    <DetailItem icon={Wrench} label="Tipo de Adquisición" value={equipment.acquisitionType} />
                                    <DetailItem icon={Building} label="Fabricante" value={equipment.manufacturer} />
                                    <DetailItem icon={Ship} label="Importador" value={equipment.importer} />
                                    <DetailItem icon={Truck} label="Proveedor" value={equipment.provider} />
                                    <DetailItem icon={Calendar} label="Fecha Adquisición" value={equipment.acquisitionDate} />
                                    <DetailItem icon={Calendar} label="Fecha Instalación" value={equipment.installationDate} />
                                    <DetailItem icon={DollarSign} label="Costo" value={formatPrice(equipment.price)} />
                                    <DetailItem icon={ShieldCheck} label="Garantía" value={equipment.warranty} />
                                </CardContent>
                            </Card>
                        </div>
                   </div>
                </TabsContent>
                <TabsContent value="reportes">
                    <div className="grid gap-6 mt-6">
                        <div className="flex items-center justify-between">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Buscar en todos los reportes..." 
                                    className="pl-8" 
                                    value={reportSearchTerm}
                                    onChange={(e) => setReportSearchTerm(e.target.value)}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" className="ml-4">
                                        <FilePlus className="mr-2 h-4 w-4" />
                                        Nuevo Reporte
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <FilePlus2 className="mr-2 h-4 w-4" />
                                    <span>Generar reporte</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Upload className="mr-2 h-4 w-4" />
                                    <span>Subir documento</span>
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Card>
                            <CardHeader className="flex-row items-center gap-3 space-y-0">
                                <HeartPulse className="h-6 w-6 text-primary" />
                                <CardTitle className="text-lg">Mantenimiento Preventivo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            {preventiveReports.length > 0 ? (
                                preventiveReports.map(report => (
                                    <Card key={report.id} className="flex items-center justify-between p-3">
                                        <div className="flex items-center gap-4">
                                            <FileText className="h-6 w-6 text-muted-foreground" />
                                            <div>
                                                <p className="font-semibold">{report.name}</p>
                                                <p className="text-xs text-muted-foreground">Creado el {new Date(report.date + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric'})} por {report.author}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button></TooltipTrigger>
                                              <TooltipContent><p>Ver más</p></TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                              <TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditDocument(report, 'report')}><Pencil className="h-4 w-4" /></Button></TooltipTrigger>
                                              <TooltipContent><p>Editar</p></TooltipContent>
                                            </Tooltip>
                                            <AlertDialog>
                                              <Tooltip>
                                                  <TooltipTrigger asChild><AlertDialogTrigger asChild><div className={cn(buttonVariants({ variant: 'destructive', size: 'icon' }), "h-8 w-8 cursor-pointer")}><Trash2 className="h-4 w-4" /></div></AlertDialogTrigger></TooltipTrigger>
                                                  <TooltipContent><p>Eliminar</p></TooltipContent>
                                              </Tooltip>
                                              <AlertDialogContent>
                                                  <AlertDialogHeader><AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el documento.</AlertDialogDescription></AlertDialogHeader>
                                                  <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteReport(report.id, 'report')}>Continuar</AlertDialogAction></AlertDialogFooter>
                                              </AlertDialogContent>
                                          </AlertDialog>
                                          </TooltipProvider>
                                        </div>
                                    </Card>
                                ))
                           ) : (
                            <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-md">
                                <Search className="h-10 w-10 text-muted-foreground" />
                                <h3 className="mt-4 text-md font-semibold">No se encontraron reportes preventivos</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Intenta con otro término de búsqueda o crea un nuevo reporte.</p>
                            </div>
                           )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex-row items-center gap-3 space-y-0">
                                <Wrench className="h-6 w-6 text-destructive" />
                                <CardTitle className="text-lg">Mantenimiento Correctivo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            {correctiveReports.length > 0 ? (
                                correctiveReports.map(report => (
                                    <Card key={report.id} className="flex items-center justify-between p-3">
                                        <div className="flex items-center gap-4">
                                            <FileText className="h-6 w-6 text-muted-foreground" />
                                            <div>
                                                <p className="font-semibold">{report.name}</p>
                                                <p className="text-xs text-muted-foreground">Creado el {new Date(report.date + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric'})} por {report.author}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                <TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button></TooltipTrigger>
                                                <TooltipContent><p>Ver más</p></TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                <TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditDocument(report, 'report')}><Pencil className="h-4 w-4" /></Button></TooltipTrigger>
                                                <TooltipContent><p>Editar</p></TooltipContent>
                                                </Tooltip>
                                                <AlertDialog>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild><AlertDialogTrigger asChild><div className={cn(buttonVariants({ variant: 'destructive', size: 'icon' }), "h-8 w-8 cursor-pointer")}><Trash2 className="h-4 w-4" /></div></AlertDialogTrigger></TooltipTrigger>
                                                        <TooltipContent><p>Eliminar</p></TooltipContent>
                                                    </Tooltip>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el documento.</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteReport(report.id, 'report')}>Continuar</AlertDialogAction></AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TooltipProvider>
                                        </div>
                                    </Card>
                                ))
                           ) : (
                             <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-md">
                                <Search className="h-10 w-10 text-muted-foreground" />
                                <h3 className="mt-4 text-md font-semibold">No se encontraron reportes correctivos</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Intenta con otro término de búsqueda o crea un nuevo reporte.</p>
                            </div>
                           )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="certificados">
                   <Card className='mt-6'>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Certificados</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Buscar certificados..." 
                                        className="pl-8" 
                                        value={certificateSearchTerm}
                                        onChange={(e) => setCertificateSearchTerm(e.target.value)}
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm">
                                            <FilePlus className="mr-2 h-4 w-4" />
                                            Nuevo Certificado
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <FilePlus2 className="mr-2 h-4 w-4" />
                                            <span>Generar Certificado</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Upload className="mr-2 h-4 w-4" />
                                            <span>Subir documento</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {filteredCertificates.length > 0 ? (
                                filteredCertificates.map(cert => (
                                    <Card key={cert.id} className="flex items-center justify-between p-3">
                                        <div className="flex items-center gap-4">
                                            <FileText className="h-6 w-6 text-muted-foreground" />
                                            <div>
                                                <p className="font-semibold">{cert.name}</p>
                                                <p className="text-xs text-muted-foreground">Creado el {new Date(cert.date + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric'})} por {cert.author}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button></TooltipTrigger>
                                              <TooltipContent><p>Ver más</p></TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                              <TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditDocument(cert, 'certificate')}><Pencil className="h-4 w-4" /></Button></TooltipTrigger>
                                              <TooltipContent><p>Editar</p></TooltipContent>
                                            </Tooltip>
                                            <AlertDialog>
                                                <Tooltip>
                                                    <TooltipTrigger asChild><AlertDialogTrigger asChild><div className={cn(buttonVariants({ variant: 'destructive', size: 'icon' }), "h-8 w-8 cursor-pointer")}><Trash2 className="h-4 w-4" /></div></AlertDialogTrigger></TooltipTrigger>
                                                    <TooltipContent><p>Eliminar</p></TooltipContent>
                                                </Tooltip>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el documento.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteReport(cert.id, 'certificate')}>Continuar</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                          </TooltipProvider>
                                        </div>
                                    </Card>
                                ))
                           ) : (
                            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-md">
                                <Search className="h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No se encontraron resultados</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {certificateSearchTerm ? "Intenta con otro término de búsqueda." : "Crea o sube el primer certificado."}
                                </p>
                            </div>
                           )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="documentos">
                    <Card className='mt-6'>
                        <CardHeader>
                            <CardTitle>Gestión de Documentos Adjuntos</CardTitle>
                            <CardDescription>Sube y gestiona los archivos requeridos para este equipo.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        {Object.values(equipment.requiredDocumentation).some(v => v) ? (
                            Object.entries(equipment.requiredDocumentation)
                            .filter(([, isRequired]) => isRequired)
                            .map(([docType]) => {
                                const docKey = docType as keyof Equipment['requiredDocumentation'];
                                const attachedDoc = equipment.documents?.find(d => d.type === docKey);
                                const label = docType === 'other' && equipment.otherDocumentationDetail 
                                                ? equipment.otherDocumentationDetail 
                                                : docTypeLabels[docKey];

                                return (
                                    <Card key={docKey} className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">{label}</p>
                                                {attachedDoc ? (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <FileText className="h-4 w-4" />
                                                        <span>{attachedDoc.name} - <span className="text-xs">Subido el {attachedDoc.date}</span></span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm text-amber-600 mt-1">
                                                        <FileWarning className="h-4 w-4" />
                                                        <span>No se ha adjuntado ningún archivo.</span>
                                                    </div>
                                                )}
                                            </div>
                                            {attachedDoc ? (
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> Ver</Button>
                                                    <Button variant="destructive" size="sm" onClick={() => setDeleteDocDialogState({ open: true, docType: docKey })}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button size="sm" onClick={() => { setNewDocumentName(''); setUploadDialogState({ open: true, docType: docKey }); }}>
                                                    <Upload className="mr-2 h-4 w-4" /> Subir Archivo
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                )
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-md">
                                <FileText className="h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No hay documentos requeridos</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Puedes configurar los documentos necesarios en la sección de edición del equipo.
                                </p>
                            </div>
                        )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>

        <div className="grid auto-rows-max items-start gap-6">
            <Card className="overflow-hidden">
              <div className="relative aspect-video w-full">
                <Image
                    src={equipment.imageUrl}
                    alt={`Imagen de ${equipment.name}`}
                    fill
                    className="object-cover"
                    style={{
                        transform: `scale(${equipment.imageZoom || 1}) translate(${translateX}%, ${translateY}%)`,
                        transformOrigin: 'center center',
                    }}
                    priority
                />
              </div>
            </Card>
            <EOLForecaster equipment={equipment} />
             <Card>
                <CardHeader className="flex-row items-center gap-2 space-y-0">
                    <Calendar className="h-5 w-5" />
                    <CardTitle className="text-base font-semibold">Cronograma</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 text-sm">
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Último Mantenimiento</span>
                            <span className="font-semibold">{lastMaintenanceDate}</span>
                        </div>
                        <p className="text-xs text-muted-foreground ml-1">Periodicidad: {equipment.maintenancePeriod || 'N/A'}</p>
                    </div>
                     <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Última Calibración</span>
                            <span className="font-semibold">{lastCalibrationDate}</span>
                        </div>
                        <p className="text-xs text-muted-foreground ml-1">Periodicidad: {equipment.calibrationPeriod || 'N/A'}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex-row items-center gap-2 space-y-0">
                    <CheckSquare className="h-5 w-5" />
                    <CardTitle className="text-base font-semibold">Documentación Requerida</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4">
                    {Object.entries(equipment.requiredDocumentation)
                        .filter(([, isRequired]) => isRequired)
                        .map(([docType]) => {
                            const docKey = docType as keyof Equipment['requiredDocumentation'];
                            const hasDocument = equipment.documents?.some(d => d.type === docKey);
                            const label = docType === 'other' && equipment.otherDocumentationDetail 
                                            ? equipment.otherDocumentationDetail 
                                            : docTypeLabels[docKey];
                            
                            return (
                                <div key={docKey} className="flex items-center gap-2">
                                    {hasDocument ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className="text-sm">{label}</span>
                                </div>
                            );
                        })}
                </CardContent>
            </Card>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
            <DialogDescription>
              Realiza cambios en el documento. Haz clic en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          {documentToEdit && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="report-name"
                  value={documentToEdit.name}
                  onChange={(e) => setDocumentToEdit(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-date" className="text-right">
                  Fecha
                </Label>
                <Input
                  id="report-date"
                  type="date"
                  value={documentToEdit.date}
                  onChange={(e) => setDocumentToEdit(prev => prev ? { ...prev, date: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setIsEditDialogOpen(false); setDocumentToEdit(null); }}>Cancelar</Button>
            <Button type="submit" onClick={handleSaveDocument}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       <Dialog open={uploadDialogState.open} onOpenChange={(open) => setUploadDialogState({ open, docType: open ? uploadDialogState.docType : null })}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle>Subir Documento</DialogTitle>
            <DialogDescription>
                Ingresa el nombre del archivo para adjuntarlo. En el futuro, podrás subir el archivo directamente.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doc-name" className="text-right">
                Nombre
                </Label>
                <Input
                id="doc-name"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Registro_INVIMA_2024.pdf"
                />
            </div>
            </div>
            <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setUploadDialogState({ open: false, docType: null })}>Cancelar</Button>
            <Button type="submit" onClick={handleUploadDocument} disabled={!newDocumentName}>Adjuntar</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDocDialogState.open} onOpenChange={(open) => setDeleteDocDialogState({ open, docType: open ? deleteDocDialogState.docType : null })}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro de eliminar este documento?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción no se puede deshacer. El registro del documento será eliminado.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteDocDialogState({ open: false, docType: null })}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteDocumentConfirm}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
