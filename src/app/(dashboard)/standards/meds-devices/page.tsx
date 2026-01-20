'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MedsDevicesPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">Estándar 4: Medicamentos y Dispositivos</h1>
        <p className="text-muted-foreground">
          Gestión de la cadena de frío, almacenamiento, dispensación y tecnovigilancia.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Medicamentos y Dispositivos</CardTitle>
          <CardDescription>Cumplimiento del estándar de Medicamentos y Dispositivos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Contenido específico para la gestión de medicamentos y dispositivos.</p>
        </CardContent>
      </Card>
    </div>
  );
}
