'use client';

import { createContext, useState, ReactNode, useEffect, useCallback, useContext } from 'react';
import { ClipboardList, ClipboardCheck, FileSignature, Files, BarChart, ShieldAlert } from 'lucide-react';

// Types for our data structure
export type DocumentFile = {
  id: string;
  name: string;
  size: string;
  date: string;
};

export type DocumentCategory = {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  files: DocumentFile[];
};

const initialDocumentCategories: DocumentCategory[] = [
  {
    id: 'informes',
    icon: BarChart,
    title: 'Informes',
    description: 'Visualiza y exporta informes generados sobre tus equipos.',
    files: [],
  },
  {
    id: 'plan',
    icon: ClipboardList,
    title: 'Planes de Mantenimiento',
    description:
      'Documentos maestros que describen las estrategias y programación de mantenimiento para los equipos.',
    files: [
      {
        id: 'plan-1',
        name: 'Plan-Mantenimiento-2024-v1.2.pdf',
        size: '2.5 MB',
        date: 'Subido el 15 de enero de 2024',
      },
    ],
  },
  {
    id: 'protocolos',
    icon: ClipboardCheck,
    title: 'Procesos de Mantenimiento',
    description:
      'Procedimientos detallados para el mantenimiento preventivo de equipos específicos.',
    files: [
      {
        id: 'proto-1',
        name: 'Protocolo-Desfibriladores-Philips.pdf',
        size: '850 KB',
        date: 'Subido el 20 de noviembre de 2023',
      },
      {
        id: 'proto-2',
        name: 'Protocolo-Ventiladores-Medtronic.pdf',
        size: '1.2 MB',
        date: 'Subido el 22 de noviembre de 2023',
      },
    ],
  },
  {
    id: 'tecnovigilancia',
    icon: ShieldAlert,
    title: 'Tecnovigilancia',
    description: 'Gestiona incidentes y alertas de seguridad de los dispositivos médicos.',
    files: [],
  },
  {
    id: 'contratos',
    icon: FileSignature,
    title: 'Contratos',
    description: 'Carga los diferentes contratos con proveedores para el estándar de dotación.',
    files: [],
  },
  {
    id: 'otros',
    icon: Files,
    title: 'Otros Documentos',
    description:
      'Formatos de inspección, hojas de vida, y otros documentos de cumplimiento.',
    files: [],
  },
];

type DocumentsContextType = {
  categories: DocumentCategory[];
  addFile: (categoryId: string, fileName: string, fileDate: string, fileSize?: number) => void;
  renameFile: (categoryId: string, fileId: string, newName: string) => void;
  deleteFile: (categoryId: string, fileId: string) => void;
};

export const DocumentsContext = createContext<DocumentsContextType>({
  categories: [],
  addFile: (categoryId: string, fileName: string, fileDate: string, fileSize?: number) => {},
  renameFile: () => {},
  deleteFile: () => {},
});

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('document-categories');
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) {
            const storedIds = parsed.map((cat: any) => cat.id);
            const initialIds = initialDocumentCategories.map(cat => cat.id);
            const idsMatch = storedIds.length === initialIds.length && storedIds.every((id, index) => id === initialIds[index]);

            if (!idsMatch) {
                // Stale data or order detected, reset to initial state
                const serializableData = initialDocumentCategories.map(({ icon, ...rest }) => rest);
                window.localStorage.setItem('document-categories', JSON.stringify(serializableData));
                setCategories(initialDocumentCategories);
            } else {
                // Data is fresh, just re-hydrate icons
                const categoriesWithIcons = parsed.map((cat: any) => {
                    const initialCat = initialDocumentCategories.find(c => c.id === cat.id);
                    return { ...cat, icon: initialCat ? initialCat.icon : Files };
                });
                setCategories(categoriesWithIcons);
            }
        } else {
            setCategories(initialDocumentCategories);
        }
      } else {
        const serializableData = initialDocumentCategories.map(({ icon, ...rest }) => rest);
        window.localStorage.setItem('document-categories', JSON.stringify(serializableData));
        setCategories(initialDocumentCategories);
      }
    } catch (error) {
      console.error('Failed to load documents from localStorage', error);
      setCategories(initialDocumentCategories);
    }
  }, []);

  const saveToLocalStorage = useCallback((data: DocumentCategory[]) => {
      try {
        // Strip non-serializable parts like icon components before saving
        const serializableData = data.map(({ icon, ...rest }) => rest);
        window.localStorage.setItem('document-categories', JSON.stringify(serializableData));
      } catch (error) {
          console.error('Failed to save documents to localStorage', error);
      }
  }, []);

  const addFile = useCallback((categoryId: string, fileName: string, fileDate: string, fileSize?: number) => {
    setCategories(prevCategories => {
        const newCategories = prevCategories.map(category => {
            if (category.id === categoryId) {
                const formatBytes = (bytes: number, decimals = 2) => {
                    if (!+bytes) return '0 Bytes'
                    const k = 1024
                    const dm = decimals < 0 ? 0 : decimals
                    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
                    const i = Math.floor(Math.log(bytes) / Math.log(k))
                    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
                }
                const newFile: DocumentFile = {
                    id: `file-${Date.now()}-${Math.random()}`,
                    name: fileName,
                    size: fileSize ? formatBytes(fileSize) : `${(Math.random() * 3).toFixed(1)} MB`,
                    date: `Subido el ${new Date(fileDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                };
                return { ...category, files: [...category.files, newFile] };
            }
            return category;
        });
        saveToLocalStorage(newCategories);
        return newCategories;
    });
  }, [saveToLocalStorage]);

  const renameFile = useCallback((categoryId: string, fileId: string, newName: string) => {
    setCategories(prevCategories => {
        const newCategories = prevCategories.map(category => {
            if (category.id === categoryId) {
                const newFiles = category.files.map(file =>
                    file.id === fileId ? { ...file, name: newName } : file
                );
                return { ...category, files: newFiles };
            }
            return category;
        });
        saveToLocalStorage(newCategories);
        return newCategories;
    });
  }, [saveToLocalStorage]);

  const deleteFile = useCallback((categoryId: string, fileId: string) => {
    setCategories(prevCategories => {
        const newCategories = prevCategories.map(category => {
            if (category.id === categoryId) {
                const newFiles = category.files.filter(file => file.id !== fileId);
                return { ...category, files: newFiles };
            }
            return category;
        });
        saveToLocalStorage(newCategories);
        return newCategories;
    });
  }, [saveToLocalStorage]);

  return (
    <DocumentsContext.Provider value={{ categories, addFile, renameFile, deleteFile }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export const useDocuments = () => useContext(DocumentsContext);
