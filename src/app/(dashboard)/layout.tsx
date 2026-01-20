'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Settings,
  PanelLeft,
  Bell,
  LogOut,
  ChevronDown,
  Wrench,
  ClipboardList,
  Calendar,
  Building,
  FileText,
  Users, // Para gestionar usuarios
  Briefcase, // Para gestionar organizaciones (Owner)
  Shield, // Para Owner-level settings
  HeartPulse, // standard_1
  Package, // standard_4
  ClipboardCheck, // standard_5
  BookUser, // standard_6
  Network, // standard_7
  AreaChart, // Añadido para Informes
  Lock, // Añadido para módulos deshabilitados
} from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ClientOnly } from '@/components/client-only';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/context/auth-context';
import { User } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

// --- Definición de Navegación --- 
type SubNavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  requiredStandard?: string;
};

type NavItem = {
  id: string;
  icon: React.ElementType;
  label: string;
  href?: string;
  requiredRole?: User['role'];
  requiredStandard?: string;
  subItems?: SubNavItem[];
};

const ALL_NAV_ITEMS: NavItem[] = [
  // --- Rutas para Administrador ---
  {
    id: 'admin-dashboard',
    href: '/owner/dashboard',
    icon: Shield,
    label: 'Panel de Administrador',
    requiredRole: 'ADMINISTRADOR',
  },
  {
    id: 'admin-orgs',
    href: '/owner/organizations',
    icon: Briefcase,
    label: 'Organizaciones',
    requiredRole: 'ADMINISTRADOR',
  },
  // --- Rutas para Org Admin ---
  {
    id: 'admin-users',
    href: '/admin/users',
    icon: Users,
    label: 'Gestionar Usuarios',
    requiredRole: 'ORG_ADMIN',
  },
  // --- Rutas basadas en Estándares ---
  {
    id: 'standard-1',
    href: '/standards/human-talent',
    icon: HeartPulse,
    label: 'Talento Humano',
    requiredStandard: 'standard_1',
  },
  {
    id: 'standard-2',
    href: '/standards/infrastructure',
    icon: Building,
    label: 'Infraestructura',
    requiredStandard: 'standard_2',
  },
  {
    id: 'standard-3',
    href: '/dotacion',
    icon: Wrench,
    label: 'Dotación',
    requiredStandard: 'standard_3',
    subItems: [
      { href: '/inventory', label: 'Inventario', icon: ClipboardList },
      { href: '/maintenance', label: 'Cronograma', icon: Calendar },
      { href: '/documents', label: 'Documentos', icon: FileText },
    ],
  },
  {
    id: 'standard-4',
    href: '/standards/meds-devices',
    icon: Package,
    label: 'Medicamentos y Disp.',
    requiredStandard: 'standard_4',
  },
  {
    id: 'standard-5',
    href: '/standards/priority-processes',
    icon: ClipboardCheck,
    label: 'Procesos Prioritarios',
    requiredStandard: 'standard_5',
  },
  {
    id: 'standard-6',
    href: '/standards/clinical-history',
    icon: BookUser,
    label: 'Historia Clínica',
    requiredStandard: 'standard_6',
  },
  {
    id: 'standard-7',
    href: '/standards/services-interdependence',
    icon: Network,
    label: 'Interdependencia',
    requiredStandard: 'standard_7',
  },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: 'notifications', href: '#notifications', icon: Bell, label: 'Notificaciones' },
  { id: 'settings', href: '/settings', icon: Settings, label: 'Configuración' },
];

function UserProfile() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex items-center gap-3 p-3 justify-center group-data-[state=expanded]/sidebar-wrapper:justify-start group-data-[state=expanded]/sidebar-wrapper:p-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className={cn("flex flex-col gap-2", state === 'collapsed' && 'hidden')}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  };

  return (
    <div className={cn("flex items-center gap-3 p-3 justify-center group-data-[state=expanded]/sidebar-wrapper:justify-start group-data-[state=expanded]/sidebar-wrapper:p-6")}>
      <Avatar className="h-10 w-10 border">
        {/* Asumimos que el usuario no tiene avatar por ahora */}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col truncate transition-opacity", state === 'collapsed' && 'hidden')}>
        <span className="font-semibold text-sm truncate">{user.name}</span>
        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={handleLogout} className={cn("ml-auto text-muted-foreground hover:text-foreground", state === 'collapsed' && 'hidden')}>
        <LogOut size={18} />
      </Button>
    </div>
  );
}

function MainSidebar({ navItems }: { navItems: (NavItem & { isEnabled: boolean })[] }) {
  const { state, setOpen, isMobile, open } = useSidebar();
  const { organization } = useAuth();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isMobile && !open) setOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      if (!isMobile && open) setOpen(false);
    }, 300);
  };

  const handleMenuItemClick = () => {
    if (isMobile) setOpen(false);
  };

  const logoExpanded = organization?.customization?.logoUrl || "/LOGO BLANCO.png";
  const logoCollapsed = organization?.customization?.logoUrl || "/image.png";

  return (
    <Sidebar variant="inset" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <SidebarHeader>
        <ClientOnly>
          <div className={cn("flex items-center gap-3 pt-5 pb-4 px-3 justify-center")}>
            {state === 'expanded' ? (
              <img src={logoExpanded} alt="Logo de la Organización" className="w-[250px] h-[80px] object-contain transition-all" />
            ) : (
              <img src={logoCollapsed} alt="Icono de la Organización" className="h-12 w-12 object-contain transition-all" />
            )}
          </div>
        </ClientOnly>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="flex flex-col justify-between">
        <SidebarMenu>
          {navItems.map((item) => {
            const isDisabled = item.isEnabled === false;
            const isParentActive = !isDisabled && item.subItems?.some(subItem => pathname.startsWith(subItem.href));
            
            let tooltipProps: any = state === 'collapsed' ? item.label : undefined;
            if (isDisabled && state === 'collapsed') {
                tooltipProps = `${item.label} (No habilitado)`;
            }

            return (
              <SidebarMenuItem key={item.id} className={cn(isDisabled && "cursor-not-allowed")}>
                <Collapsible defaultOpen={pathname.startsWith(item.href || '____') || isParentActive}>
                  <div className="relative flex items-center">
                    <SidebarMenuButton 
                      asChild 
                      tooltip={tooltipProps} 
                      value={item.href || item.id} 
                      className={cn("flex-1 justify-start", isDisabled && "opacity-60")}
                      isActive={isParentActive || (!isDisabled && item.href && pathname.startsWith(item.href))}
                      aria-disabled={isDisabled}
                    >
                      <Link href={isDisabled ? '#' : (item.href || '#')} onClick={(e) => {
                        if (isDisabled) e.preventDefault();
                        else handleMenuItemClick();
                      }}>
                        <item.icon className="h-5 w-5" />
                        <span className={cn("text-base", state === 'collapsed' && 'hidden')}>{item.label}</span>
                        {isDisabled && state === 'expanded' && <Lock className="h-4 w-4 ml-auto text-sidebar-foreground/70" />}
                      </Link>
                    </SidebarMenuButton>
                    {item.subItems && (
                      <CollapsibleTrigger asChild disabled={isDisabled}>
                        <Button variant="ghost" size="icon" className={cn("absolute right-1 h-8 w-8 data-[state=open]:rotate-180 transition-transform duration-200", state === 'collapsed' && 'hidden', isDisabled && "hidden")}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                  {!isDisabled && item.subItems && (
                    <CollapsibleContent>
                      <div className={cn("pl-8 pr-1 py-1 space-y-1", state === 'collapsed' && 'hidden')}>
                        {item.subItems.map((subItem) => (
                          <SidebarMenuButton key={subItem.href} asChild variant="ghost" size="sm" className="w-full justify-start" value={subItem.href} onClick={handleMenuItemClick}>
                            <Link href={subItem.href}>
                              <subItem.icon className="h-4 w-4 mr-2" />
                              {subItem.label}
                            </Link>
                          </SidebarMenuButton>
                        ))}
                      </div>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        <SidebarMenu>
          {BOTTOM_NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild tooltip={state === 'collapsed' ? item.label : undefined} value={item.href || item.id} className="flex-1 justify-start" isActive={pathname === item.href}>
                <Link href={item.href || '#'} onClick={handleMenuItemClick}>
                  <item.icon className="h-5 w-5" />
                  <span className={cn("text-base", state === 'collapsed' && 'hidden')}>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <ClientOnly>
          <UserProfile />
        </ClientOnly>
      </SidebarFooter>
    </Sidebar>
  );
}

function MobileSidebar({ navItems }: { navItems: (NavItem & { isEnabled: boolean })[] }) {
  const { organization } = useAuth();
  const logo = organization?.customization?.logoUrl || "/image.png";

  return (
    <ClientOnly>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden h-12 w-12">
            <PanelLeft className="h-6 w-6" />
            <span className="sr-only">Abrir Menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="group flex h-20 shrink-0 items-center justify-center gap-2 text-lg font-semibold">
              <img src={logo} alt={organization?.name || 'Logo'} className="h-16 w-auto object-contain" />
              <span className="sr-only">{organization?.name}</span>
            </Link>
            {navItems.concat(BOTTOM_NAV_ITEMS).map((item) => {
              const isDisabled = item.isEnabled === false;
              return (
                <Link 
                  key={item.id} 
                  href={isDisabled ? '#' : (item.href || '#')} 
                  onClick={(e) => { if (isDisabled) e.preventDefault(); }}
                  className={cn("flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground", isDisabled && "opacity-50 cursor-not-allowed")}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {isDisabled && <Lock className="h-4 w-4 ml-auto" />}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </ClientOnly>
  );
}

function Header() {
  const { open, setOpen } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background px-4 py-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      <MobileSidebar navItems={[]} /> {/* Placeholder, will be populated in LayoutWrapper */}
      <div className={cn("fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ease-in-out md:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")} onClick={() => setOpen(false)} />
    </header>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, organization, isLoading } = useAuth();
  const router = useRouter();
  const { open, setOpen } = useSidebar();
  
  useEffect(() => {
    // Redirect if loading is finished and there's no user
    if (!isLoading && !user) {
        router.replace('/');
    }
  }, [user, isLoading, router]);

  const navItems = useMemo(() => {
    if (!user || !organization) return [];
    
    // Primero, filtra los ítems según el rol del usuario.
    const roleFilteredItems = ALL_NAV_ITEMS.filter(item => {
      return !item.requiredRole || item.requiredRole === user.role;
    });

    // Luego, mapea para añadir el estado de habilitación (para los estándares).
    return roleFilteredItems.map(item => {
      const isEnabled = !item.requiredStandard || organization.enabledStandards.includes(item.requiredStandard);
      return { ...item, isEnabled };
    });

  }, [user, organization]);

  if (isLoading || !user) { // Show loader while loading or if user is not yet available
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-muted/40">
      <MainSidebar navItems={navItems} />
      <div 
        className={cn(
            "fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ease-in-out hidden md:block", 
            open ? "opacity-100" : "pointer-events-none opacity-0"
        )} 
        onClick={() => setOpen(false)} 
       />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-20">
           <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <MobileSidebar navItems={navItems} />
           </header>
            <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
  return (
    <SidebarProvider defaultOpen={false}>
        <LayoutWrapper>{children}</LayoutWrapper>
    </SidebarProvider>
  );
}
