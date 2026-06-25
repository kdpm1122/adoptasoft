// src/application/hooks/useLogin.js
import { useState, useCallback } from "react";
import { validateLoginForm } from "../../domain/services/authValidation";
import { authRepository } from "../../infrastructure/repositories/authRepository";

export function useLogin() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const setField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const submit = useCallback(async () => {
    setApiError(null);
    const { isValid, errors: validationErrors } = validateLoginForm(formData);
    setErrors(validationErrors);

    if (!isValid) return { success: false };

    setIsLoading(true);
    try {
      const user = await authRepository.login(formData);
      return { success: true, user };
    } catch (err) {
      setApiError(err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return { formData, setField, errors, isLoading, apiError, submit };
}
