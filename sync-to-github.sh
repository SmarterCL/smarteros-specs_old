#!/bin/bash
set -euo pipefail

echo "🔄 Sincronizando /root/openspec/ → smarteros-specs/openspec/"

# Copiar cambios (preservar permisos y timestamps)
rsync -av --delete \
  --exclude='.openspec-cache' \
  --exclude='*.lock' \
  /root/openspec/ \
  /root/smarteros-specs/openspec/

cd /root/smarteros-specs

# Check si hay cambios
if [[ -z $(git status --porcelain openspec/) ]]; then
  echo "✅ Sin cambios en openspec/"
  exit 0
fi

# Mostrar cambios
echo "📝 Cambios detectados:"
git status --short openspec/

# Commit automático con timestamp
TIMESTAMP=$(date +%Y-%m-%d-%H%M)
git add openspec/
git commit -m "chore(openspec): sync from VPS $TIMESTAMP

Auto-sync from /root/openspec/ to GitHub
Triggered by sync-to-github.sh"

# Push
echo "⬆️ Pushing to GitHub..."
git push origin main

echo "✅ Sincronizado exitosamente"
echo "📍 Commit: $(git rev-parse --short HEAD)"
