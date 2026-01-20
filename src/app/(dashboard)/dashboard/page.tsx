'use client';

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
import {
  Archive,
  Wrench,
  ShieldAlert,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MaintenanceChart } from './components/maintenance-chart';
import { useContext, useMemo } from 'react';
import { EquipmentContext } from '@/context/equipment-context';

export default function Dashboard() {
  const { equipmentList } = useContext(EquipmentContext);

  const dashboardStats = useMemo(() => {
    const totalEquipment = equipmentList.length;
    const nonCompliant = equipmentList.filter(e => e.status === 'Fuera de Servicio').length;
    
    const upcomingMaintenance = equipmentList.filter(e => {
        const installationDate = new Date(e.installationDate);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return installationDate < oneYearAgo;
    }).length;

    const activeEquipment = equipmentList.filter(e => e.status === 'Activo').length;
    const uptimePercentage = totalEquipment > 0 ? ((activeEquipment / totalEquipment) * 100).toFixed(1) : '0.0';

    return { totalEquipment, nonCompliant, upcomingMaintenance, uptimePercentage };
  }, [equipmentList]);


  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Equipos Totales
            </CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalEquipment}</div>
            <p className="text-xs text-muted-foreground">
              Total de equipos en inventario
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mantenimiento Próximo
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.upcomingMaintenance}</div>
            <p className="text-xs text-muted-foreground">Equipos con más de 1 año</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Equipos no Conformes
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.nonCompliant}</div>
            <p className="text-xs text-muted-foreground">
              Equipos "Fuera de Servicio"
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo de Actividad
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.uptimePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              Basado en equipos activos
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <MaintenanceChart />
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimos eventos del ciclo de vida y mantenimiento de equipos.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/activity">
                Ver Todo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead className="text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Defibrillator D-500</div>
                    <div className="text-sm text-muted-foreground">
                      SN: DF500-00123
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Mantenimiento</Badge>
                  </TableCell>
                  <TableCell className="text-right">2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Ultrasound US-X</div>
                    <div className="text-sm text-muted-foreground">
                      SN: USX-98765
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Instalado</Badge>
                  </TableCell>
                  <TableCell className="text-right">2023-06-21</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Ventilator V-3000</div>
                    <div className="text-sm text-muted-foreground">
                      SN: VEN3K-54321
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">Reparación</Badge>
                  </TableCell>
                  <TableCell className="text-right">2023-06-20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">ECG Monitor E-10</div>
                    <div className="text-sm text-muted-foreground">
                      SN: E10-11223
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Calibración</Badge>
                  </TableCell>
                  <TableCell className="text-right">2023-06-19</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
