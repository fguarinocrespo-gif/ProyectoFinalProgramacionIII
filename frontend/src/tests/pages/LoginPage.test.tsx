import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../../pages/LoginPage';
import { AuthProvider } from '../../context/AuthContext';
import { authService } from '../../api/services';

vi.mock('../../api/services', () => ({
  authService: {
    login: vi.fn(),
  },
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente el formulario de login', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('muestra errores de validación si se envía vacío', async () => {
    renderWithProviders(<LoginPage />);
    
    const button = screen.getByRole('button', { name: /Iniciar Sesión/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Ingrese su email')).toBeInTheDocument();
      expect(screen.getByText('Ingrese su contraseña')).toBeInTheDocument();
    });
  });

  it('llama al servicio de login con los datos correctos', async () => {
    const mockLogin = vi.mocked(authService.login).mockResolvedValueOnce({
      data: { token: 'fake_token', usuario: { id: '1', nombre: 'Test', apellido: 'User', email: 'test@test.com', rol: 'inspector' } },
    } as any);

    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const button = screen.getByRole('button', { name: /Iniciar Sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
    });
  });
});
