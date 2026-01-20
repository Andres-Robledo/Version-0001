'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ManageUsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold">Gestionar Usuarios</h1>
            <p className="text-muted-foreground">
            Añade, edita o elimina los usuarios de tu organización.
            </p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Invitar Usuario
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Usuarios de Mi Organización</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Una tabla con los usuarios de esta organización, sus roles (Técnico, Visualizador) y la opción para gestionarlos.</p>
        </CardContent>
      </Card>
    </div>
  );
}
