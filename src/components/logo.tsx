import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn(props.className)}
      {...props}
    >
      <rect x="5" y="5" width="90" height="90" rx="10" ry="10" fill="hsl(var(--sidebar-background))" />
    </svg>
  );
}
