'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function OrganizationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold">Gestionar Organizaciones</h1>
            <p className="text-muted-foreground">
            Crea nuevas organizaciones y habilita los estándares que han adquirido.
            </p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Organización
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Organizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Una tabla con todas las organizaciones, sus administradores y los estándares habilitados.</p>
        </CardContent>
      </Card>
    </div>
  );
}
