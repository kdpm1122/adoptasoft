// src/presentation/components/forms/CreateUserForm.jsx
import { useUserManagement } from "../../../application/hooks/useUserManagement";
import { ROLES } from "../../../domain/entities/User";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";
import { UserListItem } from "../ui/UserListItem";

export function CreateUserForm({ initialUsers }) {
  const { users, formData, setField, errors, isLoading, createUser } = useUserManagement(initialUsers);

  async function handleSubmit(e) {
    e.preventDefault();
    await createUser();
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-text-dark">+ Crear Nuevo Usuario</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextField label="NOMBRE COMPLETO *" placeholder="Nombre" value={formData.fullName} onChange={(e) => setField("fullName", e.target.value)} error={errors.fullName} />
          <TextField label="CORREO *" placeholder="correo@ejemplo.com" value={formData.email} onChange={(e) => setField("email", e.target.value)} error={errors.email} />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-wide text-text-dark">ROL *</label>
            <select value={formData.role} onChange={(e) => setField("role", e.target.value)}
              className="rounded-xl border border-border bg-warm-cream px-4 py-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light">
              <option value="">Seleccionar</option>
              <option value={ROLES.OWNER}>Dueño</option>
              <option value={ROLES.VET}>Veterinario</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
            {errors.role && <span className="text-xs text-red-500">{errors.role}</span>}
          </div>
          <TextField label="TELÉFONO" placeholder="+57 300 000 0000" value={formData.phone} onChange={(e) => setField("phone", e.target.value)} />
          <TextField label="DOCUMENTO" placeholder="CC o NIT" value={formData.document} onChange={(e) => setField("document", e.target.value)} />
          <TextField label="CONTRASEÑA *" type="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={(e) => setField("password", e.target.value)} error={errors.password} />
          <div className="flex items-end">
            <Button type="submit" isLoading={isLoading}>+ Crear Usuario</Button>
          </div>
        </div>
      </form>
      <div>
        <p className="mb-3 text-xs font-semibold tracking-wide text-text-muted">USUARIOS REGISTRADOS</p>
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <UserListItem key={u.id} icon={u.role === "veterinario" ? "🩺" : "👤"} name={u.name} subtitle={u.subtitle} role={u.role} />
          ))}
        </div>
      </div>
    </div>
  );
}
