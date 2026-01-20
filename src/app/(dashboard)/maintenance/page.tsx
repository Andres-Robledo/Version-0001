'use client';

import * as React from 'react';
import {
  File,
  PlusCircle,
  Search,
  ListFilter,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Trash2,
  Wrench,
  Gauge,
  Info,
  AlertTriangle,
  CalendarPlus,
  ShieldCheck,
  Check,
} from 'lucide-react';
import * as xlsx from 'xlsx';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { EquipmentContext } from '@/context/equipment-context';
import { cn } from '@/lib/utils';

const statusConfig = {
  'A tiempo': {
    icon: CalendarCheck,
    color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
    label: 'A tiempo',
  },
  'Próximo a vencer': {
    icon: CalendarClock,
    color:
      'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
    label: 'Próximo a vencer',
  },
  Vencido: {
    icon: CalendarX,
    color: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300',
    label: 'Vencido',
  },
} as const;

type MaintenanceStatus = keyof typeof statusConfig;
type TaskType =
  | 'Mtto. Preventivo'
  | 'Calibración'
  | 'Mtto. Correctivo'
  | 'Equipo en Garantía o Comodato'
  | 'Equipo Fuera de Servicio';

const conventionItems: { name: TaskType | 'Tarea Realizada'; color: string; icon: React.ElementType }[] = [
  { name: 'Mtto. Preventivo', color: 'bg-green-500', icon: CalendarPlus },
  { name: 'Calibración', color: 'bg-yellow-800', icon: Gauge },
  { name: 'Mtto. Correctivo', color: 'bg-blue-500', icon: Wrench },
  { name: 'Equipo en Garantía o Comodato', color: 'bg-yellow-400', icon: ShieldCheck },
  { name: 'Equipo Fuera de Servicio', color: 'bg-red-500', icon: AlertTriangle },
  { name: 'Tarea Realizada', color: 'border-2 border-black', icon: Check },
];

const taskColors: Record<TaskType, string> = Object.fromEntries(conventionItems.filter(item => item.name !== 'Tarea Realizada').map(item => [item.name, item.color])) as Record<TaskType, string>;
const taskIcons: Record<TaskType, React.ElementType> = Object.fromEntries(conventionItems.filter(item => item.name !== 'Tarea Realizada').map(item => [item.name, item.icon])) as Record<TaskType, React.ElementType>;


type MonthlyTask = {
    type: TaskType;
    date: string;
    completed: boolean;
};

type MaintenanceSchedule = {
    equipmentId: string;
    equipmentName: string;
    manufacturer: string;
    model: string;
    serial: string;
    status: MaintenanceStatus;
    monthlyTasks: MonthlyTask[][];
}

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const fullMonthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const monthOptions = fullMonthNames.map((month, index) => ({
    value: String(index),
    label: month,
}));

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

function MonthlyTaskCircle({ tasks }: { tasks: MonthlyTask[] }) {
    if (!tasks || tasks.length === 0) {
        return <div className="h-[30px] w-[30px] rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />;
    }

    const hasCompletedTask = tasks.some(task => task.completed);

    const content = (
        <TooltipContent>
            {tasks.map((task, index) => {
                const Icon = taskIcons[task.type];
                return (
                    <div key={index} className="flex items-center gap-2 py-1">
                        <Icon className="h-4 w-4" />
                        <div>
                            <p className="font-semibold">{task.type}{task.completed ? " (Realizada)" : ""}</p>
                            <p className="text-xs text-muted-foreground">Fecha: {task.date}</p>
                        </div>
                    </div>
                )
            })}
        </TooltipContent>
    );

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn(
                        "relative flex flex-col h-[30px] w-[30px] items-center justify-center rounded-full overflow-hidden shrink-0",
                        hasCompletedTask && "border-2 border-black"
                    )}>
                        {tasks.length === 1 ? (
                            <div className={cn("h-full w-full", taskColors[tasks[0].type])} />
                        ) : (
                            <>
                                <div className={cn("h-1/2 w-full", taskColors[tasks[0].type])} />
                                <div className={cn("h-1/2 w-full", taskColors[tasks[1].type] || 'bg-gray-300')} />
                            </>
                        )}
                        {hasCompletedTask && (
                            <Check className="absolute h-5 w-5 text-white" style={{ filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.5))' }} />
                        )}
                    </div>
                </TooltipTrigger>
                {content}
            </Tooltip>
        </TooltipProvider>
    );
}

export default function MaintenancePage() {
  const { equipmentList, isLoading } = React.useContext(EquipmentContext);
  const [schedule, setSchedule] = React.useState<MaintenanceSchedule[]>([]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    status: '',
    manufacturer: '',
    model: '',
    month: '',
  });
  const [tempFilters, setTempFilters] = React.useState(filters);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageInput, setPageInput] = React.useState(currentPage.toString());
  const itemsPerPage = 10;
  
  React.useEffect(() => {
    if (!isLoading) {
        const initialSchedule = equipmentList
            .filter(eq => eq.status !== 'Dado de Baja')
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((equipment, index) => {
                const monthlyTasks: MonthlyTask[][] = Array(12).fill(0).map(() => []);

                // Mock some data
                if (Math.random() > 0.5) {
                    const month = Math.floor(Math.random() * 12);
                    monthlyTasks[month].push({ type: 'Mtto. Preventivo', date: `2024-${String(month + 1).padStart(2, '0')}-15`, completed: true });
                }
                if (Math.random() > 0.5) {
                    const month = Math.floor(Math.random() * 12);
                    monthlyTasks[month].push({ type: 'Mtto. Preventivo', date: `2024-${String(month + 1).padStart(2, '0')}-10`, completed: false });
                }
                if (Math.random() > 0.7) {
                    const month = Math.floor(Math.random() * 12);
                    monthlyTasks[month].push({ type: 'Calibración', date: `2024-${String(month + 1).padStart(2, '0')}-20`, completed: true });
                }
                
                if (equipment.status === 'Fuera de Servicio') {
                    const currentMonth = new Date().getMonth();
                    monthlyTasks[currentMonth].push({ type: 'Equipo Fuera de Servicio', date: new Date().toISOString().split('T')[0], completed: false });
                }
                
                // Specific example for Analizador de Gases
                if (equipment.name === 'Analizador de Gases en Sangre') {
                    monthlyTasks[5] = [ // June
                        { type: 'Mtto. Preventivo', date: '2024-06-10', completed: true },
                        { type: 'Calibración', date: '2024-06-25', completed: false },
                    ];
                }

                // Specific example for warranty
                if (equipment.name === 'Desfibrilador') {
                    const month = 2; // March
                    monthlyTasks[month].push({ type: 'Equipo en Garantía o Comodato', date: `2024-03-05`, completed: false });
                }

                return {
                    equipmentId: equipment.id,
                    equipmentName: equipment.name,
                    manufacturer: equipment.manufacturer,
                    model: equipment.model,
                    serial: equipment.serial,
                    status: (['A tiempo', 'Próximo a vencer', 'Vencido'] as MaintenanceStatus[])[index % 3],
                    monthlyTasks,
                };
            });
        setSchedule(initialSchedule);
    }
  }, [equipmentList, isLoading]);

  React.useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);
  
  const handleTempFilterChange = (filterName: keyof typeof tempFilters, value: string) => {
    const newFilters = {...tempFilters, [filterName]: value};
      
    if (filterName === 'manufacturer' && value !== tempFilters.manufacturer) {
        newFilters.model = '';
    }
    
    setTempFilters(newFilters);
  };
  
  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    const cleared = {
      status: '',
      manufacturer: '',
      model: '',
      month: '',
    };
    setTempFilters(cleared);
    setFilters(cleared);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const filteredSchedule = React.useMemo(() => {
    let equipment = [...schedule];
    const normalizedSearchTerm = normalizeText(searchTerm);

    if (normalizedSearchTerm) {
        equipment = equipment.filter((item) =>
            normalizeText(item.equipmentName).includes(normalizedSearchTerm) ||
            normalizeText(item.model).includes(normalizedSearchTerm) ||
            normalizeText(item.serial).includes(normalizedSearchTerm)
        );
    }
    
    if (filters.manufacturer) {
      equipment = equipment.filter(item => item.manufacturer === filters.manufacturer);
    }
    if (filters.model) {
      equipment = equipment.filter(item => item.model === filters.model);
    }
    if (filters.status) {
      equipment = equipment.filter(item => item.status === filters.status);
    }
    if (filters.month) {
        const monthIndex = parseInt(filters.month, 10);
        if (!isNaN(monthIndex)) {
            equipment = equipment.filter(item => item.monthlyTasks[monthIndex].length > 0);
        }
    }
    
    return equipment;
  }, [schedule, searchTerm, filters]);


  const availableOptions = React.useMemo(() => {
      const getUniqueValues = <T, K extends keyof T>(list: T[], key: K): string[] => {
          return [...new Set(list.map(item => item[key]))].filter(Boolean) as string[];
      };
      
      const manufacturers = getUniqueValues(schedule, 'manufacturer');
      const models = tempFilters.manufacturer ? getUniqueValues(schedule.filter(i => i.manufacturer === tempFilters.manufacturer), 'model') : getUniqueValues(schedule, 'model');
      const statuses = getUniqueValues(schedule, 'status');

      return {
          manufacturers,
          models,
          statuses,
      };

  }, [schedule, tempFilters.manufacturer]);


  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);
  const paginatedSchedule = filteredSchedule.slice(
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

  const handleExport = () => {
    const dataForExport = filteredSchedule.map(item => {
      const row: {[key: string]: any} = {
        'Equipo': item.equipmentName,
        'Marca': item.manufacturer,
        'Modelo': item.model,
        'Serie': item.serial,
        'Estado Cronograma': item.status,
      };
      
      months.forEach((month, index) => {
        const tasks = item.monthlyTasks[index];
        row[month] = tasks.length > 0 
            ? tasks.map(t => `${t.type}${t.completed ? ' (Realizado)' : ''}`).join('; ')
            : '';
      });
      
      return row;
    });

    if (dataForExport.length === 0) {
      console.warn("No hay datos para exportar.");
      return;
    }

    const worksheet = xlsx.utils.json_to_sheet(dataForExport);

    const columnWidths = Object.keys(dataForExport[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...dataForExport.map(row => String((row as any)[key] || '').length)
      ) + 2
    }));
    worksheet['!cols'] = columnWidths;

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Cronograma");
    
    xlsx.writeFile(workbook, "cronograma_mantenimiento.xlsx");
  };

  const renderTableRows = (data: MaintenanceSchedule[]) => {
    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={17} className="h-24 text-center">
            {isLoading ? 'Cargando equipos...' : 'No se encontraron resultados.'}
          </TableCell>
        </TableRow>
      );
    }
    return data.map((item) => {
      const StatusIcon =
        statusConfig[item.status as keyof typeof statusConfig]?.icon || 'span';
      const statusColor =
        statusConfig[item.status as keyof typeof statusConfig]?.color || '';
      const statusLabel =
        statusConfig[item.status as keyof typeof statusConfig]?.label ||
        item.status;

      return (
        <TableRow key={item.equipmentId}>
          <TableCell className="font-medium text-center">
            {item.equipmentName}
          </TableCell>
          <TableCell className="hidden md:table-cell text-center">
            {item.manufacturer}
          </TableCell>
          <TableCell className="hidden md:table-cell text-center">
            {item.model}
          </TableCell>
          <TableCell className="text-center">{item.serial}</TableCell>
          <TableCell className="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center justify-center`}>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${statusColor}`}
                    >
                      <StatusIcon className="h-5 w-5" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{statusLabel}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          {item.monthlyTasks.map((tasks, index) => (
            <TableCell key={index} className="text-center">
                <div className="flex justify-center items-center">
                  <MonthlyTaskCircle tasks={tasks} />
                </div>
            </TableCell>
          ))}
        </TableRow>
      );
    });
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <main className="grid flex-1 items-start gap-4 md:gap-8">
        <div className="flex items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              CRONOGRAMA DE EQUIPOS
            </h2>
            <p className="text-muted-foreground">
              Planifica y gestiona las tareas de mantenimiento y calibración.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar equipo..."
                className="w-full rounded-lg bg-background pl-8 lg:w-[320px]"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Info className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Convenciones</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Leyenda de Tareas</DialogTitle>
                  <DialogDescription>
                    Colores y símbolos correspondientes a cada tipo de tarea programada.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4">
                  {conventionItems.map(item => (
                      <div key={item.name} className="flex items-center gap-3">
                          <div className={cn("h-5 w-5 rounded-full", item.color, item.name === 'Tarea Realizada' && 'relative flex items-center justify-center bg-muted')}>
                            {item.name === 'Tarea Realizada' && <Check className="h-4 w-4 text-foreground" />}
                          </div>
                          <span className="text-sm font-medium">{item.name}</span>
                      </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1" onClick={() => setTempFilters(filters)}>
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filtrar</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Filtrar Cronograma</DialogTitle>
                  <DialogDescription>Aplica filtros para encontrar tareas específicas.</DialogDescription>
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
                      <div className="grid gap-2">
                        <Label htmlFor="filter-month">Mes</Label>
                         <Combobox
                          options={[{value: '', label: 'Todos los Meses'}, ...monthOptions]}
                          value={tempFilters.month}
                          onChange={(value) => handleTempFilterChange('month', value)}
                          placeholder="Seleccionar mes..."
                          searchPlaceholder="Buscar mes..."
                          emptyPlaceholder="No se encontró el mes."
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
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-1"
              onClick={handleExport}
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-rap">
                Exportar
              </span>
            </Button>
            <Button size="sm" className="h-9 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Programar Tarea
              </span>
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="relative w-full overflow-auto">
              <Table className="w-full min-w-[1200px]" style={{ tableLayout: 'fixed' }}>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary/90">
                    <TableHead
                      className="font-bold text-primary-foreground text-center rounded-tl-lg"
                      style={{ width: '15%' }}
                    >
                      EQUIPO
                    </TableHead>
                    <TableHead
                      className="hidden md:table-cell font-bold text-primary-foreground text-center"
                      style={{ width: '12%' }}
                    >
                      MARCA
                    </TableHead>
                    <TableHead
                      className="hidden md:table-cell font-bold text-primary-foreground text-center"
                      style={{ width: '12%' }}
                    >
                      MODELO
                    </TableHead>
                      <TableHead
                      className="font-bold text-primary-foreground text-center"
                      style={{ width: '11%' }}
                    >
                      SERIE
                    </TableHead>
                    <TableHead
                      className="font-bold text-primary-foreground text-center"
                      style={{ width: '10%' }}
                    >
                      ESTADO
                    </TableHead>
                    {months.map((month, index) => (
                      <TableHead 
                        key={month} 
                        className={cn(
                          "font-bold text-primary-foreground text-center",
                          index === months.length - 1 && "rounded-tr-lg"
                        )} 
                        style={{ width: '4.16%' }}
                      >
                          {month.toUpperCase()}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows(paginatedSchedule)}</TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
              <div>
                {filteredSchedule.length} de {schedule.length} tareas en
                total.
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
