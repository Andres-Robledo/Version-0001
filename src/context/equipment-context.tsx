'use client';

import { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { MOCK_EQUIPMENT } from '@/app/(dashboard)/inventory/data';

export type Supply = {
    name: string;
    value: string;
    otherName?: string;
};

export type Characteristic = {
    name: string;
    value: string;
    otherName?: string;
};

export type Accessory = {
    name: string;
    observation: string;
};

export type EquipmentDocument = {
  type: keyof Equipment['requiredDocumentation'];
  name: string;
  date: string;
};

export type Equipment = {
    id: string;
    internalId: string;
    name: string;
    model: string;
    brand: string;
    manufacturer: string;
    serial: string;
    location: string;
    status: 'Activo' | 'Fuera de Servicio' | 'Dado de Baja';
    installationDate: string;
    invima: string;
    risk: 'I' | 'IIa' | 'IIb' | 'III';
    imageUrl: string;
    imageZoom?: number;
    imagePositionX?: number;
    imagePositionY?: number;
    sede: string;
    description: string;
    accessories: Accessory[];
    predominantTechnologies: string[];
    technicalParameters: {
      voltage?: string;
      current?: string;
      power?: string;
      frequency?: string;
      pressure?: string;
      flow?: string;
    };
    supplies: Supply[];
    otherCharacteristics: Characteristic[];
    acquisitionType: string;
    importer: string;
    provider: string;
    acquisitionDate: string;
    price: {
      amount: string;
      currency: 'COP' | 'USD' | 'EUR';
    };
    warranty: string;
    requiredDocumentation: {
        invima: boolean;
        importDeclaration: boolean;
        userManual: boolean;
        serviceManual: boolean;
        quickGuide: boolean;
        other: boolean;
    };
    otherDocumentationDetail: string;
    classificationByUse: string;
    maintenancePeriod: string;
    calibrationPeriod: string;
    documents: EquipmentDocument[];
};

type EquipmentContextType = {
  equipmentList: Equipment[];
  addEquipment: (newEquipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, updatedEquipment: Equipment) => void;
  isLoading: boolean;
  addDocument: (equipmentId: string, document: EquipmentDocument) => void;
  deleteDocument: (equipmentId: string, documentType: keyof Equipment['requiredDocumentation']) => void;
};

export const EquipmentContext = createContext<EquipmentContextType>({
  equipmentList: [],
  addEquipment: () => {},
  updateEquipment: () => {},
  isLoading: true,
  addDocument: () => {},
  deleteDocument: () => {},
});

const initialEquipmentDefaults = {
    internalId: '',
    brand: '',
    description: '',
    accessories: [],
    predominantTechnologies: [],
    technicalParameters: {},
    supplies: [],
    otherCharacteristics: [],
    acquisitionType: 'Compra',
    importer: 'N/A',
    provider: 'N/A',
    acquisitionDate: '',
    price: { amount: '0', currency: 'COP' },
    warranty: 'N/A',
    requiredDocumentation: {
        invima: true,
        importDeclaration: true,
        userManual: true,
        serviceManual: false,
        quickGuide: false,
        other: false,
    },
    otherDocumentationDetail: '',
    classificationByUse: 'Diagnóstico',
    maintenancePeriod: 'Anual',
    calibrationPeriod: 'Anual',
    documents: [],
    imageZoom: 1,
    imagePositionX: 50,
    imagePositionY: 50,
};

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const saveListToLocalStorage = useCallback((list: Equipment[]) => {
    try {
      window.localStorage.setItem('equipment-list', JSON.stringify(list));
    } catch (error) {
      console.error('Failed to save equipment list to localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('equipment-list');
      const parsedList = item ? JSON.parse(item) : null;
      
      if (parsedList && parsedList.length > 0) {
        const migratedList = parsedList.map((eq: Equipment) => ({
          ...initialEquipmentDefaults, // Ensure all defaults are applied even to stored data
          ...eq,
          documents: eq.documents || [],
        }));
        setEquipmentList(migratedList);
      } else {
         const fullMockData = MOCK_EQUIPMENT.map(mock => ({
            ...initialEquipmentDefaults,
            ...mock,
            internalId: mock.id,
            brand: mock.manufacturer, // Use manufacturer for brand
            description: `Descripción detallada para ${mock.name}.`,
         })) as Equipment[];
         setEquipmentList(fullMockData);
         saveListToLocalStorage(fullMockData);
      }
    } catch (error) {
      console.error('Failed to load equipment list from localStorage', error);
      // If parsing fails, fall back to mock data
      const fullMockData = MOCK_EQUIPMENT.map(mock => ({
        ...initialEquipmentDefaults,
        ...mock,
        internalId: mock.id,
        brand: mock.manufacturer,
        description: `Descripción detallada para ${mock.name}.`,
      })) as Equipment[];
      setEquipmentList(fullMockData);
      saveListToLocalStorage(fullMockData);
    } finally {
      setIsLoading(false);
    }
  }, [saveListToLocalStorage]);

  const addEquipment = useCallback((newEquipment: Omit<Equipment, 'id'>) => {
    setEquipmentList(prevList => {
      const newId = `EQP-${Date.now()}`;
      const equipmentToAdd: Equipment = { ...newEquipment, id: newId };
      const newList = [...prevList, equipmentToAdd];
       saveListToLocalStorage(newList);
      return newList;
    });
  }, [saveListToLocalStorage]);

  const updateEquipment = useCallback((id: string, updatedEquipment: Equipment) => {
    setEquipmentList(prevList => {
      const newList = prevList.map(item => 
        item.id === id ? { ...item, ...updatedEquipment, documents: item.documents || [] } : item
      );
      saveListToLocalStorage(newList);
      return newList;
    });
  }, [saveListToLocalStorage]);

  const addDocument = useCallback((equipmentId: string, document: EquipmentDocument) => {
    setEquipmentList(prevList => {
      const newList = prevList.map(item => {
        if (item.id === equipmentId) {
          const otherDocs = (item.documents || []).filter(d => d.type !== document.type);
          return { ...item, documents: [...otherDocs, document] };
        }
        return item;
      });
      saveListToLocalStorage(newList);
      return newList;
    });
  }, [saveListToLocalStorage]);
  
  const deleteDocument = useCallback((equipmentId: string, documentType: keyof Equipment['requiredDocumentation']) => {
    setEquipmentList(prevList => {
      const newList = prevList.map(item => {
        if (item.id === equipmentId) {
          return { ...item, documents: (item.documents || []).filter(d => d.type !== documentType) };
        }
        return item;
      });
      saveListToLocalStorage(newList);
      return newList;
    });
  }, [saveListToLocalStorage]);


  const value = { equipmentList, addEquipment, updateEquipment, isLoading, addDocument, deleteDocument };

  return (
    <EquipmentContext.Provider value={value}>
      {children}
    </EquipmentContext.Provider>
  );
}
