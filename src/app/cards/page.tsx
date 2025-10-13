import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';

export default function CardsPage(): JSX.Element {
  return (
    <div className="flex min-h-screen">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12">
        <Header
          title="Tarjetas de crédito"
          subtitle="Controla límites, gastos asociados y fechas clave de corte y pago."
        />
        <GlassCard title="En desarrollo" description="Próximas funcionalidades">
          <p className="text-sm text-white/70">
            Se integrará un resumen de saldo utilizado, disponible, próximos vencimientos y
            recordatorios configurables. También conectaremos cada gasto con la tarjeta
            correspondiente.
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
