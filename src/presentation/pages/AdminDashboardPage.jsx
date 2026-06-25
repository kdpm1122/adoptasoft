// src/presentation/pages/AdminDashboardPage.jsx
import { useState, useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { StatCard } from "../components/ui/StatCard";
import { QuickAccessCard } from "../components/ui/QuickAccessCard";
import { CreateUserForm } from "../components/forms/CreateUserForm";
import { VeterinariansSection } from "../components/sections/VeterinariansSection";
import { ADMIN_NAV } from "../../shared/constants/navigation";
import { ROLES } from "../../domain/entities/User";
import { Veterinarian } from "../../domain/entities/Veterinarian";
import { userRepository } from "../../infrastructure/repositories/userRepository";
import { vetRepository } from "../../infrastructure/repositories/vetRepository";

export function AdminDashboardPage({ onLogout }) {
  const [activeNav, setActiveNav] = useState("inicio");
  const [users, setUsers] = useState([]);
  const [vets, setVets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [usersData, vetsData] = await Promise.all([userRepository.list(), vetRepository.list()]);
        if (cancelled) return;
        setUsers(usersData);
        setVets(vetsData.map((v) => new Veterinarian(v)));
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateVet(formData) {
    const newVet = await vetRepository.create(formData);
    setVets((prev) => [new Veterinarian(newVet), ...prev]);
    // El backend genera una contraseña temporal porque el formulario no la pide.
    if (newVet.temporaryPassword) {
      window.alert(
        `Veterinario creado. Contraseña temporal: ${newVet.temporaryPassword}\n` +
          `Compártela con ${formData.name} para su primer inicio de sesión.`
      );
    }
  }

  function goTo(nav) {
    setActiveNav(nav);
  }

  const ownersCount = users.filter((u) => u.role === ROLES.OWNER).length;

  function renderSection() {
    switch (activeNav) {
      case "usuarios":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-text-dark">👥 Usuarios</h1>
              <p className="text-text-muted">Gestión de todos los usuarios del sistema</p>
            </div>
            <CreateUserForm initialUsers={users} />
          </>
        );

      case "veterinarios":
        return <VeterinariansSection vets={vets} onCreateVet={handleCreateVet} />;

      default:
        return null;
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout
        subtitle="Panel de Administración"
        roleLabel="Administrador"
        roleIcon="🛡️"
        navItems={ADMIN_NAV}
        activeNav={activeNav}
        onNavigate={setActiveNav}
        onLogout={onLogout}
      >
        <p className="text-text-muted">Cargando datos...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      subtitle="Panel de Administración"
      roleLabel="Administrador"
      roleIcon="🛡️"
      navItems={ADMIN_NAV}
      activeNav={activeNav}
      onNavigate={setActiveNav}
      onLogout={onLogout}
    >
      {loadError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          No se pudieron cargar los datos: {loadError}
        </div>
      )}

      {activeNav === "inicio" && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-dark">🛡️ Panel de Administración</h1>
            <p className="text-text-muted">Gestión global del sistema</p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard value={users.length} label="Usuarios Totales" accent="orange" />
            <StatCard value={vets.length} label="Veterinarios" accent="yellow" />
            <StatCard value={ownersCount} label="Dueños" accent="green" />
            <StatCard value="98%" label="Uptime" accent="blue" />
          </div>

          <p className="mb-3 text-xs font-semibold tracking-wide text-text-muted">PANEL DE ADMINISTRACIÓN</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <QuickAccessCard
              icon="👥"
              title="Gestión de Usuarios"
              description="Crear, editar, suspender"
              highlighted
              onClick={() => goTo("usuarios")}
            />
            <QuickAccessCard icon="🩺" title="Veterinarios" description="Gestionar especialistas" onClick={() => goTo("veterinarios")} />
            <QuickAccessCard icon="📊" title="Reportes Globales" description="Estadísticas del sistema" />
            <QuickAccessCard icon="⚙️" title="Configuración" description="Sistema y seguridad" />
            <QuickAccessCard icon="🔔" title="Notificaciones del Sistema" description="Alertas y avisos" badge={3} />
          </div>
        </>
      )}

      {renderSection()}
    </DashboardLayout>
  );
}
