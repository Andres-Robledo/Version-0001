'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartData = [
  { month: 'Enero', scheduled: 186, completed: 80 },
  { month: 'Febrero', scheduled: 305, completed: 200 },
  { month: 'Marzo', scheduled: 237, completed: 120 },
  { month: 'Abril', scheduled: 209, completed: 190 },
  { month: 'Mayo', scheduled: 209, completed: 130 },
  { month: 'Junio', scheduled: 214, completed: 140 },
];

const chartConfig = {
  scheduled: {
    label: 'Programado',
    color: 'hsl(var(--primary))',
  },
  completed: {
    label: 'Completado',
    color: '#FB923C',
  },
};

export function MaintenanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Mantenimiento</CardTitle>
        <CardDescription>
          Tareas de mantenimiento programadas vs. completadas en los últimos 6 meses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillScheduled" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-scheduled)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-scheduled)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="completed"
              type="natural"
              fill="url(#fillCompleted)"
              fillOpacity={0.4}
              stroke="var(--color-completed)"
              stackId="a"
            />
            <Area
              dataKey="scheduled"
              type="natural"
              fill="url(#fillScheduled)"
              fillOpacity={0.4}
              stroke="var(--color-scheduled)"
              stackId="a"
            />
             <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
