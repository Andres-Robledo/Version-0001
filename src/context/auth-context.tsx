'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Organization } from '@/lib/definitions';

// --- Datos Simulados (TEMPORAL) ---
const ADMINISTRADOR_ORG: Organization = {
  id: 'org_admin',
  name: 'Plataforma 3100 Administradores',
  customization: {},
  enabledStandards: STANDARDS.map(s => s.id),
};

const CLIENT_ORG: Organization = {
  id: 'org_client_123',
  name: 'Clínica Las Américas',
  customization: {
    logoUrl: '/logo-novamed.png',
  },
  enabledStandards: ['standard_1', 'standard_3', 'standard_5'],
};

const ADMINISTRADOR_USER: User = {
  id: 'user_admin_global_001',
  name: 'Administrador Principal',
  email: 'admin@plataforma3100.com',
  organizationId: ADMINISTRADOR_ORG.id,
  role: 'ADMINISTRADOR',
};

const ADMIN_USER: User = {
  id: 'user_admin_001',
  name: 'Dr. Juan Pérez',
  email: 'admin@clinicalasamericas.com',
  organizationId: CLIENT_ORG.id,
  role: 'ORG_ADMIN',
};

// --- Definición del Contexto ---
interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  login: (role: 'ADMINISTRADOR' | 'ORG_ADMIN') => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Proveedor del Contexto ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((role: 'ADMINISTRADOR' | 'ORG_ADMIN') => {
    let userToLogin: User;
    let orgToLogin: Organization;

    if (role === 'ADMINISTRADOR') {
      userToLogin = ADMINISTRADOR_USER;
      orgToLogin = ADMINISTRADOR_ORG;
    } else {
      userToLogin = ADMIN_USER;
      orgToLogin = CLIENT_ORG;
    }
    
    setUser(userToLogin);
    setOrganization(orgToLogin);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setOrganization(null);
  }, []);

  const value = { user, organization, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Hook para usar el contexto fácilmente ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Re-exportamos los estándares para fácil acceso
import { STANDARDS } from '@/lib/definitions';
