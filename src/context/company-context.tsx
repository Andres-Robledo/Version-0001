'use client';

import { createContext, useState, ReactNode, useEffect, useCallback } from 'react';

type CompanyInfo = {
  name: string;
  logo: string | null;
  icon: string | null;
  address: string;
  nit: string;
  phone: string;
  city: string;
};

type CompanyContextType = {
  companyName: string;
  companyLogo: string | null;
  companyIcon: string | null;
  address: string;
  nit: string;
  phone: string;
  city: string;
  setCompanyInfo: (info: CompanyInfo) => void;
};

const defaultCompanyInfo: CompanyInfo = {
  name: 'Novamed',
  logo: '/logo-novamed-white.png',
  icon: '/icon-novamed-white.png',
  address: 'Calle 123 # 45-67',
  nit: '900.123.456-7',
  phone: '300 123 4567',
  city: 'Bogotá, D.C.',
};

export const CompanyContext = createContext<CompanyContextType>({
  companyName: defaultCompanyInfo.name,
  companyLogo: defaultCompanyInfo.logo,
  companyIcon: defaultCompanyInfo.icon,
  address: defaultCompanyInfo.address,
  nit: defaultCompanyInfo.nit,
  phone: defaultCompanyInfo.phone,
  city: defaultCompanyInfo.city,
  setCompanyInfo: () => {},
});

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyInfo, setCompanyInfoState] = useState<CompanyInfo>(defaultCompanyInfo);

  // Load state from localStorage on initial client-side render
  useEffect(() => {
    try {
      const item = window.localStorage.getItem('company-profile');
      if (item) {
        const parsedData = JSON.parse(item);
        // ensure all fields are present, if not, merge with default
        const fullData = { ...defaultCompanyInfo, ...parsedData };
        setCompanyInfoState(fullData);
      } else {
        // If nothing in localStorage, initialize with our defaults
        setCompanyInfoState(defaultCompanyInfo);
      }
    } catch (error) {
      console.error('Failed to load company info from localStorage', error);
      setCompanyInfoState(defaultCompanyInfo);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
        window.localStorage.setItem('company-profile', JSON.stringify(companyInfo));
    } catch (error) {
        console.error('Failed to save company info to localStorage', error);
    }
  }, [companyInfo]);
  
  const setCompanyInfo = useCallback((newInfo: CompanyInfo) => {
    setCompanyInfoState(newInfo);
  }, []);

  return (
    <CompanyContext.Provider value={{ 
      ...companyInfo, 
      companyName: companyInfo.name, 
      companyLogo: companyInfo.logo, 
      companyIcon: companyInfo.icon,
      setCompanyInfo 
    }}>
      {children}
    </CompanyContext.Provider>
  );
}
