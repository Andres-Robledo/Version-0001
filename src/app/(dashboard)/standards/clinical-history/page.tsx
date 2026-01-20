'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ClinicalHistoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">Estándar 6: Historia Clínica</h1>
        <p className="text-muted-foreground">
          Custodia, confidencialidad y accesibilidad de los registros de atención.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Historia Clínica</CardTitle>
          <CardDescription>Cumplimiento del estándar de Historia Clínica.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Contenido específico para la gestión de la historia clínica.</p>
        </CardContent>
      </Card>
    </div>
  );
}
