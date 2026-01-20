'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function PriorityProcessesPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">Estándar 5: Procesos Prioritarios</h1>
        <p className="text-muted-foreground">
          Documentación y seguimiento de guías de práctica clínica y protocolos de atención.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Procesos Prioritarios</CardTitle>
          <CardDescription>Cumplimiento del estándar de Procesos Prioritarios.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Contenido específico para la gestión de procesos prioritarios.</p>
        </CardContent>
      </Card>
    </div>
  );
}
