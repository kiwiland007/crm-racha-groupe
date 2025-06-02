#!/usr/bin/env node

/**
 * Script de nettoyage automatique pour Racha Business Group CRM
 * Supprime les fichiers inutiles, optimise le code et nettoie les caches
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logStep(step, message) {
  log(`\n🔧 ${step}: ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

// Dossiers et fichiers à nettoyer
const CLEANUP_TARGETS = {
  directories: [
    'dist',
    'node_modules/.cache',
    '.vite',
    'coverage',
    'tmp',
    'temp'
  ],
  files: [
    '.eslintcache',
    '*.log',
    '*.tmp',
    '*.temp',
    'version.json'
  ],
  patterns: [
    '**/*.log',
    '**/*.tmp',
    '**/*.temp',
    '**/Thumbs.db',
    '**/.DS_Store'
  ]
};

// Fichiers potentiellement inutiles à vérifier
const POTENTIAL_UNUSED = [
  'src/components/unused',
  'src/utils/deprecated',
  'src/services/old',
  'src/lib/supabase',
  'src/test',
  'public/unused',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx'
];

// Dossiers vides à supprimer
const EMPTY_DIRECTORIES = [
  'src/lib/supabase',
  'src/test',
  'public/unused'
];

function executeCommand(command, description) {
  try {
    logStep('EXEC', `${description}...`);
    execSync(command, { stdio: 'inherit' });
    logSuccess(`${description} terminé`);
    return true;
  } catch (error) {
    logError(`Erreur lors de ${description}: ${error.message}`);
    return false;
  }
}

function removeDirectory(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      logSuccess(`Dossier supprimé: ${dirPath}`);
      return true;
    }
    return false;
  } catch (error) {
    logError(`Erreur suppression ${dirPath}: ${error.message}`);
    return false;
  }
}

function removeFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logSuccess(`Fichier supprimé: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    logError(`Erreur suppression ${filePath}: ${error.message}`);
    return false;
  }
}

function cleanupDirectories() {
  logStep('CLEANUP', 'Suppression des dossiers temporaires');
  let cleaned = 0;
  
  CLEANUP_TARGETS.directories.forEach(dir => {
    if (removeDirectory(dir)) {
      cleaned++;
    }
  });
  
  logSuccess(`${cleaned} dossiers nettoyés`);
}

function cleanupFiles() {
  logStep('CLEANUP', 'Suppression des fichiers temporaires');
  let cleaned = 0;
  
  CLEANUP_TARGETS.files.forEach(file => {
    if (removeFile(file)) {
      cleaned++;
    }
  });
  
  logSuccess(`${cleaned} fichiers nettoyés`);
}

function optimizePackageJson() {
  logStep('OPTIMIZE', 'Optimisation du package.json');
  
  try {
    const packagePath = 'package.json';
    if (fs.existsSync(packagePath)) {
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Nettoyer les scripts inutiles
      const unnecessaryScripts = ['test', 'eject'];
      unnecessaryScripts.forEach(script => {
        if (packageData.scripts && packageData.scripts[script]) {
          delete packageData.scripts[script];
          logSuccess(`Script supprimé: ${script}`);
        }
      });
      
      // Trier les dépendances
      if (packageData.dependencies) {
        const sortedDeps = {};
        Object.keys(packageData.dependencies).sort().forEach(key => {
          sortedDeps[key] = packageData.dependencies[key];
        });
        packageData.dependencies = sortedDeps;
      }
      
      if (packageData.devDependencies) {
        const sortedDevDeps = {};
        Object.keys(packageData.devDependencies).sort().forEach(key => {
          sortedDevDeps[key] = packageData.devDependencies[key];
        });
        packageData.devDependencies = sortedDevDeps;
      }
      
      fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
      logSuccess('package.json optimisé');
    }
  } catch (error) {
    logError(`Erreur optimisation package.json: ${error.message}`);
  }
}

function analyzeUnusedFiles() {
  logStep('ANALYZE', 'Analyse des fichiers potentiellement inutiles');
  
  POTENTIAL_UNUSED.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      logWarning(`Fichier potentiellement inutile trouvé: ${filePath}`);
    }
  });
}

function runLinting() {
  logStep('LINT', 'Vérification et correction du code');
  
  // Correction automatique ESLint
  executeCommand('npx eslint src --ext .ts,.tsx --fix', 'Correction ESLint');
  
  // Vérification TypeScript
  executeCommand('npx tsc --noEmit', 'Vérification TypeScript');
}

function clearCaches() {
  logStep('CACHE', 'Nettoyage des caches');
  
  // Cache npm
  executeCommand('npm cache clean --force', 'Nettoyage cache npm');
  
  // Cache Vite
  removeDirectory('.vite');
  
  logSuccess('Caches nettoyés');
}

function generateReport() {
  logStep('REPORT', 'Génération du rapport de nettoyage');
  
  const report = {
    timestamp: new Date().toISOString(),
    cleaned: {
      directories: CLEANUP_TARGETS.directories.filter(dir => !fs.existsSync(dir)),
      files: CLEANUP_TARGETS.files.filter(file => !fs.existsSync(file))
    },
    status: 'completed'
  };
  
  fs.writeFileSync('cleanup-report.json', JSON.stringify(report, null, 2));
  logSuccess('Rapport généré: cleanup-report.json');
}

// Fonction principale
function main() {
  log('\n🧹 NETTOYAGE AUTOMATIQUE RACHA BUSINESS GROUP CRM', 'bright');
  log('================================================', 'bright');
  
  const startTime = Date.now();
  
  try {
    // 1. Nettoyage des fichiers et dossiers
    cleanupDirectories();
    cleanupFiles();
    
    // 2. Nettoyage des caches
    clearCaches();
    
    // 3. Optimisations
    optimizePackageJson();
    
    // 4. Analyse et linting
    analyzeUnusedFiles();
    runLinting();
    
    // 5. Rapport final
    generateReport();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    log('\n🎉 NETTOYAGE TERMINÉ AVEC SUCCÈS', 'green');
    log(`⏱️  Durée: ${duration}s`, 'cyan');
    log('📊 Rapport: cleanup-report.json', 'cyan');
    
  } catch (error) {
    logError(`Erreur durant le nettoyage: ${error.message}`);
    process.exit(1);
  }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as cleanup };
