import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';

export default function ReportsPage(): JSX.Element {
  return (
    <div className="flex min-h-screen">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12">
        <Header
          title="Reportes y proyecciones"
          subtitle="Analiza el desempeño mensual e identifica tendencias."
        />
        <GlassCard title="Próximas visualizaciones" description="Comparativas y proyecciones">
          <p className="text-sm text-white/70">
            Este módulo incorporará comparativas intermensuales, KPIs clave y proyecciones basadas
            en promedio histórico de gastos. También se integrará con el módulo de notificaciones
            para alertas inteligentes.
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
