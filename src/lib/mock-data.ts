import { Organization, User, Equipment, MaintenanceRecord } from './definitions';

export const ALL_ORGANIZATIONS: Organization[] = [
  {
    id: 'super_admin_org',
    name: 'Administración Global',
    customization: {},
    enabledStandards: [],
  },
  {
    id: 'org_hospital_san_vicente',
    name: 'Hospital San Vicente',
    customization: {
      logoUrl: '/logos/hospital_san_vicente.png',
    },
    enabledStandards: ['standard_1', 'standard_2', 'standard_3', 'standard_4', 'standard_5', 'standard_6', 'standard_7'],
  },
];

export const ALL_USERS: User[] = [
  {
    id: 'owner_user',
    email: 'owner@demo.com',
    name: 'Administrador Principal',
    organizationId: 'super_admin_org',
    role: 'OWNER',
  },
  {
    id: 'hospital_admin_user',
    email: 'admin@sanvicente.com',
    name: 'Admin Hospital',
    organizationId: 'org_hospital_san_vicente',
    role: 'ORG_ADMIN',
  },
];

export const ALL_EQUIPMENT: Equipment[] = [
  {
    id: 'EQP-019',
    organizationId: 'org_hospital_san_vicente',
    name: 'Analizador de Gases en Sangre',
    model: 'ABL90 FLEX PLUS',
    manufacturer: 'Radiometer',
    serial: 'ABL90X1Y2',
    location: 'Laboratorio de Urgencias',
    status: 'Activo',
    installationDate: '2023-06-30',
    maintenancePeriod: 'Anual', // Tarea visible en el futuro
    calibrationPeriod: 'Anual', // Tarea visible en el futuro
  },
  {
    id: 'EQP-020',
    organizationId: 'org_hospital_san_vicente',
    name: 'Aspirador de Secreciones',
    model: 'Vacu-Aide QSU',
    manufacturer: 'DeVilbiss',
    serial: 'VAQSUY2Z3',
    location: 'Terapia Respiratoria',
    status: 'Activo',
    installationDate: '2023-02-01',
    maintenancePeriod: 'Anual', // Tarea en FEB
    calibrationPeriod: 'No Aplica',
  },
    {
    id: 'EQP-015',
    organizationId: 'org_hospital_san_vicente',
    name: 'Autoclave de Vapor',
    model: '44B',
    manufacturer: 'Tuttnauer',
    serial: 'T44B6T7U8',
    location: 'Central de Esterilización',
    status: 'Activo',
    installationDate: '2023-05-15',
    maintenancePeriod: 'Anual', // Tarea en MAY
    calibrationPeriod: 'No Aplica',
  },
  {
    id: 'EQP-009',
    organizationId: 'org_hospital_san_vicente',
    name: 'Bisturí Eléctrico',
    model: 'Valleylab FT10',
    manufacturer: 'Medtronic',
    serial: 'VLFT10J9K0',
    location: 'Quirófano 2',
    status: 'Activo',
    installationDate: '2022-07-18',
    maintenancePeriod: 'Anual',
    calibrationPeriod: 'No Aplica',
  },
  {
    id: 'EQP-012',
    organizationId: 'org_hospital_san_vicente',
    name: 'Cama Hospitalaria Eléctrica',
    model: 'Centrella Smart+ Bed',
    manufacturer: 'Hill-Rom',
    serial: 'CENSMN3P4',
    location: 'Piso 3, Hab 301',
    status: 'Activo',
    installationDate: '2023-04-01', // Tarea en ABR
    maintenancePeriod: 'Semestral',
    calibrationPeriod: 'No Aplica',
  },
  {
    id: 'EQP-014',
    organizationId: 'org_hospital_san_vicente',
    name: 'Centrífuga de Laboratorio',
    model: 'Allegra X-15R',
    manufacturer: 'Beckman Coulter',
    serial: 'AX15R5S6T7',
    location: 'Laboratorio Clínico',
    status: 'Activo',
    installationDate: '2023-02-15', // Tarea en FEB
    maintenancePeriod: 'Anual',
    calibrationPeriod: 'Semestral',
  },
  {
    id: 'eq_001', // ID Antiguo para mantener la consistencia con el error solucionado
    organizationId: 'org_hospital_san_vicente',
    name: 'Desfibrilador',
    manufacturer: 'Philips',
    model: 'HeartStart XL+',
    serial: 'DE451A2Z3',
    location: 'UCI Adultos',
    status: 'Activo',
    installationDate: '2023-06-01', // Tarea en JUN
    maintenancePeriod: 'Semestral', // Genera tarea en JUN y DIC
    calibrationPeriod: 'Anual', // Genera tarea en JUN
  },
  {
    id: 'EQP-008',
    organizationId: 'org_hospital_san_vicente',
    name: 'Electrocardiógrafo Portátil',
    model: 'PageWriter TC20',
    manufacturer: 'Philips',
    serial: 'PWTC2H8J9',
    location: 'Ambulancia 1',
    status: 'Activo',
    installationDate: '2023-11-01', // Tarea en NOV
    maintenancePeriod: 'Anual',
    calibrationPeriod: 'No Aplica',
  },
  {
    id: 'EQP-018',
    organizationId: 'org_hospital_san_vicente',
    name: 'Endoscopio Flexible',
    model: 'GIF-1TH190',
    manufacturer: 'Olympus',
    serial: 'GF1THW0X1',
    location: 'Gastroenterología',
    status: 'Activo',
    installationDate: '2023-02-01', // Tarea en FEB y AGO
    maintenancePeriod: 'Semestral',
    calibrationPeriod: 'No Aplica',
  },
  {
    id: 'EQP-017',
    organizationId: 'org_hospital_san_vicente',
    name: 'Equipo de Rayos X Móvil',
    model: 'Mobilett Elara Max',
    manufacturer: 'Siemens Healthineers',
    serial: 'MEMAXV9W0',
    location: 'Unidad Móvil',
    status: 'Activo',
    installationDate: '2023-09-01', // Tarea en SEP
    maintenancePeriod: 'Bimestral', // Genera varias tareas
  },
];

export const ALL_MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  {
      id: 'maint_008',
      equipmentId: 'EQP-019', // Analizador de Gases
      organizationId: 'org_hospital_san_vicente',
      date: '2024-05-18',
      type: 'Correctivo',
      description: 'Cambio de membrana de electrodo de pH.',
      technicianName: 'Luisa Fernanda',
  },
  {
      id: 'maint_009',
      equipmentId: 'EQP-015', // Autoclave
      organizationId: 'org_hospital_san_vicente',
      date: '2024-05-21',
      type: 'Preventivo',
      description: 'Revisión anual y cambio de empaques de puerta.',
      technicianName: 'Carlos Vargas',
  },
  {
      id: 'maint_010',
      equipmentId: 'EQP-012', // Cama Hospitalaria
      organizationId: 'org_hospital_san_vicente',
      date: '2024-03-20',
      type: 'Correctivo',
      description: 'Ajuste de motor de inclinación.',
      technicianName: 'Ricardo Poveda',
  },
  {
      id: 'maint_011',
      equipmentId: 'EQP-008', // Electrocardiógrafo
      organizationId: 'org_hospital_san_vicente',
      date: '2024-12-05',
      type: 'Preventivo',
      description: 'Verificación de respuesta de frecuencia y filtros.',
      technicianName: 'Ana Torres',
  },
  {
      id: 'maint_012',
      equipmentId: 'EQP-018', // Endoscopio
      organizationId: 'org_hospital_san_vicente',
      date: '2024-02-11',
      type: 'Preventivo',
      description: 'Limpieza de lentes y verificación de canales.',
      technicianName: 'Carlos Vargas',
  },
   {
      id: 'maint_013',
      equipmentId: 'EQP-017', // Rayos X movil
      organizationId: 'org_hospital_san_vicente',
      date: '2024-07-07',
      type: 'Preventivo',
      description: 'Mantenimiento bimestral.',
      technicianName: 'Ricardo Poveda',
  },
  {
    id: 'maint_014',
    equipmentId: 'EQP-019',
    organizationId: 'org_hospital_san_vicente',
    date: '2024-06-30',
    type: 'Preventivo',
    description: 'Mantenimiento preventivo anual completado.',
    technicianName: 'Sistema IA',
  }
];
