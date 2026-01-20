'use client';

import type { ForecastEquipmentEOLOutput } from '@/ai/flows/forecast-equipment-eol';
import { forecastEquipmentEOL } from '@/app/actions/inventory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, CalendarCheck, HelpCircle, Loader2, Zap } from 'lucide-react';
import { useState } from 'react';

type Equipment = {
    id: string;
    name: string;
    model: string;
    manufacturer: string;
    serial: string;
    location: string;
    status: string;
    installationDate: string;
};

export function EOLForecaster({ equipment }: { equipment: Equipment }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForecastEquipmentEOLOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleForecast = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await forecastEquipmentEOL({
        equipmentName: equipment.name,
        manufacturer: equipment.manufacturer,
        model: equipment.model,
        installationDate: equipment.installationDate,
        usageFrequency: 'Diaria', // Mock data
        maintenanceHistory: 'Mantenimiento preventivo anual realizado. Se reemplazó la batería en 2023.', // Mock data
      });
      setResult(res);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pronóstico de Fin de Vida Útil (EOL)</CardTitle>
        <CardDescription>Usa IA para predecir cuándo el equipo necesitará ser reemplazado.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!result && !loading && !error && (
             <div className="text-center p-3 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2">
                <Zap className="h-8 w-8 text-muted-foreground" />
                <p className="text-base text-muted-foreground max-w-xs mx-auto">Obtén una predicción de EOL basada en los datos del equipo y su historial.</p>
                <Button onClick={handleForecast} disabled={loading} size="sm">
                    {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Bot className="mr-2 h-4 w-4" />
                    )}
                    Pronosticar con IA
                </Button>
            </div>
        )}

        {loading && (
          <div className="flex items-center justify-center p-6 min-h-[190px]">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-3">Generando pronóstico...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
            <div className="space-y-3">
                <div className="p-3 bg-accent/30 rounded-lg text-center">
                    <p className="text-sm font-medium text-muted-foreground">Fecha EOL Predicha</p>
                    <p className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                        <CalendarCheck className="h-6 w-6" />
                        {result.predictedEOLDate}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Confianza: <span className="font-semibold">{result.confidenceLevel}</span>
                    </p>
                </div>
                 <Alert>
                    <HelpCircle className="h-4 w-4" />
                    <AlertTitle>Justificación</AlertTitle>
                    <AlertDescription>
                        {result.justification}
                    </AlertDescription>
                </Alert>
                <Button onClick={handleForecast} disabled={loading} variant="outline" size="sm" className="w-full">
                    {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Bot className="mr-2 h-4 w-4" />
                    )}
                    Volver a Pronosticar
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
