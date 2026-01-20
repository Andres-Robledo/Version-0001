'use server';

/**
 * @fileOverview Un flujo para pronosticar las fechas de fin de vida útil (EOL) del equipo.
 *
 * Este archivo exporta:
 * - `forecastEquipmentEOL`: Una función asíncrona que pronostica la fecha de EOL de un equipo.
 * - `ForecastEquipmentEOLInput`: La interfaz TypeScript que define el esquema de entrada para la función `forecastEquipmentEOL`.
 * - `ForecastEquipmentEOLOutput`: La interfaz TypeScript que define el esquema de salida para la función `forecastEquipmentEOL`.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastEquipmentEOLInputSchema = z.object({
  equipmentName: z.string().describe('El nombre del equipo.'),
  manufacturer: z.string().describe('El fabricante del equipo.'),
  model: z.string().describe('El modelo del equipo.'),
  installationDate: z
    .string()
    .describe(
      'La fecha de instalación del equipo, en formato ISO 8601 (YYYY-MM-DD).'
    ),
  usageFrequency: z
    .string()
    .describe(
      'La frecuencia de uso típica del equipo (p. ej., diaria, semanal, mensual).'
    ),
  maintenanceHistory: z
    .string()
    .describe(
      'Un resumen del historial de mantenimiento del equipo, incluyendo reparaciones y actualizaciones.'
    ),
});
export type ForecastEquipmentEOLInput = z.infer<typeof ForecastEquipmentEOLInputSchema>;

const ForecastEquipmentEOLOutputSchema = z.object({
  predictedEOLDate: z
    .string()
    .describe(
      'La fecha de fin de vida útil predicha para el equipo, en formato ISO 8601 (YYYY-MM-DD).'
    ),
  confidenceLevel: z
    .string()
    .describe(
      'Una medida cualitativa de la confianza en la predicción (p. ej., alta, media, baja).'
    ),
  justification: z
    .string()
    .describe(
      'Una breve explicación de los factores que contribuyen a la fecha de EOL predicha.'
    ),
});
export type ForecastEquipmentEOLOutput = z.infer<typeof ForecastEquipmentEOLOutputSchema>;

export async function forecastEquipmentEOL(
  input: ForecastEquipmentEOLInput
): Promise<ForecastEquipmentEOLOutput> {
  return forecastEquipmentEOLFlow(input);
}

const forecastEquipmentEOLPrompt = ai.definePrompt({
  name: 'forecastEquipmentEOLPrompt',
  input: {schema: ForecastEquipmentEOLInputSchema},
  output: {schema: ForecastEquipmentEOLOutputSchema},
  prompt: `Eres un ingeniero biomédico experimentado encargado de pronosticar la fecha de fin de vida útil (EOL) para equipos médicos. Basado en la información proporcionada, predice cuándo es probable que el equipo necesite ser reemplazado.

  Nombre del Equipo: {{{equipmentName}}}
  Fabricante: {{{manufacturer}}}
  Modelo: {{{model}}}
  Fecha de Instalación: {{{installationDate}}}
  Frecuencia de Uso: {{{usageFrequency}}}
  Historial de Mantenimiento: {{{maintenanceHistory}}}

  Considera factores como la antigüedad del equipo, los patrones de uso, el registro de mantenimiento y los estándares de la industria para equipos similares. Proporciona una fecha de EOL predicha, un nivel de confianza (alto, medio o bajo) para tu predicción y una breve justificación.`,
});

const forecastEquipmentEOLFlow = ai.defineFlow(
  {
    name: 'forecastEquipmentEOLFlow',
    inputSchema: ForecastEquipmentEOLInputSchema,
    outputSchema: ForecastEquipmentEOLOutputSchema,
  },
  async input => {
    const {output} = await forecastEquipmentEOLPrompt(input);
    return output!;
  }
);
