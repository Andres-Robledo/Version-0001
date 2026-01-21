'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">Panel de Administrador</h1>
        <p className="text-muted-foreground">
          Desde aquí puedes gestionar las organizaciones y la configuración global de la plataforma.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido Andres</CardTitle>
          <CardDescription>Esta es tu vista de administrador principal.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Estadísticas globales, estado del sistema y más.</p>
        </CardContent>
      </Card>
    </div>
  );
}
