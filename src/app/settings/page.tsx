import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';

export default function SettingsPage(): JSX.Element {
  return (
    <div className="flex min-h-screen">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12">
        <Header
          title="Ajustes"
          subtitle="Configura divisas predeterminadas, sincronización y alertas PWA."
        />
        <GlassCard title="Configuración pendiente" description="Se habilitará pronto">
          <p className="text-sm text-white/70">
            Próximamente podrás personalizar divisas, activar sincronización en la nube y gestionar
            recordatorios inteligentes desde este panel.
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
