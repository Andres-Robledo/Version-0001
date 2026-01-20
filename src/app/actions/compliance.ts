'use server';

import { suggestComplianceActions as suggestComplianceActionsFlow } from '@/ai/flows/suggest-compliance-actions';
import { Equipment, MaintenanceRecord } from '@/lib/definitions';

// El resumen detallado de la Resolución 3100 que la IA usará como referencia.
const resolution3100Requirements = `
**Resumen de Criterios de Habilitación - Resolución 3100 de 2019**

**Estándar 1: Talento Humano**
- El personal debe contar con los títulos y certificaciones requeridas para los servicios prestados.
- Debe existir un programa de educación continua, así como registros de inducción y reinducción.
- Los perfiles y roles deben estar formalmente definidos.

**Estándar 2: Infraestructura**
- Las áreas y ambientes deben cumplir con las condiciones de seguridad y espacio para el número de usuarios atendidos.
- Plan de mantenimiento de la planta física documentado y con registros de ejecución.
- Disponibilidad garantizada de servicios públicos esenciales (agua, energía, comunicaciones).
- En áreas con equipos de radiación ionizante, debe existir una licencia de práctica médica y un concepto favorable del estudio radiofísico.
- Accesibilidad para personas con movilidad reducida.

**Estándar 3: Dotación y Mantenimiento**
- Disponibilidad de los equipos biomédicos necesarios para los servicios ofertados.
- **Hoja de vida (Ficha Técnica)** para cada equipo, con información clave: marca, modelo, serie, registro INVIMA, clasificación de riesgo, etc.
- **Plan de mantenimiento documentado** que incluya cronogramas de mantenimientos preventivos y calibraciones, siguiendo las recomendaciones del fabricante.
- **Registros de mantenimiento ejecutados** deben estar disponibles, detallando la fecha, persona que lo realizó y descripción de la actividad.
- Equipos deben estar calibrados si aplica, con certificados vigentes.

**Estándar 4: Medicamentos, Dispositivos Médicos e Insumos**
- Procedimientos documentados para todo el ciclo: selección, adquisición, transporte, almacenamiento, distribución, dispensación y desecho.
- Control de fechas de vencimiento y condiciones de almacenamiento (temperatura, humedad, luz) según especificaciones del fabricante.
- Implementación de programas de Farmacovigilancia y Tecnovigilancia para reportar incidentes adversos.

**Estándar 5: Procesos Prioritarios**
- Existencia y socialización de guías de práctica clínica y protocolos para los principales procesos asistenciales.
- Implementación de un Programa de Seguridad del Paciente que incluya la gestión de eventos adversos.
- Protocolos de higiene, desinfección y esterilización estandarizados y verificables.

**Estándar 6: Historia Clínica y Registros**
- Adopción de un formato de historia clínica único e integrado.
- Los registros deben ser completos, legibles, oportunos y confidenciales.
- Políticas claras sobre el archivo, custodia y tiempo de conservación de las historias clínicas.

**Estándar 7: Interdependencia de Servicios**
- Si se contratan servicios de apoyo (ej. laboratorio, imágenes diagnósticas, ambulancia), deben existir contratos escritos que definan responsabilidades.
- El prestador debe verificar que los servicios contratados estén debidamente habilitados y cumplan con los estándares de calidad.
`;

/**
 * Llama al flujo de IA para sugerir acciones de cumplimiento.
 * Esta función ahora acepta los datos del equipo y mantenimiento directamente,
 * y los formatea para ser enviados al flujo de IA junto con el contexto de la norma.
 */
export async function suggestComplianceActions(
    equipmentList: Equipment[],
    maintenanceRecords: MaintenanceRecord[]
) {
    // Formatear los datos para que la IA los entienda fácilmente
    const equipmentData = equipmentList.map(e => 
        `- ${e.name} (ID: ${e.id}, Serie: ${e.serial}, Riesgo: ${e.risk}, Estado: ${e.status}, Ubicación: ${e.location})`
    ).join('\n');

    const maintenanceData = maintenanceRecords.map(r => 
        `- Equipo ID ${r.equipmentId}: ${r.type} el ${r.date}. Descripción: ${r.description}`
    ).join('\n');

    try {
        // Llamar al flujo de IA con los datos reales y el contexto normativo completo
        const result = await suggestComplianceActionsFlow({
            equipmentData,
            maintenanceRecords: maintenanceData,
            resolution3100Requirements
        });
        return result;
    } catch (error) {
        console.error("Error en la acción del servidor suggestComplianceActions:", error);
        // En un caso real, sería bueno retornar un error más descriptivo para el cliente.
        throw new Error("No se pudieron obtener las sugerencias de cumplimiento de la IA.");
    }
}
