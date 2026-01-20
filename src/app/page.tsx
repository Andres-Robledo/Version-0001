'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { Crown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Google Icon as an SVG component
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M22.56 12.25C22.56 11.45 22.48 10.65 22.34 9.87H12V14.26H18.12C17.84 15.63 17.07 16.82 15.93 17.55V20.18H19.78C21.66 18.44 22.56 15.63 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12 23C14.97 23 17.45 22.04 19.28 20.42L15.93 17.55C14.97 18.25 13.62 18.67 12 18.67C9.27 18.67 6.94 16.92 6.08 14.51H2.13V17.24C3.96 20.76 7.64 23 12 23Z" fill="#34A853"/>
        <path d="M6.08 14.51C5.88 13.91 5.76 13.28 5.76 12.62C5.76 11.96 5.88 11.33 6.08 10.73V7.99999H2.13C1.22 9.77999 0.759999 11.14 0.759999 12.62C0.759999 14.1 1.22 15.46 2.13 17.24L6.08 14.51Z" fill="#FBBC05"/>
        <path d="M12 5.99C13.59 5.99 15.01 6.55 16.14 7.61L19.34 4.41C17.45 2.63 14.97 1.62 12 1.62C7.64 1.62 3.96 3.86 2.13 7.38L6.08 10.11C6.94 7.7 9.27 5.99 12 5.99Z" fill="#EA4335"/>
    </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const { user, login, logout } = useAuth();
  const { toast } = useToast();
  
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminShaking, setIsAdminShaking] = useState(false);

  const [isShaking, setIsShaking] = useState(false);

  const [isLoginButtonActive, setIsLoginButtonActive] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    // When component mounts, log out any existing user
    logout();
    return () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };
  }, [logout]);


  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMINISTRADOR') {
        router.push('/owner/dashboard');
      } else {
        router.push('/inventory');
      }
    }
  }, [user, router]);

  const handleLoginAsAdmin = () => {
    toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "El correo electrónico o la contraseña son incorrectos.",
    });
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500); // Duration of the shake animation
  };

  const handleAdminLogin = () => {
    if (adminEmail === 'novamedingenieria@gmail.com' && adminPassword === '123456') {
        login('ADMINISTRADOR');
        setIsAdminLoginOpen(false);
    } else {
        toast({
            variant: "destructive",
            title: "Error de inicio de sesión",
            description: "Correo electrónico o contraseña incorrectos.",
        })
        setIsAdminShaking(true);
        setTimeout(() => setIsAdminShaking(false), 500);
    }
  }

  const handleGoogleButtonEnter = () => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }
    setIsLoginButtonActive(false);
  };

  const handleGoogleButtonLeave = () => {
    timerRef.current = setTimeout(() => {
        setIsLoginButtonActive(true);
    }, 500);
  };

  const handleLoginButtonEnter = () => {
      if (timerRef.current) {
          clearTimeout(timerRef.current);
      }
      setIsLoginButtonActive(true);
  };

  const displayLogo = "/logo-novamed.png";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className={cn("mx-auto w-full max-w-sm", isShaking && 'animate-shake')}>
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
             <Image
                src={displayLogo}
                alt="Logo de Novamed"
                width={280}
                height={100}
                className="object-contain"
                priority
              />
          </div>
          <CardTitle className="text-2xl font-bold">Bienvenido</CardTitle>
          <CardDescription>
            Ingresa tu correo para iniciar sesión en tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleLoginAsAdmin(); }}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button
                type="submit"
                className="w-full"
                variant={isLoginButtonActive ? 'default' : 'outline'}
                onMouseEnter={handleLoginButtonEnter}
              >
                Iniciar Sesión
              </Button>
              <Button
                type="button"
                variant={isLoginButtonActive ? 'outline' : 'destructive'}
                className="w-full"
                onClick={handleLoginAsAdmin}
                onMouseEnter={handleGoogleButtonEnter}
                onMouseLeave={handleGoogleButtonLeave}
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Iniciar Sesión con Google
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="#" className="underline">
              Regístrate
            </Link>
          </div>
          <div className="mt-6 text-center">
            <Dialog open={isAdminLoginOpen} onOpenChange={setIsAdminLoginOpen}>
                <DialogTrigger asChild>
                    <Button variant="link" className="text-xs text-muted-foreground hover:text-yellow-500 transition-colors">
                        <Crown className="mr-2 h-4 w-4" />
                        Iniciar Sesión como Administrador
                    </Button>
                </DialogTrigger>
                <DialogContent className={cn("sm:max-w-sm", isAdminShaking && "animate-shake")}>
                    <form onSubmit={(e) => { e.preventDefault(); handleAdminLogin(); }}>
                      <DialogHeader>
                        <div className="flex flex-col items-center text-center gap-2 mb-2">
                            <div className="p-3 bg-yellow-400/20 rounded-full border border-yellow-500/30">
                                <Crown className="h-8 w-8 text-yellow-500" />
                            </div>
                            <DialogTitle className="text-2xl">Acceso de Administrador</DialogTitle>
                            <DialogDescription>
                                Ingresa las credenciales para acceder al panel de control.
                            </DialogDescription>
                        </div>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                              <Label htmlFor="admin-email">Correo Electrónico</Label>
                              <Input
                                  id="admin-email"
                                  type="email"
                                  placeholder="admin@plataforma.com"
                                  value={adminEmail}
                                  onChange={(e) => setAdminEmail(e.target.value)}
                                  required
                                  className="focus-visible:ring-yellow-500"
                              />
                          </div>
                          <div className="grid gap-2">
                              <Label htmlFor="admin-password">Contraseña</Label>
                              <Input
                                  id="admin-password"
                                  type="password"
                                  value={adminPassword}
                                  onChange={(e) => setAdminPassword(e.target.value)}
                                  required
                                  className="focus-visible:ring-yellow-500"
                              />
                          </div>
                      </div>
                      <DialogFooter>
                          <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                            Ingresar
                          </Button>
                      </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
