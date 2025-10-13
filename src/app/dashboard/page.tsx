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
    <div className="flex min-h-screen liquid-glass-bg">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12 animate-fade-in">
        <Header
          title="Panel de control"
          subtitle="Visualiza tus ingresos, gastos y progreso en una única vista."
        />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] animate-slide-up">
          <GlassCard
            title="Balance 50/20/30"
            description="Distribución actual de tus gastos frente a la regla."
            className="h-full glass-card-elevated"
          >
            <PieChart502030 distribution={sampleDistribution} />
          </GlassCard>
          <GlassCard
            title="Resumen rápido"
            description="Totales mensuales estimados"
            className="flex h-full flex-col justify-center glass-card"
          >
            <ul className="grid gap-4 text-foreground-secondary">
              <li className="flex items-center justify-between glass-card px-6 py-4 text-sm rounded-apple">
                <span className="font-text">Ingresos del mes</span>
                <span className="font-semibold text-foreground font-display">$ 2.450.000</span>
              </li>
              <li className="flex items-center justify-between glass-card px-6 py-4 text-sm rounded-apple">
                <span className="font-text">Gastos totales</span>
                <span className="font-semibold text-foreground font-display">$ 1.540.000</span>
              </li>
              <li className="flex items-center justify-between glass-card px-6 py-4 text-sm rounded-apple">
                <span className="font-text">Ahorro proyectado</span>
                <span className="font-semibold text-foreground font-display text-gradient-accent">$ 380.000</span>
              </li>
            </ul>
          </GlassCard>
        </div>

        <GlassCard
          title="Fondos personales"
          description="Progreso estimado en cada meta. Datos reales se poblarán desde IndexedDB."
          className="glass-card animate-scale-in"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {sampleFunds.map((fund, index) => (
              <div key={fund.label} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProgressCircle
                  label={fund.label}
                  progress={fund.progress}
                  accent={fund.accent}
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
