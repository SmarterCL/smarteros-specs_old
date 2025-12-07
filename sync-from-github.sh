#!/bin/bash
set -euo pipefail

echo "🔄 Sincronizando smarteros-specs/openspec/ → /root/openspec/"

cd /root/smarteros-specs

# Pull latest changes
echo "⬇️ Pulling from GitHub..."
git pull origin main --quiet

# Check si hay cambios en openspec/
CURRENT_COMMIT=$(git rev-parse HEAD)
LAST_SYNC_FILE="/tmp/openspec-last-sync"

if [[ -f "$LAST_SYNC_FILE" ]]; then
  LAST_SYNC=$(cat "$LAST_SYNC_FILE")
  if [[ "$CURRENT_COMMIT" == "$LAST_SYNC" ]]; then
    echo "✅ Ya estás actualizado (commit $CURRENT_COMMIT)"
    exit 0
  fi
fi

# Copiar cambios
echo "📝 Sincronizando archivos..."
rsync -av --delete \
  --exclude='.openspec-cache' \
  --exclude='*.lock' \
  /root/smarteros-specs/openspec/ \
  /root/openspec/

# Guardar commit actual
echo "$CURRENT_COMMIT" > "$LAST_SYNC_FILE"

echo "✅ Sincronizado exitosamente"
echo "📍 Commit: $(git rev-parse --short HEAD)"
