'use client';

import { useState, useContext } from 'react';
import { AlertTriangle, Bot, CheckCircle2, Loader2 } from 'lucide-react';

import { suggestComplianceActions } from '@/app/actions/compliance';
import type { SuggestComplianceActionsOutput } from '@/ai/flows/suggest-compliance-actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EquipmentContext } from '@/context/equipment-context';
import { ALL_MAINTENANCE_RECORDS } from '@/lib/mock-data';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ComplianceAssessor() {
  const { equipmentList, isLoading: isEquipmentLoading } = useContext(EquipmentContext);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestComplianceActionsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleComplianceCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await suggestComplianceActions(equipmentList, ALL_MAINTENANCE_RECORDS);
      setResult(res);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = loading || isEquipmentLoading;

  return (
    <Card className="min-h-[400px]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Evaluación de Cumplimiento con IA</CardTitle>
            <CardDescription>
              Analiza todos los datos de equipos y mantenimiento contra los requisitos de la Resolución 3100.
            </CardDescription>
          </div>
          <Button onClick={handleComplianceCheck} disabled={isButtonDisabled}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bot className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Analizando...' : 'Ejecutar Evaluación con IA'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center p-10 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-4 text-lg">Analizando datos de cumplimiento...</span>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {result && (
          <div className="grid gap-6">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Evaluación General</AlertTitle>
              <AlertDescription>
                {result.complianceAssessment}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <h3 className="mb-2 text-lg font-semibold">Acciones Correctivas Sugeridas</h3>
              {result.suggestedActions.length > 0 ? (
                <ScrollArea className="h-[40vh] pr-4">
                  <div className="space-y-4">
                  {result.suggestedActions.map((action, index) => (
                    <Card key={index} className="bg-muted/50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{action.actionTitle}</CardTitle>
                        <CardDescription className="text-xs">Prioridad: {action.priority} | Equipo: {action.relatedEquipment}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-semibold text-foreground">Justificación:</span> {action.justification}
                        </p>
                        <Alert className="border-primary/50 bg-primary/5">
                           <Bot className="h-4 w-4" />
                           <AlertTitle className="text-primary">Sugerencia</AlertTitle>
                           <AlertDescription className="text-primary/90">{action.suggestedAction}</AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-green-500/50 bg-green-500/5 p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                  <h3 className="mt-4 text-lg font-semibold">¡Todo en Orden!</h3>
                  <p className="mt-1 text-sm text-muted-foreground">No se identificaron acciones de cumplimiento necesarias en este momento.</p>
                </div>
              )}
            </div>
          </div>
        )}
        {!loading && !result && !error && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-10 text-center">
                <Bot className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Listo para evaluar el cumplimiento</h3>
                <p className="mt-1 text-sm text-muted-foreground">Haz clic en el botón para iniciar el análisis de todos los equipos.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
