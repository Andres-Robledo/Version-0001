// src/lib/definitions.ts

/**
 * Representa una organización o empresa que utiliza la plataforma.
 * Cada organización tendrá sus datos completamente aislados.
 */
export interface Organization {
  id: string; // Identificador único (ej. "org_123")
  name: string; // Nombre de la organización (ej. "Clínica Central")
  
  // Opciones de personalización para la marca de la organización
  customization: {
    logoUrl?: string; // URL del logo personalizado
  };
  
  // Lista de estándares (módulos) habilitados según la suscripción del cliente
  enabledStandards: string[]; // ej. ['standard_1', 'standard_3']
}

/**
 * Representa a un usuario de la plataforma.
 * Cada usuario pertenece a una única organización.
 */
export interface User {
  id: string; // Identificador único del usuario (ej. "user_abc")
  email: string; // Email del usuario, para iniciar sesión
  name: string;
  organizationId: string; // Enlace a la organización a la que pertenece
  role: 'ADMINISTRADOR' | 'ORG_ADMIN' | 'TECH' | 'VIEWER'; // Roles definidos
  
  // ID del usuario que creó esta cuenta (relevante para sub-usuarios)
  createdBy?: string; 
}

// Definimos los posibles estándares de la Resolución 3100
export const STANDARDS = [
  { id: 'standard_1', name: 'Talento Humano' },
  { id: 'standard_2', name: 'Infraestructura' },
  { id: 'standard_3', name: 'Dotación y Mantenimiento' },
  { id: 'standard_4', name: 'Medicamentos y Dispositivos Médicos' },
  { id: 'standard_5', name: 'Procesos Prioritarios' },
  { id: 'standard_6', name: 'Historia Clínica' },
  { id: 'standard_7', name: 'Interdependencia de Servicios' },
];

/**
 * Representa una acción de cumplimiento sugerida por la IA.
 */
export interface ComplianceAction {
  actionTitle: string;      // Título de la acción (ej. "Calibración Vencida")
  relatedEquipment: string; // Equipo(s) al que se aplica
  justification: string;    // Por qué se necesita esta acción
  suggestedAction: string;  // Qué hacer para solucionarlo
  priority: 'Alta' | 'Media' | 'Baja'; // Prioridad de la acción
}

/**
 * Representa un registro de mantenimiento para un equipo.
 */
export interface MaintenanceRecord {
    id: string; // ej. "maint_001"
    equipmentId: string; // ID del equipo al que pertenece
    organizationId: string; // ID de la organización
    date: string; // Fecha en formato ISO (ej. "2023-10-27")
    type: 'Preventivo' | 'Correctivo' | 'Predictivo' | 'Metrología' | 'Inspección';
    description: string; // Descripción de lo realizado
    technicianName: string; // Nombre del técnico
}
