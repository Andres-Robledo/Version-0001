'use server';

/**
 * @fileOverview Un agente de IA para evaluación y sugerencia de cumplimiento.
 *
 * - suggestComplianceActions - Una función que maneja el proceso de sugerencia de cumplimiento.
 * - SuggestComplianceActionsInput - El tipo de entrada para la función suggestComplianceActions.
 * - SuggestComplianceActionsOutput - El tipo de retorno para la función suggestComplianceActions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// NUEVO: Esquema para una sola acción de cumplimiento.
const ComplianceActionSchema = z.object({
  actionTitle: z.string().describe('Título breve y claro de la acción de cumplimiento sugerida (ej. "Calibración Vencida", "Falta Hoja de Vida").'),
  relatedEquipment: z.string().describe('El nombre y serial del equipo o equipos a los que se aplica esta acción.'),
  justification: z.string().describe('Explicación detallada de por qué esta acción es necesaria, citando el estándar o requisito específico de la Resolución 3100 que no se está cumpliendo.'),
  suggestedAction: z.string().describe('Descripción clara y concisa de los pasos a seguir para resolver el problema y lograr el cumplimiento.'),
  priority: z.enum(['Alta', 'Media', 'Baja']).describe('La urgencia de la acción (Alta, Media o Baja).'),
});


const SuggestComplianceActionsInputSchema = z.object({
  equipmentData: z.string().describe('Los datos del equipo, incluyendo detalles como fabricante, modelo, número de serie, ubicación y estado.'),
  maintenanceRecords: z.string().describe('Los registros de mantenimiento para cada equipo, incluyendo fechas de vencimiento, personal asignado y listas de tareas.'),
  resolution3100Requirements: z.string().describe('Los requisitos de la Resolución 3100 de 2009 en Colombia.'),
});
export type SuggestComplianceActionsInput = z.infer<typeof SuggestComplianceActionsInputSchema>;

// MODIFICADO: El esquema de salida ahora contiene una evaluación y un array de acciones estructuradas.
const SuggestComplianceActionsOutputSchema = z.object({
  complianceAssessment: z.string().describe('Una evaluación general y concisa del estado de cumplimiento actual basada en los datos proporcionados.'),
  suggestedActions: z.array(ComplianceActionSchema).describe('Un array de acciones correctivas sugeridas para asegurar el cumplimiento con la Resolución 3100. Si todo está en orden, devuelve un array vacío [].'),
});
export type SuggestComplianceActionsOutput = z.infer<typeof SuggestComplianceActionsOutputSchema>;

export async function suggestComplianceActions(input: SuggestComplianceActionsInput): Promise<SuggestComplianceActionsOutput> {
  return suggestComplianceActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestComplianceActionsPrompt',
  input: {schema: SuggestComplianceActionsInputSchema},
  output: {schema: SuggestComplianceActionsOutputSchema},
  // MODIFICADO: Instrucciones más claras para la IA, pidiendo un array de objetos.
  prompt: `Eres un experto oficial de cumplimiento especializado en la Resolución 3100 de 2009 en Colombia.

Analizarás los datos de equipos y registros de mantenimiento proporcionados para identificar incumplimientos.

Datos del Equipo: {{{equipmentData}}}
Registros de Mantenimiento: {{{maintenanceRecords}}}
Requisitos de la Resolución 3100: {{{resolution3100Requirements}}}

Basado en esta información, proporciona:
1.  En 'complianceAssessment', una evaluación general y muy breve del estado de cumplimiento.
2.  En 'suggestedActions', un array de objetos JSON con las acciones correctivas. Cada objeto debe tener: { actionTitle: string, relatedEquipment: string, justification: string, suggestedAction: string, priority: 'Alta'|'Media'|'Baja' }.
Si no encuentras ningún problema de cumplimiento, devuelve un array vacío [].
`,
});

const suggestComplianceActionsFlow = ai.defineFlow(
  {
    name: 'suggestComplianceActionsFlow',
    inputSchema: SuggestComplianceActionsInputSchema,
    outputSchema: SuggestComplianceActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
