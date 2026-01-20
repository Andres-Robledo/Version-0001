'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

interface ImageEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { zoom: number; positionX: number; positionY: number }) => void;
  imageUrl: string;
  initialZoom: number;
  initialPositionX: number;
  initialPositionY: number;
}

export function ImageEditorDialog({
  isOpen,
  onClose,
  onSave,
  imageUrl,
  initialZoom,
  initialPositionX,
  initialPositionY,
}: ImageEditorDialogProps) {
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState({ x: initialPositionX, y: initialPositionY });
  const [isDragging, setIsDragging] = useState(false);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  useEffect(() => {
    if (isOpen) {
      setZoom(initialZoom);
      setPosition({ x: initialPositionX, y: initialPositionY });
    }
  }, [isOpen, initialZoom, initialPositionX, initialPositionY]);

  const handleSave = () => {
    onSave({ 
      zoom, 
      positionX: position.x,
      positionY: position.y
    });
    onClose();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    imageContainerRef.current?.focus();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !imageContainerRef.current) return;

    // Calculate movement delta
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    // Convert pixel movement to percentage movement based on container size
    const containerWidth = imageContainerRef.current.offsetWidth;
    const containerHeight = imageContainerRef.current.offsetHeight;

    const deltaXPercent = (dx / containerWidth) * 100;
    const deltaYPercent = (dy / containerHeight) * 100;
    
    // Update position, clamping to keep the image within reasonable bounds
    setPosition({
      x: Math.max(0, Math.min(100, dragStartRef.current.posX + deltaXPercent)),
      y: Math.max(0, Math.min(100, dragStartRef.current.posY + deltaYPercent)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 50, y: 50 });
  };
  
  const translateX = position.x - 50;
  const translateY = position.y - 50;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editor de Imagen</DialogTitle>
          <DialogDescription>
            Ajusta el zoom y arrastra la imagen para encuadrarla.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div 
            ref={imageContainerRef}
            className={cn(
              "md:col-span-2 flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden border relative",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            tabIndex={-1}
          >
             <div className="relative w-full aspect-video">
                <Image
                    src={imageUrl}
                    alt="Vista previa del equipo"
                    fill
                    className="object-cover pointer-events-none"
                    style={{
                        transform: `scale(${zoom}) translate(${translateX}%, ${translateY}%)`,
                        transformOrigin: 'center center',
                    }}
                    priority
                    unoptimized // Prevents Next.js image optimization from interfering
                />
             </div>
          </div>
          <div className="space-y-6 flex flex-col justify-center">
            <div className="grid gap-2">
              <Label htmlFor="zoom">Zoom</Label>
              <Slider
                id="zoom"
                min={0.2}
                max={3}
                step={0.05}
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
              />
               <span className="text-xs text-center text-muted-foreground">{(zoom * 100).toFixed(0)}%</span>
            </div>
            
             <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restablecer
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
