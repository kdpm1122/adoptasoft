// src/presentation/pages/LoginPage.jsx
import { LoginForm } from "../components/forms/LoginForm";

export function LoginPage({ onLoginSuccess }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Panel izquierdo: ilustrativo */}
      <div className="hidden flex-1 flex-col justify-between bg-warm-bg px-12 py-10 md:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl">
            🐾
          </div>
          <span className="text-xl font-bold text-text-dark">
            Adopta<span className="text-primary">soft</span>
          </span>
        </div>

        <div className="flex justify-center">
          <div className="">
            🐕🐈
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-extrabold leading-tight text-text-dark">
            Encuentra a tu nuevo{" "}
            <span className="text-primary">mejor amigo.</span>
          </h2>
          <p className="mt-4 max-w-md text-text-muted">
            Gestiona mascotas, citas e historiales clínicos en un solo lugar,
            pensado para dueños, veterinarios y administradores.
          </p>
        </div>
      </div>

      {/* Panel derecho: formulario */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10">
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}
