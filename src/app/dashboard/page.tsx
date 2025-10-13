import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { GlassCard } from '@/components/GlassCard';
import { PieChart502030 } from '@/components/PieChart502030';
import { ProgressCircle } from '@/components/ProgressCircle';

const sampleDistribution = {
  necesidades: 0.5,
  ahorros: 0.2,
  deseos: 0.3
};

const sampleFunds = [
  { label: 'Fondo de emergencia', progress: 0.62, accent: 'rgba(56,139,255,0.75)' },
  { label: 'Vacaciones', progress: 0.35, accent: 'rgba(166,128,255,0.75)' },
  { label: 'Inversiones', progress: 0.48, accent: 'rgba(16,242,170,0.75)' }
];

export default function DashboardPage(): JSX.Element {
  return (
    <div className="flex min-h-screen">
      <NavBar />
      <main className="flex flex-1 flex-col gap-10 px-6 py-10 md:px-12">
        <Header
          title="Panel de control"
          subtitle="Visualiza tus ingresos, gastos y progreso en una única vista."
        />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <GlassCard
            title="Balance 50/20/30"
            description="Distribución actual de tus gastos frente a la regla."
            className="h-full"
          >
            <PieChart502030 distribution={sampleDistribution} />
          </GlassCard>
          <GlassCard
            title="Resumen rápido"
            description="Totales mensuales estimados"
            className="flex h-full flex-col justify-center"
          >
            <ul className="grid gap-4 text-white/70">
              <li className="flex items-center justify-between rounded-2xl bg-white/5 px-5 py-4 text-sm">
                <span>Ingresos del mes</span>
                <span className="font-semibold text-white">$ 2.450.000</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-white/5 px-5 py-4 text-sm">
                <span>Gastos totales</span>
                <span className="font-semibold text-white">$ 1.540.000</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-white/5 px-5 py-4 text-sm">
                <span>Ahorro proyectado</span>
                <span className="font-semibold text-white">$ 380.000</span>
              </li>
            </ul>
          </GlassCard>
        </div>

        <GlassCard
          title="Fondos personales"
          description="Progreso estimado en cada meta. Datos reales se poblarán desde IndexedDB."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {sampleFunds.map((fund) => (
              <ProgressCircle
                key={fund.label}
                label={fund.label}
                progress={fund.progress}
                accent={fund.accent}
              />
            ))}
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
