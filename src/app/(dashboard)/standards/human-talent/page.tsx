'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function HumanTalentPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">Estándar 1: Talento Humano</h1>
        <p className="text-muted-foreground">
          Gestión de personal, hojas de vida, capacitaciones y competencias.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Talento Humano</CardTitle>
          <CardDescription>Cumplimiento del estándar de Talento Humano.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Contenido específico para la gestión del talento humano.</p>
        </CardContent>
      </Card>
    </div>
  );
}
