import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActasPage from '../../pages/ActasPage';
import { actasService } from '../../api/services';

vi.mock('../../api/services', () => ({
  actasService: {
    listar: vi.fn(),
  },
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('ActasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la tabla de actas', async () => {
    vi.mocked(actasService.listar).mockResolvedValueOnce({
      data: {
        data: [
          {
            _id: '1',
            numeroActa: 1001,
            vehiculoId: { patente: 'AB123CD' },
            tipoInfraccionId: { descripcion: 'Mal estacionamiento' },
            lugar: 'Centro',
            fechaHora: '2023-10-01T10:00:00.000Z',
            monto: 5000,
            estado: 'pendiente',
            inspectorId: '2',
            observaciones: '',
            createdAt: '',
          },
        ],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    } as any);

    render(
      <MemoryRouter>
        <ActasPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Actas de Infracción')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('1001')).toBeInTheDocument();
      expect(screen.getByText('AB123CD')).toBeInTheDocument();
      expect(screen.getByText('Mal estacionamiento')).toBeInTheDocument();
    });
  });
});
