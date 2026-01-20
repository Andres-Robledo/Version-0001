'use client';

import { useState } from 'react';
import {
  BarChart2,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
  Upload,
  Download,
  CalendarCheck,
  Wrench,
  ShieldAlert,
  FileSignature,
  Archive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type DocumentFile = { 
    id: string; 
    name: string; 
    date: string; 
    size: string; 
};

type DocumentCategory = {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    files: DocumentFile[];
};

const initialCategories: DocumentCategory[] = [
    {
        id: 'reports',
        title: 'Informes',
        description: 'Visualiza y exporta informes generados sobre tus equipos.',
        icon: BarChart2,
        files: [],
    },
    {
        id: 'plans',
        title: 'Planes de Mantenimiento',
        description: 'Documentos maestros que describen las estrategias y programación de mantenimiento.',
        icon: CalendarCheck,
        files: [
             { id: 'plan_001', name: 'Plan-Mantenimiento-2024-v1.2.pdf', date: '15 de enero de 2024', size: '2.5 MB' },
        ],
    },
    {
        id: 'protocols',
        title: 'Procesos de Mantenimiento',
        description: 'Procedimientos detallados para el mantenimiento preventivo de equipos específicos.',
        icon: Wrench,
        files: [
            { id: 'proto_001', name: 'Protocolo-Desfibriladores-Philips.pdf', date: '20 de noviembre de 2023', size: '850 KB' },
            { id: 'proto_002', name: 'Protocolo-Ventiladores-Medtronic.pdf', date: '22 de noviembre de 2023', size: '1.2 MB' },
        ],
    },
    {
        id: 'technovigilance',
        title: 'Tecnovigilancia',
        description: 'Gestiona incidentes y alertas de seguridad de los dispositivos médicos.',
        icon: ShieldAlert,
        files: [],
    },
    {
        id: 'contracts',
        title: 'Contratos',
        description: 'Carga los diferentes contratos con proveedores para el estándar de dotación.',
        icon: FileSignature,
        files: [],
    },
    {
        id: 'others',
        title: 'Otros Documentos',
        description: 'Formatos de inspección, hojas de vida, y otros documentos de cumplimiento.',
        icon: Archive,
        files: [],
    },
];

export default function DocumentsPage() {
    const { toast } = useToast();
    const [categories, setCategories] = useState<DocumentCategory[]>(initialCategories);
    const [dialogState, setDialogState] = useState<{ type: 'upload' | 'rename'; categoryId: string; file?: DocumentFile } | null>(null);
    const [fileName, setFileName] = useState('');

    const handleOpenDialog = (type: 'upload' | 'rename', categoryId: string, file?: DocumentFile) => {
        setFileName(file ? file.name : '');
        setDialogState({ type, categoryId, file });
    };

    const handleConfirm = () => {
        if (!dialogState || !fileName) return;
        const { type, categoryId, file } = dialogState;

        if (type === 'upload') {
            const newFile: DocumentFile = {
                id: `doc_${Date.now()}`,
                name: fileName,
                date: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'de', year: 'numeric' }),
                size: `${(Math.random() * 3072).toFixed(1)} KB`
            };
            setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, files: [newFile, ...cat.files] } : cat));
        } else if (type === 'rename' && file) {
            setCategories(prev => prev.map(cat => cat.id === categoryId 
                ? { ...cat, files: cat.files.map(f => f.id === file.id ? { ...f, name: fileName } : f) }
                : cat
            ));
        }
        
        setDialogState(null);
    };

    const handleDelete = (categoryId: string, fileId: string) => {
         setCategories(prev => prev.map(cat => cat.id === categoryId 
             ? { ...cat, files: cat.files.filter(f => f.id !== fileId) }
             : cat
         ));
    };

    const renderFile = (file: DocumentFile, categoryId: string) => (
        <div key={file.id} className="flex items-center justify-between rounded-md border bg-background p-4">
            <div className="flex items-center gap-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                        Subido el {file.date} - {file.size}
                    </p>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => toast({ title: 'Función en desarrollo' })}>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleOpenDialog('rename', categoryId, file)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Renombrar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => handleDelete(categoryId, file.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    return (
        <>
            <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Documentos</h1>
                    <p className="text-muted-foreground">
                        Centraliza y gestiona todos los documentos de cumplimiento.
                    </p>
                </div>

                <div className="space-y-6">
                    {categories.map((category) => (
                        <Card key={category.id}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <category.icon className="h-6 w-6 text-primary" />
                                    <div>
                                        <CardTitle>{category.title}</CardTitle>
                                        <CardDescription className="mt-1">{category.description}</CardDescription>
                                    </div>
                                </div>
                                <Button onClick={() => handleOpenDialog('upload', category.id)}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Subir Archivo
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {category.files.length > 0 ? (
                                    <>
                                        <Separator className="mb-4" />
                                        <div className="space-y-4">
                                            {category.files.map((file) => renderFile(file, category.id))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-10 text-center">
                                        <FileText className="h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-semibold">No hay documentos en esta categoría.</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">Haz clic en "Subir Archivo" para empezar.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog open={!!dialogState} onOpenChange={(isOpen) => !isOpen && setDialogState(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{dialogState?.type === 'upload' ? 'Subir Documento' : 'Renombrar Documento'}</DialogTitle>
                        <DialogDescription>
                            {dialogState?.type === 'upload' 
                                ? `Ingresa el nombre para el nuevo documento en la categoría "${categories.find(c => c.id === dialogState?.categoryId)?.title}".` 
                                : `Ingresa el nuevo nombre para \"${dialogState?.file?.name}\".`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="doc-name">Nombre del Documento</Label>
                        <Input id="doc-name" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Ej: Certificado de Calibración.pdf" />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogState(null)}>Cancelar</Button>
                        <Button onClick={handleConfirm}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
