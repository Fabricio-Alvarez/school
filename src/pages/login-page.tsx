import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { authService } from "../services/auth.service";
import { loginSchema } from "../utils/validation";
import { UIInput } from "../components/ui-input";
import { UIButton } from "../components/ui-button";
import { UIAlert } from "../components/ui-alert";
import { getErrorMessage } from "../utils/error-message";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = loginSchema.safeParse({ username, password });
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Debe completar los campos requeridos.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authService.login(parsed.data.username, parsed.data.password);
      login(response.token, response.user);
      navigate("/", { replace: true });
    } catch (error) {
      setMessage(getErrorMessage(error, "Usuario o contraseña incorrectos."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <div className="login-badge" aria-hidden="true" >
          🏫
        </div>
        <h1>Escuela Del Valle</h1>
        <p className="login-subtitle">Acceso seguro para personal autorizado</p>
        <UIInput
          label="Usuario"
          placeholder="Ingrese su usuario"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <UIInput
          label="Contraseña"
          type="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <UIAlert message={message} />
        <UIButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </UIButton>
      </form>
    </div>
  );
}
