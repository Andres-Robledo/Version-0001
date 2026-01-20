import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ComplianceAssessor } from './components/compliance-assessor';

export default function CompliancePage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Centro de Cumplimiento</h2>
        <div className="flex items-center space-x-2">
          <Button>Generar Reporte</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-7">
          <ComplianceAssessor />
        </div>
      </div>
    </div>
  );
}
