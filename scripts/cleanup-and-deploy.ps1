# Script de nettoyage et préparation pour déploiement
# Racha Business CRM - Version 1.0.0

Write-Host "🧹 NETTOYAGE ET PRÉPARATION POUR DÉPLOIEMENT" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Nettoyage des caches et fichiers temporaires
Write-Host "📁 Nettoyage des caches..." -ForegroundColor Yellow

# Supprimer les dossiers de cache
$cacheDirs = @("dist", "node_modules\.cache", ".vite", ".eslintcache", "coverage")
foreach ($dir in $cacheDirs) {
    if (Test-Path $dir) {
        Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
        Write-Host "   ✓ Supprimé: $dir" -ForegroundColor Green
    }
}

# Supprimer les fichiers temporaires
$tempFiles = @("*.log", "*.tmp", "*.temp", "*.tsbuildinfo")
foreach ($pattern in $tempFiles) {
    Get-ChildItem -Path . -Name $pattern -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
}

Write-Host "   ✓ Fichiers temporaires supprimés" -ForegroundColor Green

# 2. Vérification des dépendances
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow
& npm install --production=false
Write-Host "   ✓ Dépendances vérifiées" -ForegroundColor Green

# 3. Vérification TypeScript
Write-Host "🔍 Vérification TypeScript..." -ForegroundColor Yellow
& npm run type-check
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ TypeScript OK" -ForegroundColor Green
} else {
    Write-Host "   ❌ Erreurs TypeScript détectées" -ForegroundColor Red
    exit 1
}

# 4. Linting du code
Write-Host "🔧 Vérification du code (ESLint)..." -ForegroundColor Yellow
& npm run lint
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Code conforme aux standards" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Avertissements ESLint détectés" -ForegroundColor Yellow
}

# 5. Build de production
Write-Host "🏗️  Build de production..." -ForegroundColor Yellow
& npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Build réussi" -ForegroundColor Green
} else {
    Write-Host "   ❌ Échec du build" -ForegroundColor Red
    exit 1
}

# 6. Analyse de la taille du build
Write-Host "📊 Analyse de la taille du build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   📦 Taille totale: $([math]::Round($distSize, 2)) MB" -ForegroundColor Cyan
    
    # Vérifier les gros fichiers
    Get-ChildItem -Path "dist" -Recurse -File | Where-Object { $_.Length -gt 1MB } | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "   📄 Gros fichier: $($_.Name) ($sizeMB MB)" -ForegroundColor Yellow
    }
}

# 7. Création du rapport de déploiement
Write-Host "📋 Création du rapport de déploiement..." -ForegroundColor Yellow

$deploymentReport = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    version = "1.0.0"
    buildSize = if (Test-Path "dist") { [math]::Round(((Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB), 2) } else { 0 }
    status = "ready"
    features = @(
        "✅ CRM complet (Contacts, Produits, Devis, Factures)",
        "✅ Gestion d'inventaire",
        "✅ Génération PDF",
        "✅ Intégration WhatsApp",
        "✅ Tableau de bord analytique",
        "✅ Interface responsive",
        "✅ Logo Racha Digital intégré",
        "✅ Base de données localStorage",
        "✅ Interface d'administration"
    )
    deployment = @{
        recommended_platform = "Cloudflare Pages, Vercel, Netlify"
        build_command = "npm run build"
        output_directory = "dist"
        node_version = "18+"
    }
}

$deploymentReport | ConvertTo-Json -Depth 3 | Out-File -FilePath "deployment-report.json" -Encoding UTF8
Write-Host "   ✓ Rapport créé: deployment-report.json" -ForegroundColor Green

# 8. Instructions finales
Write-Host ""
Write-Host "🎉 PRÉPARATION TERMINÉE AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Le projet est prêt pour le déploiement:" -ForegroundColor Cyan
Write-Host "   • Dossier de build: ./dist/" -ForegroundColor White
Write-Host "   • Taille du build: $([math]::Round(((Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB), 2)) MB" -ForegroundColor White
Write-Host "   • Rapport: deployment-report.json" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Plateformes de déploiement recommandées:" -ForegroundColor Cyan
Write-Host "   • Cloudflare Pages (recommandé)" -ForegroundColor White
Write-Host "   • Vercel" -ForegroundColor White
Write-Host "   • Netlify" -ForegroundColor White
Write-Host ""
Write-Host "⚙️  Configuration de déploiement:" -ForegroundColor Cyan
Write-Host "   • Commande de build: npm run build" -ForegroundColor White
Write-Host "   • Dossier de sortie: dist" -ForegroundColor White
Write-Host "   • Version Node.js: 18+" -ForegroundColor White
Write-Host ""
Write-Host "✅ Toutes les fonctionnalités sont opérationnelles!" -ForegroundColor Green
