'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function InfrastructurePage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">Estándar 2: Infraestructura</h1>
        <p className="text-muted-foreground">
          Evaluación de la planta física, mantenimiento y condiciones de seguridad.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Infraestructura</CardTitle>
          <CardDescription>Cumplimiento del estándar de Infraestructura.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Contenido específico para la gestión de la infraestructura.</p>
        </CardContent>
      </Card>
    </div>
  );
}
