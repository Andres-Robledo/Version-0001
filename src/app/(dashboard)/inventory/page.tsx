'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { File, PlusCircle, Search, Eye, Printer, ListFilter, CheckCircle, AlertTriangle, XCircle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EquipmentContext, Equipment } from '@/context/equipment-context';
import { cn } from '@/lib/utils';
import { Combobox } from '@/components/ui/combobox';

const statusConfig = {
  Activo: {
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
    label: 'Activo',
  },
  'Fuera de Servicio': {
    icon: AlertTriangle,
    color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
    label: 'Fuera de Servicio',
  },
  'Dado de Baja': {
      icon: XCircle,
      color: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300',
      label: 'Dado de Baja',
  }
} as const;

const riskText = {
    'I': 'Clase I',
    'IIa': 'Clase IIA',
    'IIb': 'Clase IIB',
    'III': 'Clase III',
} as const;

// Función para normalizar texto (quitar tildes y a minúsculas)
const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export default function InventoryPage() {
  const { equipmentList } = React.useContext(EquipmentContext);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    manufacturer: '',
    model: '',
    risk: '',
    status: '',
    location: '',
    sede: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageInput, setPageInput] = React.useState(currentPage.toString());
  const itemsPerPage = 10;
  
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Equipment; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });

  const [isAddButtonActive, setIsAddButtonActive] = React.useState(true);
  const addButtonTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);


  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    return () => {
      if (addButtonTimerRef.current) clearTimeout(addButtonTimerRef.current);
    };
  }, []);
  
  const sortedEquipment = React.useMemo(() => {
    let sortableItems = [...equipmentList];

    if (!sortConfig) return sortableItems;

    const { key, direction } = sortConfig;

    sortableItems.sort((a, b) => {
      const valA = a[key] ?? '';
      const valB = b[key] ?? '';
      
      if (valA < valB) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (valA > valB) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return sortableItems;
  }, [equipmentList, sortConfig]);

  const handleTempFilterChange = (filterName: keyof typeof tempFilters, value: string) => {
      const newFilters = {...tempFilters, [filterName]: value};
      
      if (filterName === 'manufacturer' && value !== tempFilters.manufacturer) {
          newFilters.model = '';
      }
      if (filterName === 'sede' && value !== tempFilters.sede) {
          newFilters.location = '';
      }

      setTempFilters(newFilters);
  }

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  }

  const clearFilters = () => {
    const cleared = {
      manufacturer: '',
      model: '',
      risk: '',
      status: '',
      location: '',
      sede: '',
    };
    setTempFilters(cleared);
    setFilters(cleared);
    setSearchTerm('');
    setCurrentPage(1);
  }
  
  const filteredEquipment = React.useMemo(() => {
    let equipment = [...sortedEquipment];
    const normalizedSearchTerm = normalizeText(searchTerm);

    if (normalizedSearchTerm) {
        equipment = equipment.filter((item) =>
            Object.values(item).some(val => 
                normalizeText(String(val)).includes(normalizedSearchTerm)
            )
        );
    }

    if (filters.manufacturer) {
      equipment = equipment.filter(item => item.manufacturer === filters.manufacturer);
    }
    if (filters.model) {
      equipment = equipment.filter(item => item.model === filters.model);
    }
    if (filters.risk) {
      equipment = equipment.filter(item => item.risk === filters.risk);
    }
    if (filters.status) {
      equipment = equipment.filter(item => item.status === filters.status);
    }
     if (filters.sede) {
      equipment = equipment.filter(item => item.sede === filters.sede);
    }
    if (filters.location) {
      equipment = equipment.filter(item => item.location === filters.location);
    }
    
    return equipment;
  }, [sortedEquipment, searchTerm, filters]);


  const availableOptions = React.useMemo(() => {
      const getUniqueValues = (list: Equipment[], key: keyof Equipment) => {
          return [...new Set(list.map(item => item[key]))].filter(Boolean) as string[];
      };

      const baseList = [...equipmentList];
      
      const manufacturers = getUniqueValues(baseList, 'manufacturer');
      const models = tempFilters.manufacturer ? getUniqueValues(baseList.filter(i => i.manufacturer === tempFilters.manufacturer), 'model') : getUniqueValues(baseList, 'model');
      const sedes = getUniqueValues(baseList, 'sede');
      const locations = tempFilters.sede ? getUniqueValues(baseList.filter(i => i.sede === tempFilters.sede), 'location') : getUniqueValues(baseList, 'location');
      const risks = getUniqueValues(baseList, 'risk');
      const statuses = getUniqueValues(baseList, 'status');

      return {
          manufacturers,
          models,
          risks,
          statuses,
          sedes,
          locations,
      };

  }, [tempFilters.manufacturer, tempFilters.sede, equipmentList]);

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const paginatedEquipment = filteredEquipment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNumber = parseInt(pageInput, 10);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      } else {
        setPageInput(currentPage.toString());
      }
    }
  };

  const handleExport = async () => {
    const xlsx = await import('xlsx');
    const dataForExport = filteredEquipment.map(item => ({
      'ID Interno': item.id,
      'Equipo': item.name,
      'Marca': item.manufacturer,
      'Modelo': item.model,
      'Serie': item.serial,
      'Registro Sanitario': item.invima,
      'Riesgo': riskText[item.risk as keyof typeof riskText] || 'NO ESPECIFICADO',
      'Estado': item.status,
      'Sede': item.sede,
      'Ubicación': item.location,
      'Fecha de Instalación': item.installationDate,
    }));

    const worksheet = xlsx.utils.json_to_sheet(dataForExport);
    
    const columnWidths = Object.keys(dataForExport[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...dataForExport.map(row => String((row as any)[key] || '').length)
      ) + 2
    }));
    worksheet['!cols'] = columnWidths;

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Inventario de Equipos");
    
    xlsx.writeFile(workbook, "inventario_equipos.xlsx");
  };

  const handleOtherButtonEnter = () => {
    if (addButtonTimerRef.current) clearTimeout(addButtonTimerRef.current);
    setIsAddButtonActive(false);
  };

  const handleOtherButtonLeave = () => {
    addButtonTimerRef.current = setTimeout(() => setIsAddButtonActive(true), 500);
  };

  const renderTableRows = (data: Equipment[]) => {
    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-24 text-center">
            No se encontraron resultados.
          </TableCell>
        </TableRow>
      );
    }
    return data.map((item) => {
      const StatusIcon = statusConfig[item.status as keyof typeof statusConfig]?.icon || 'span';
      const statusColor = statusConfig[item.status as keyof typeof statusConfig]?.color || '';
      const statusLabel = statusConfig[item.status as keyof typeof statusConfig]?.label || item.status;

      return (
        <TableRow key={item.id}>
          <TableCell className="font-medium text-center">{item.name}</TableCell>
          <TableCell className="hidden md:table-cell text-center">{item.manufacturer}</TableCell>
          <TableCell className="hidden md:table-cell text-center">{item.model}</TableCell>
          <TableCell className="text-center">{item.serial}</TableCell>
          <TableCell className="hidden md:table-cell text-center">{item.invima}</TableCell>
          <TableCell className="text-center">{riskText[item.risk as keyof typeof riskText] || 'NO ESPECIFICADO'}</TableCell>
          <TableCell className="text-center">
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={'flex items-center justify-center'}>
                           <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${statusColor}`}>
                             <StatusIcon className="h-5 w-5" />
                           </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent><p>{statusLabel}</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="icon" className="h-9 w-9 hover:bg-green-600 hover:text-white">
                      <Link href={`/inventory/${item.id}`}><Eye className="h-4 w-4" /><span className="sr-only">Ver Más</span></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Ver Más</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 hover:bg-[#256cbe] hover:text-white">
                      <Printer className="h-4 w-4" /><span className="sr-only">Generar Resumen</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Generar Resumen</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <main className="grid flex-1 items-start gap-4 md:gap-8">
        <div className="flex items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">INVENTARIO DE EQUIPOS</h2>
            <p className="text-muted-foreground">Gestión integral de dispositivos médicos</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar equipo..."
                className="w-full rounded-lg bg-background pl-8 lg:w-[320px]"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1" onClick={() => setTempFilters(filters)} onMouseEnter={handleOtherButtonEnter} onMouseLeave={handleOtherButtonLeave}>
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filtrar</span>
                </Button>
              </DialogTrigger>
              <DialogContent 
                className="sm:max-w-2xl"
              >
                <DialogHeader>
                  <DialogTitle>Filtrar Inventario</DialogTitle>
                  <DialogDescription>Aplica filtros para encontrar equipos específicos.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto p-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="filter-manufacturer">Marca</Label>
                        <Combobox
                          options={[{value: '', label: 'Todas las Marcas'}, ...availableOptions.manufacturers.map(m => ({ value: m, label: m }))]}                        
                          value={tempFilters.manufacturer}
                          onChange={(value) => handleTempFilterChange('manufacturer', value)}
                          placeholder="Seleccionar marca..."
                          searchPlaceholder="Buscar marca..."
                          emptyPlaceholder="No se encontró la marca."
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="filter-model">Modelo</Label>
                         <Combobox
                          options={[{value: '', label: 'Todos los Modelos'}, ...availableOptions.models.map(m => ({ value: m, label: m }))]}                        
                          value={tempFilters.model}
                          onChange={(value) => handleTempFilterChange('model', value)}
                          placeholder="Seleccionar modelo..."
                          searchPlaceholder="Buscar modelo..."
                          emptyPlaceholder="No se encontró el modelo."
                          disabled={!tempFilters.manufacturer && availableOptions.models.length > 20}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="filter-sede">Sede</Label>
                        <Combobox
                          options={[{value: '', label: 'Todas las Sedes'}, ...availableOptions.sedes.map(s => ({ value: s, label: s }))]}                        
                          value={tempFilters.sede}
                          onChange={(value) => handleTempFilterChange('sede', value)}
                          placeholder="Seleccionar sede..."
                          searchPlaceholder="Buscar sede..."
                          emptyPlaceholder="No se encontró la sede."
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="filter-location">Ubicación</Label>
                        <Combobox
                          options={[{value: '', label: 'Todas las Ubicaciones'}, ...availableOptions.locations.map(l => ({ value: l, label: l }))]}                        
                          value={tempFilters.location}
                          onChange={(value) => handleTempFilterChange('location', value)}
                          placeholder="Seleccionar ubicación..."
                          searchPlaceholder="Buscar ubicación..."
                          emptyPlaceholder="No se encontró la ubicación."
                          disabled={!tempFilters.sede}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="filter-risk">Riesgo</Label>
                        <Combobox
                          options={[{value: '', label: 'Todos los Riesgos'}, ...availableOptions.risks.map(r => ({ value: r, label: riskText[r as keyof typeof riskText] || r }))]}                       
                          value={tempFilters.risk}
                          onChange={(value) => handleTempFilterChange('risk', value)}
                          placeholder="Seleccionar riesgo..."
                          searchPlaceholder="Buscar riesgo..."
                          emptyPlaceholder="No se encontró el riesgo."
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="filter-status">Estado</Label>
                         <Combobox
                          options={[{value: '', label: 'Todos los Estados'}, ...availableOptions.statuses.map(s => ({ value: s, label: s }))]}                        
                          value={tempFilters.status}
                          onChange={(value) => handleTempFilterChange('status', value)}
                          placeholder="Seleccionar estado..."
                          searchPlaceholder="Buscar estado..."
                          emptyPlaceholder="No se encontró el estado."
                        />
                      </div>
                  </div>
                </div>
                <DialogFooter>
                  <div className="flex justify-end gap-2 group">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={clearFilters} 
                      className="border-gray-300 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Limpiar Filtros
                    </Button>
                    <Button 
                      type="button" 
                      onClick={applyFilters}
                      className="text-white bg-green-600 hover:bg-green-700 group-hover:bg-gray-400 group-hover:hover:bg-green-700"
                    >Aplicar</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button size="sm" variant="outline" className="h-9 gap-1" onClick={handleExport} onMouseEnter={handleOtherButtonEnter} onMouseLeave={handleOtherButtonLeave}>
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-rap">Exportar</span>
            </Button>
            <Button asChild size="sm" className={cn('h-9 gap-1 text-white transition-colors duration-300', isAddButtonActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-500')}>
              <Link href="/inventory/add">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-rap">Añadir Equipo</span>
              </Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="relative w-full overflow-auto">
              <Table className="w-full" style={{ tableLayout: 'fixed' }}>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary/90">
                    <TableHead className="font-bold text-primary-foreground text-center rounded-tl-lg" style={{ width: '14%' }}>EQUIPO</TableHead>
                    <TableHead className="hidden md:table-cell font-bold text-primary-foreground text-center" style={{ width: '14%' }}>MARCA</TableHead>
                    <TableHead className="hidden md:table-cell font-bold text-primary-foreground text-center" style={{ width: '14%' }}>MODELO</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-center" style={{ width: '14%' }}>SERIE</TableHead>
                    <TableHead className="hidden md:table-cell font-bold text-primary-foreground text-center" style={{ width: '14%' }}>INVIMA</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-center" style={{ width: '11%' }}>RIESGO</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-center" style={{ width: '8%' }}>ESTADO</TableHead>
                    <TableHead className="font-bold text-primary-foreground text-right pr-8 rounded-tr-lg" style={{ width: '11%' }}>ACCIONES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows(paginatedEquipment)}</TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
              <div>
                {filteredEquipment.length} de {equipmentList.length} equipo(s) en total.
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>Página</span>
                  <Input
                      type="number"
                      value={pageInput}
                      onChange={handlePageInputChange}
                      onKeyDown={handlePageInputSubmit}
                      className="h-8 w-14 text-center"
                      min="1"
                      max={totalPages}
                  />
                  <span>de {totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Anterior</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Siguiente</Button>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
