import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TiposInfraccionPage from '../../pages/TiposInfraccionPage';
import { tiposInfraccionService } from '../../api/services';

vi.mock('../../api/services', () => ({
  tiposInfraccionService: {
    listar: vi.fn(),
    crear: vi.fn(),
    actualizar: vi.fn(),
  },
}));

// Mock window.matchMedia for Ant Design
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('TiposInfraccionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la tabla con datos', async () => {
    vi.mocked(tiposInfraccionService.listar).mockResolvedValueOnce({
      data: [
        { _id: '1', codigo: 'INF-001', descripcion: 'Exceso de velocidad', montoBase: 15000, activo: true, createdAt: '' },
      ],
    } as any);

    render(<TiposInfraccionPage />);

    expect(screen.getByText('Tipos de Infracción')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('INF-001')).toBeInTheDocument();
      expect(screen.getByText('Exceso de velocidad')).toBeInTheDocument();
    });
  });

  it('abre el modal para crear un nuevo tipo', async () => {
    vi.mocked(tiposInfraccionService.listar).mockResolvedValueOnce({ data: [] } as any);

    render(<TiposInfraccionPage />);

    const botonNuevo = screen.getByRole('button', { name: /Nuevo Tipo/i });
    fireEvent.click(botonNuevo);

    await waitFor(() => {
      expect(screen.getByText('Nuevo Tipo de Infracción')).toBeInTheDocument();
    });
  });
});
