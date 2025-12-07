# OpenSpec Governance - Quick Start

Este es el **sistema de gobierno de contratos API** de SmarterOS.

---

## 🚀 Para Desarrolladores: Modificar una API

### 1. Hacer cambios en tu API
```bash
cd /root/smarteros-auth-api
# ... desarrollar cambios ...
```

### 2. Actualizar el spec
```bash
vim openspec/spec.yaml
```

### 3. Copiar a repo central
```bash
cp openspec/spec.yaml /root/smarteros-specs/openspec/specs/auth-api.yaml
```

### 4. Crear PR
```bash
cd /root/smarteros-specs
git checkout -b feat/auth-api-v1.2.0
git add openspec/specs/auth-api.yaml
git commit -m "update: auth-api v1.2.0 - add JWT refresh endpoint"
git push origin feat/auth-api-v1.2.0
```

### 5. El pipeline valida automáticamente
- ✅ Sintaxis correcta
- ⚠️ Breaking changes (alerta si hay)
- 🚫 Bloquea merge si hay errores

### 6. Después del merge, desplegar
```bash
cd /root/smarteros-auth-api
# El symlink ya apunta al nuevo spec
# Desplegar con confianza
```

---

## 🔍 Comandos Útiles

### Validar un spec
```bash
openspec check openspec/specs/auth-api.yaml
```

### Comparar versiones
```bash
openspec diff old-spec.yaml new-spec.yaml
```

### Ver diferencias con main
```bash
git fetch origin main
git diff origin/main openspec/specs/auth-api.yaml
```

---

## 📂 Estructura

```
smarteros-specs/
├── openspec/specs/              ← Fuente única de verdad
│   ├── auth-api.yaml
│   ├── api-gateway.yaml
│   ├── calendar-api.yaml
│   └── contact-api.yaml
└── .github/workflows/
    └── openspec-validation.yml  ← Pipeline automático
```

---

## 🆘 Troubleshooting

### El pipeline falla
```bash
# Ver logs en GitHub Actions
# Correr validación localmente:
cd /root/smarteros-specs
openspec check openspec/specs/<tu-api>.yaml
```

### Breaking change detectado
```bash
# Revisar el diff
openspec diff origin/main:openspec/specs/auth-api.yaml openspec/specs/auth-api.yaml

# Si es intencional, incrementar versión major:
# version: "1.0.0" → "2.0.0"
```

### Symlink roto
```bash
# Recrear symlink
cd /root/smarteros-auth-api
rm openapi.yaml
ln -sf /root/smarteros-specs/openspec/specs/auth-api.yaml openapi.yaml
```

---

## 📚 Documentación Completa

- **Estado del sistema**: `OPENSPEC-GOVERNANCE-STATUS.md`
- **Implementación**: `OPENSPEC-GOVERNANCE-COMPLETE.md`
- **Visual summary**: `OPENSPEC-SUMMARY-VISUAL.txt`

---

**Última actualización**: 2025-12-07
