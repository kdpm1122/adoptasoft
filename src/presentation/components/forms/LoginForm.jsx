// src/presentation/components/forms/LoginForm.jsx
import { useLogin } from "../../../application/hooks/useLogin";
import { ROLES } from "../../../domain/entities/User";
import { RoleCard } from "../ui/RoleCard";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";

const ROLE_OPTIONS = [
  { value: ROLES.OWNER, label: "Dueño", icon: "🐶" },
  { value: ROLES.VET, label: "Veterinario", icon: "🩺" },
  { value: ROLES.ADMIN, label: "Admin", icon: "🛡️" },
];

export function LoginForm({ onLoginSuccess }) {
  const { formData, setField, errors, isLoading, apiError, submit } = useLogin();

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await submit();
    if (result.success) onLoginSuccess?.(result.user);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-dark">
          Iniciar sesión en <span className="text-primary">Adoptasoft</span>
        </h1>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold tracking-wide text-text-dark">
          SELECCIONA TU PERFIL
        </p>
        <div className="flex gap-3">
          {ROLE_OPTIONS.map((opt) => (
            <RoleCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label.toUpperCase()}
              isSelected={formData.role === opt.value}
              onClick={() => setField("role", opt.value)}
            />
          ))}
        </div>
        {errors.role && <span className="mt-1 text-xs text-red-500">{errors.role}</span>}
      </div>

      <TextField
        label="CORREO ELECTRÓNICO"
        placeholder="Correo electrónico o número de celular"
        value={formData.email}
        onChange={(e) => setField("email", e.target.value)}
        error={errors.email}
      />

      <TextField
        label="CONTRASEÑA"
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => setField("password", e.target.value)}
        error={errors.password}
      />

      {apiError && <p className="text-sm text-red-500">{apiError}</p>}

      <Button type="submit" isLoading={isLoading}>
        Iniciar sesión
      </Button>

      <a href="/forgot-password" className="text-center text-sm font-medium text-primary hover:underline">
        ¿Olvidaste tu contraseña?
      </a>

      <div className="flex items-center gap-3 text-xs text-text-muted">
        <span className="h-px flex-1 bg-border" />
        o continúa con
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button type="button" variant="secondary" onClick={() => console.log("Google sign-in")}>
        🔵 Continuar con Google
      </Button>

      <a href="/register" className="text-center text-sm font-semibold text-primary hover:underline">
        Crear cuenta nueva
      </a>
    </form>
  );
}
