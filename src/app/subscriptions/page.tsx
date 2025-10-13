import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';

export default function SubscriptionsPage(): JSX.Element {
  return (
    <div className="flex min-h-screen">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12">
        <Header
          title="Suscripciones"
          subtitle="Administra servicios recurrentes, fechas de cobro y gasto mensual acumulado."
        />
        <GlassCard title="En cola" description="Próxima iteración del módulo de suscripciones">
          <p className="text-sm text-white/70">
            Aquí listaremos todas las suscripciones con frecuencia, tarjetas asociadas y suma
            mensual. También activaremos recordatorios locales cuando se aproxime el próximo cobro.
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
