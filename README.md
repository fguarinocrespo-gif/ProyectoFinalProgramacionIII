# Sistema de Gestión de Infracciones de Tránsito Municipal

Sistema integral para la gestión de infracciones de tránsito, desarrollado como Proyecto Final para la materia Programación III (UTN, 2026). 

## 🛠️ Stack Tecnológico

**Backend:**
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose (ODM)
- Autenticación JWT con roles (inspector, administrativo)
- Validaciones con Zod
- Swagger para documentación de API
- Vitest + Supertest para testing

**Frontend:**
- React 18 + TypeScript (Vite)
- Ant Design (UI Library)
- React Router DOM
- Axios (con interceptores)
- Vitest + React Testing Library

## 🚀 Requisitos Previos

- Node.js (v18+)
- MongoDB corriendo localmente (puerto por defecto 27017) o URI de MongoDB Atlas

## 📦 Instalación y Configuración

1. **Clonar repositorio e instalar dependencias:**
   ```bash
   # Backend
   cd backend
   npm install
   cp .env.example .env  # Configurar variables si es necesario

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Ejecutar la Migración de Datos (Seed):**
   Para poder probar el sistema con datos, usuarios, actas y titulares precargados:
   ```bash
   cd backend
   npm run seed
   ```
   > **Credenciales de prueba generadas:**
   > - Inspector: `inspector@sistema.com` / `inspector123`
   > - Administrativo: `admin@sistema.com` / `admin123`

3. **Levantar los entornos de desarrollo:**
   
   En una terminal (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   El backend correrá en `http://localhost:3001`
   La documentación Swagger estará en `http://localhost:3001/api/docs`

   En otra terminal (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```
   El frontend correrá en `http://localhost:5173`

## 🧪 Testing y Coverage

Se han implementado tests unitarios y de integración para cumplir con la cobertura mínima requerida.

**Correr tests del Backend:**
```bash
cd backend
npm run test:coverage
```

**Correr tests del Frontend:**
```bash
cd frontend
npm run test:coverage
```

## 👥 Roles y Funcionalidades Principales

**Inspector:**
- Iniciar sesión.
- Listado de titulares y vehículos (Solo lectura).
- Labrar nuevas actas de infracción.
- Ver listado de las actas que él mismo ha labrado.

**Administrativo:**
- Iniciar sesión.
- Gestión completa (CRUD) de Titulares, Vehículos y Tipos de Infracción.
- Ver todas las actas registradas en el sistema.
- Registrar pagos (contado/tarjeta) para las actas.
- Registrar y resolver (aceptar/rechazar) descargos.
- Acceso al Dashboard de recaudación y estadísticas.

## 🏗️ Entidades Principales
- **Usuario:** Administra accesos e inspectores.
- **Titular:** Persona dueña de uno o más vehículos.
- **Vehículo:** Automóvil asociado a un titular.
- **TipoInfracción:** Catálogo de multas y sus montos base.
- **ActaInfracción:** Registro de multa con estado dinámico (pendiente -> notificada -> pagada/en_descargo -> anulada).
- **Pago / Descargo:** Entidades que gestionan el ciclo de vida final del acta.
