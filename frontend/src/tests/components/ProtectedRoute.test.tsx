import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from '../../components/ProtectedRoute';
import * as AuthContextModule from '../../context/AuthContext';

const renderWithRouter = (ui: React.ReactElement, initialEntries = ['/protected']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/actas" element={<div>Actas Page</div>} />
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/protected" element={<div>Protected Content</div>} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/general" element={<div>General Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  it('muestra un loading spinner si está cargando', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      loading: true,
      isAuthenticated: false,
      usuario: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: false,
      isInspector: false,
    });

    const { container } = renderWithRouter(<div />);
    // Antd Spin is rendered
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('redirige a /login si no está autenticado', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      loading: false,
      isAuthenticated: false,
      usuario: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: false,
      isInspector: false,
    });

    renderWithRouter(<div />, ['/general']);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('permite el acceso si está autenticado y no hay roles requeridos', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      loading: false,
      isAuthenticated: true,
      usuario: { id: '1', nombre: 'Test', apellido: 'User', email: 't@t.com', rol: 'inspector' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: false,
      isInspector: true,
    });

    renderWithRouter(<div />, ['/general']);
    expect(screen.getByText('General Content')).toBeInTheDocument();
  });

  it('redirige a /actas si el rol no coincide', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      loading: false,
      isAuthenticated: true,
      usuario: { id: '1', nombre: 'Test', apellido: 'User', email: 't@t.com', rol: 'inspector' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: false,
      isInspector: true,
    });

    renderWithRouter(<div />, ['/protected']);
    expect(screen.getByText('Actas Page')).toBeInTheDocument();
  });

  it('permite el acceso si el rol coincide', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      loading: false,
      isAuthenticated: true,
      usuario: { id: '1', nombre: 'Test', apellido: 'User', email: 't@t.com', rol: 'admin' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: true,
      isInspector: false,
    });

    renderWithRouter(<div />, ['/protected']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
