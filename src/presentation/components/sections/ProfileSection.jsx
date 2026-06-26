// src/presentation/components/sections/ProfileSection.jsx
import { useState } from "react";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";
import { validateChangePasswordForm } from "../../../domain/services/userValidation";
import { userRepository } from "../../../infrastructure/repositories/userRepository";

export function ProfileSection({ user }) {
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function setField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccessMsg(""); setErrorMsg("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg(""); setErrorMsg("");
    const { isValid, errors: validationErrors } = validateChangePasswordForm(formData);
    setErrors(validationErrors);
    if (!isValid) return;
    setIsLoading(true);
    try {
      await userRepository.changePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword });
      setSuccessMsg("✅ Contraseña actualizada correctamente.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
    } catch (err) {
      setErrorMsg(err.message || "No se pudo actualizar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  }

  const ROLE_LABELS = { dueño: "Dueño", veterinario: "Veterinario", admin: "Administrador" };
  const ROLE_ICONS  = { dueño: "🐶", veterinario: "🩺", admin: "🛡️" };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-text-dark">👤 Mi Perfil</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
            {ROLE_ICONS[user?.role] || "👤"}
          </div>
          <div>
            <p className="text-lg font-bold text-text-dark">{user?.name || "Usuario"}</p>
            <p className="text-sm text-text-muted">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              {ROLE_LABELS[user?.role] || user?.role}
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-1 font-semibold text-text-dark">🔒 Cambiar Contraseña</h3>
        <p className="mb-5 text-sm text-text-muted">Ingresa tu contraseña actual y define una nueva.</p>
        {successMsg && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{successMsg}</div>}
        {errorMsg   && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errorMsg}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:max-w-sm">
          <TextField label="CONTRASEÑA ACTUAL *" type="password" placeholder="Tu contraseña actual"
            value={formData.currentPassword} onChange={(e) => setField("currentPassword", e.target.value)} error={errors.currentPassword} />
          <TextField label="NUEVA CONTRASEÑA *" type="password" placeholder="Mínimo 6 caracteres"
            value={formData.newPassword} onChange={(e) => setField("newPassword", e.target.value)} error={errors.newPassword} />
          <TextField label="CONFIRMAR CONTRASEÑA *" type="password" placeholder="Repite la nueva contraseña"
            value={formData.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} error={errors.confirmPassword} />
          <div><Button type="submit" isLoading={isLoading}>💾 Guardar Contraseña</Button></div>
        </form>
      </div>
    </div>
  );
}
