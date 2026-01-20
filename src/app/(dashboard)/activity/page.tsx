import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MOCK_ACTIVITY = [
    {
      equipo: { name: 'Defibrillator D-500', sn: 'DF500-00123' },
      evento: 'Mantenimiento',
      variant: 'outline',
      fecha: '2023-06-23',
    },
    {
      equipo: { name: 'Ultrasound US-X', sn: 'USX-98765' },
      evento: 'Instalado',
      variant: 'secondary',
      fecha: '2023-06-21',
    },
    {
      equipo: { name: 'Ventilator V-3000', sn: 'VEN3K-54321' },
      evento: 'Reparación',
      variant: 'destructive',
      fecha: '2023-06-20',
    },
    {
      equipo: { name: 'ECG Monitor E-10', sn: 'E10-11223' },
      evento: 'Calibración',
      variant: 'outline',
      fecha: '2023-06-19',
    },
    {
        equipo: { name: 'Bomba de Infusión', sn: 'AP801E6V7' },
        evento: 'Dado de Baja',
        variant: 'destructive',
        fecha: '2023-06-18',
    },
    {
        equipo: { name: 'Máquina de Anestesia', sn: 'AC2F7U8' },
        evento: 'Instalado',
        variant: 'secondary',
        fecha: '2023-06-17',
    },
];

export default function ActivityPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Actividad Reciente</h2>
        <div className="flex items-center space-x-2">
          <Button>Exportar</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Eventos</CardTitle>
          <CardDescription>
            Un registro de todos los eventos de mantenimiento y ciclo de vida de los equipos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>Número de Serie</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead className="text-right">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ACTIVITY.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{activity.equipo.name}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.equipo.sn}</TableCell>
                  <TableCell>
                    <Badge variant={activity.variant as any}>{activity.evento}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{activity.fecha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
