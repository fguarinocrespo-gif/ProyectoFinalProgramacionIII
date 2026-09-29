import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppLayout from '../../components/AppLayout';
import * as AuthContextModule from '../../context/AuthContext';

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );
  };

  it('renderiza correctamente el layout para un inspector', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      loading: false,
      isAuthenticated: true,
      usuario: { id: '1', nombre: 'Juan', apellido: 'Perez', email: 'j@p.com', rol: 'inspector' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: false,
      isInspector: true,
    });

    renderWithRouter();

    // Debe mostrar menú para inspector
    expect(screen.getByText('Actas')).toBeInTheDocument();
    expect(screen.getByText('Labrar Acta')).toBeInTheDocument();
    expect(screen.getByText('Titulares')).toBeInTheDocument();
    expect(screen.getByText('Vehículos')).toBeInTheDocument();

    // No debe mostrar menú de admin
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Tipos Infracción')).not.toBeInTheDocument();
  });

  it('renderiza correctamente el layout para un admin', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      loading: false,
      isAuthenticated: true,
      usuario: { id: '2', nombre: 'Admin', apellido: 'User', email: 'a@u.com', rol: 'administrativo' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: true,
      isInspector: false,
    });

    renderWithRouter();

    // Debe mostrar menú para admin
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Actas')).toBeInTheDocument();
    expect(screen.getByText('Titulares')).toBeInTheDocument();
    expect(screen.getByText('Vehículos')).toBeInTheDocument();
    expect(screen.getByText('Tipos Infracción')).toBeInTheDocument();

    // No debe mostrar labrar acta (exclusivo inspector)
    expect(screen.queryByText('Labrar Acta')).not.toBeInTheDocument();
  });
});
