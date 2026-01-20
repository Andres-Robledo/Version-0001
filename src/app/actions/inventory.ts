'use server';

import { forecastEquipmentEOL as forecastEquipmentEOLFlow, type ForecastEquipmentEOLInput } from '@/ai/flows/forecast-equipment-eol';

export async function forecastEquipmentEOL(input: ForecastEquipmentEOLInput) {
    try {
        const result = await forecastEquipmentEOLFlow(input);
        return result;
    } catch (error) {
        console.error("Error en la acción del servidor forecastEquipmentEOL:", error);
        throw new Error("No se pudo obtener el pronóstico EOL de la IA.");
    }
}
