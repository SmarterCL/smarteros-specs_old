#!/usr/bin/env bash
set -e

echo "🧹 Limpiando VPS para migración a Dokploy"
echo ""
echo "⚠️  ADVERTENCIA: Este script va a:"
echo "   - Parar todos los contenedores Docker existentes"
echo "   - Eliminar contenedores huérfanos"
echo "   - Limpiar imágenes y volúmenes no utilizados"
echo "   - Eliminar archivos legacy del stack antiguo"
echo ""
read -p "¿Continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

echo ""
echo "[1/5] Parando contenedores existentes..."
docker ps -q | xargs -r docker stop || true
echo "✅ Contenedores parados"

echo ""
echo "[2/5] Eliminando contenedores..."
docker ps -aq | xargs -r docker rm || true
echo "✅ Contenedores eliminados"

echo ""
echo "[3/5] Limpiando imágenes huérfanas..."
docker image prune -af
echo "✅ Imágenes limpiadas"

echo ""
echo "[4/5] Limpiando volúmenes no utilizados..."
docker volume prune -f
echo "✅ Volúmenes limpiados"

echo ""
echo "[5/5] Limpiando archivos legacy..."
rm -rf /root/old-stack /root/legacy /root/*.old 2>/dev/null || true
mkdir -p /root/backups
mv /root/docker-compose*.yml /root/backups/ 2>/dev/null || true
echo "✅ Archivos legacy movidos a /root/backups/"

echo ""
echo "🎉 VPS limpio y listo para Dokploy"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar proyecto en Dokploy"
echo "2. Apuntar a repo: https://github.com/SmarterCL/smarteros-specs"
echo "3. Configurar variables de entorno desde .env.example"
echo "4. Desplegar stack: docker-compose.smarteros.yml"
echo ""
echo "🔗 Dokploy: https://dokploy.smarterbot.cl"
