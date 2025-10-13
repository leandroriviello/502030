import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';

export default function FundsPage(): JSX.Element {
  return (
    <div className="flex min-h-screen">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12">
        <Header
          title="Fondos personales"
          subtitle="Define metas, fechas objetivo y seguimiento detallado para cada propósito."
        />
        <GlassCard title="Próximos pasos" description="Planificación del módulo de fondos">
          <p className="text-sm text-white/70">
            Aquí mostraremos anillos animados con metas de ahorro, sugerencias de aporte y
            microinteracciones de progreso. La integración con la base de datos llegará en la
            siguiente iteración.
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
