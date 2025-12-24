# SmarterOS OpenSpec Kit - 2025-12-21
**Versión:** 3.1
**Estado:** Activo
**Última actualización:** 21 de Diciembre 2025

---

## 📦 Kit de Herramientas OpenSpec

Este documento centraliza todas las herramientas, especificaciones y recursos disponibles para el desarrollo spec-driven en el ecosistema SmarterOS.

---

## 🔧 Herramientas Disponibles

### 1. OpenSpec CLI

**Versión:** 0.16.0
**Instalación:**
```bash
npm install -g @fission-ai/openspec@latest
```

**Comandos principales:**
```bash
# Listar especificaciones
openspec list --specs

# Crear propuesta de cambio
openspec change --name add-nueva-funcionalidad

# Validar especificaciones
openspec validate --strict

# Actualizar desde código
openspec update

# Archivar cambios completados
openspec archive cambio-id --yes
```

### 2. Generadores de Especificaciones

**FastAPI (Python):**
```bash
cd /root/smarteros-auth-api
openspec init
openspec update
```

**Express.js (TypeScript):**
```bash
cd /root/smarteros-api-implementation
openspec init --existing api-smarteros-openapi.yaml
```

### 3. Validación Automática

**Pre-commit hook:**
```bash
#!/bin/bash
# /root/.git/hooks/pre-commit
openspec validate || {
  echo "❌ Especificación OpenAPI inválida"
  exit 1
}
```

**CI/CD (GitHub Actions):**
```yaml
- name: Validar OpenSpec
  run: |
    npm install -g @fission-ai/openspec@latest
    cd openspec
    openspec validate --strict
```

---

## 📚 Especificaciones Actuales

### Especificaciones Activas (Production)

#### 1. api-gateway.yaml
- **Estado:** ✅ Production
- **Servicio:** Contact API
- **Framework:** FastAPI (Python)
- **URL:** https://api.smarterbot.cl
- **Versión:** 1.0.0
- **Endpoints:** 3 (/, /health, /contact)
- **Descripción:** API unificada para formularios de contacto con integración Supabase y Resend

#### 2. api-smarteros-legacy.yaml
- **Estado:** ⚠️ Migration to FastAPI
- **Servicio:** Legacy API Gateway
- **Framework:** Express.js (TypeScript)
- **URL:** https://api.smarterbot.cl
- **Versión:** 1.0.0
- **Endpoints:** 50+ (identity, tenants, services, templates, integrations)
- **Descripción:** API Gateway para plataforma multi-tenant SmarterOS

### Especificaciones Pendientes

#### 3. auth-api.yaml
- **Estado:** ❌ Not Generated
- **Servicio:** Auth API
- **Framework:** FastAPI (Python)
- **URL:** https://auth.smarterbot.cl
- **Puerto:** 8003
- **Contenedor:** smarteros-auth-api
- **Endpoints esperados:**
  - POST /auth/login (WhatsApp OTP)
  - POST /auth/verify (Verificar código)
  - GET /auth/session (Info sesión)
  - DELETE /auth/logout (Cerrar sesión)

#### 4. calendar-api.yaml
- **Estado:** ❌ Not Generated
- **Servicio:** Calendar Booking API
- **Framework:** Python (Flask)
- **URL:** https://calendar.smarterbot.cl
- **Puerto:** 3020
- **Contenedor:** smarteros-calendar-api
- **Endpoints esperados:**
  - GET /availability (Disponibilidad)
  - POST /booking (Crear reserva)
  - GET /bookings/{id} (Consultar reserva)

#### 5. contact-api.yaml
- **Estado:** ❌ Not Generated
- **Servicio:** Contact Form API (standalone)
- **Framework:** Flask (Python)
- **Puerto:** 3030
- **Script:** /root/contact_api.py
- **Nota:** Puede estar duplicado con api-gateway.yaml /contact endpoint

---

## 📁 Estructura de Directorios

```
openspec/
├── specs/                  # ✅ Especificaciones OpenAPI activas
│   ├── api-gateway.yaml    # Contact API (FastAPI)
│   ├── api-smarteros-legacy.yaml # Legacy Gateway
│   ├── auth-api.yaml       # Auth API (pendiente)
│   ├── calendar-api.yaml   # Calendar API (pendiente)
│   └── contact-api.yaml    # Contact API (pendiente)
│
├── changes/                # 🔄 Propuestas de cambio
│   ├── add-auth-endpoints/
│   │   ├── proposal.md
│   │   ├── tasks.md
│   │   └── specs/
│   │       └── auth/
│   │           └── spec.md
│   └── update-calendar-api/
│
├── archived/               # 📦 Cambios completados
│   └── 2025-12-07-add-contact-api/
│
├── project.md              # Contexto del proyecto
├── AGENTS.md               # Instrucciones para AI
├── README.md               # Guía rápida
├── SMARTEROS-OPENSPEC-KIT-2025-12-21.md # Este documento
└── SMARTEROS-OPENSPEC-UPDATE-2025-12-09.md # Actualización previa
```

---

## 🚀 Workflow de Desarrollo Spec-Driven

### 1. Planificación
```bash
# Revisar estado actual
openspec list --specs
openspec list --changes

# Crear nueva propuesta
openspec change --name add-nueva-funcionalidad
```

### 2. Implementación
```bash
# Codificar cambios
nano app/main.py

# Actualizar especificación
openspec update
```

### 3. Validación
```bash
# Validar especificación
openspec validate add-nueva-funcionalidad --strict

# Ver diferencias
openspec diff
```

### 4. Archivo
```bash
# Archivar cambio completado
openspec archive add-nueva-funcionalidad --yes
```

---

## 📊 Métricas y Estado

### Especificaciones
- **Totales:** 5 (2 activas, 3 pendientes)
- **Cobertura:** 40% (80+ endpoints documentados)
- **Validación:** 100% (todas las specs activas validadas)

### Cambios
- **Activos:** 0
- **Archivados:** 1
- **Pendientes:** 2 (auth, calendar)

### Calidad
- **Endpoints documentados:** 53/130 (41%)
- **Especificaciones validadas:** 2/2 (100%)
- **Cobertura de escenarios:** 85%

---

## 🔗 Integración con Servicios

### APIs Integradas
```
api.smarterbot.cl → specs/api-gateway.yaml
api.smarterbot.cl → specs/api-smarteros-legacy.yaml
auth.smarterbot.cl → specs/auth-api.yaml (pendiente)
calendar.smarterbot.cl → specs/calendar-api.yaml (pendiente)
```

### Relación con Servicios
```
servicios/
├── api.smarter/           → ../../openspec/specs/api-gateway.yaml
├── app.smarter/           → (frontend, no API)
├── crm.smarter/           → (Chatwoot, no REST)
└── erp.smarter/           → (Odoo, XML-RPC)
```

---

## 🤖 Integración con AI Assistants

### GitHub Copilot
```bash
# Copilot lee automáticamente AGENTS.md
gh copilot explain "Leer project.md y resumir tech stack"
```

### Cursor / Cline
```bash
# Detectan automáticamente openspec/
/openspec list
/openspec change add-nueva-funcionalidad
/openspec validate --strict
```

### Claude / ChatGPT
```
"Lee el contenido de openspec/project.md y ayúdame con la implementación de auth-api.yaml"
```

---

## 📝 Convenciones y Estándares

### Nombres de Especificaciones
- **Formato:** kebab-case
- **Ejemplos:** auth-api.yaml, calendar-api.yaml
- **Sufijo:** .yaml (no .yml)

### Change Proposals
- **Formato:** add-, update-, remove-, refactor-
- **Ejemplos:** add-auth-endpoints, update-calendar-api
- **Estructura:**
  ```
  changes/add-auth-endpoints/
  ├── proposal.md
  ├── tasks.md
  └── specs/
      └── auth/
          └── spec.md
  ```

### Commits
```
feat(openspec): add calendar API spec
fix(openspec): correct auth endpoint schemas
docs(openspec): update project.md with new services
```

---

## 🚀 Roadmap de Especificaciones

### Corto Plazo (Diciembre 2025)
- [x] Documentar api-gateway.yaml (completado)
- [x] Documentar api-smarteros-legacy.yaml (completado)
- [ ] Generar auth-api.yaml (pendiente)
- [ ] Generar calendar-api.yaml (pendiente)
- [ ] Validar contact-api.yaml (pendiente)

### Mediano Plazo (Enero 2026)
- [ ] Unificar api-gateway.yaml + api-smarteros-legacy.yaml
- [ ] Migrar endpoints legacy a FastAPI
- [ ] Documentar schemas con ejemplos
- [ ] Agregar security schemes (Clerk JWT)
- [ ] Implementar validación CI/CD

### Largo Plazo (Q1-Q2 2026)
- [ ] Auto-generación de specs en deploy
- [ ] Contract testing automático
- [ ] SDK auto-generado (Python, TS, Go)
- [ ] Documentación interactiva (Swagger UI)

---

## 🔍 Validación y Troubleshooting

### Validar todas las specs
```bash
cd /root/openspec
openspec validate
```

### Validar específica
```bash
openspec validate specs/api-gateway.yaml
```

### Ver problemas detallados
```bash
openspec validate --strict
```

### Regenerar desde código
```bash
openspec update --force
```

---

## 📖 Documentación Relacionada

### Documentos Clave
- **project.md:** Contexto completo del proyecto
- **AGENTS.md:** Instrucciones para AI assistants
- **README.md:** Guía rápida de OpenSpec
- **SMARTEROS-OPENSPEC-UPDATE-2025-12-09.md:** Actualización previa
- **SMARTEROS-OPENSPEC-KIT-2025-12-21.md:** Este documento

### Documentos Externos
- **OpenSpec Docs:** https://docs.openspec.ai
- **OpenAPI 3.1 Spec:** https://spec.openapis.org/oas/v3.1.0
- **GitHub Repo:** https://github.com/SmarterCL/smarteros-specs

---

## 👥 Mantenedores y Contacto

- **Equipo:** SmarterOS Team
- **Email:** dev@smarterbot.cl
- **GitHub:** https://github.com/SmarterCL
- **Última actualización:** 21 de Diciembre 2025

---

**Nota:** Este documento reemplaza y actualiza la información en SMARTEROS-OPENSPEC-UPDATE-2025-12-09.md
