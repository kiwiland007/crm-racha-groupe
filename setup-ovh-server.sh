#!/bin/bash

# Script d'installation automatique du serveur OVH VPS
# Pour Racha Business Digital CRM
# Usage: curl -sSL https://raw.githubusercontent.com/votre-repo/setup-ovh-server.sh | bash

set -e

# Configuration
DOMAIN="votre-domaine.ovh"
EMAIL="contact@rachabusiness.com"
PROJECT_NAME="maroctactile-crm-hub"
WEB_ROOT="/var/www/html"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Vérification des privilèges root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "Ce script doit être exécuté en tant que root"
        exit 1
    fi
}

# Mise à jour du système
update_system() {
    log_info "Mise à jour du système..."
    apt update && apt upgrade -y
    log_success "Système mis à jour"
}

# Installation des paquets essentiels
install_packages() {
    log_info "Installation des paquets essentiels..."
    
    apt install -y \
        nginx \
        certbot \
        python3-certbot-nginx \
        ufw \
        curl \
        wget \
        git \
        unzip \
        htop \
        nano \
        rsync \
        fail2ban
    
    log_success "Paquets installés"
}

# Installation de Node.js
install_nodejs() {
    log_info "Installation de Node.js..."
    
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    
    # Vérification
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    log_success "Node.js $NODE_VERSION et npm $NPM_VERSION installés"
}

# Configuration du firewall
configure_firewall() {
    log_info "Configuration du firewall..."
    
    # Réinitialiser UFW
    ufw --force reset
    
    # Règles par défaut
    ufw default deny incoming
    ufw default allow outgoing
    
    # Autoriser les services essentiels
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    
    # Activer UFW
    ufw --force enable
    
    log_success "Firewall configuré"
}

# Configuration de Fail2Ban
configure_fail2ban() {
    log_info "Configuration de Fail2Ban..."
    
    cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF
    
    systemctl enable fail2ban
    systemctl start fail2ban
    
    log_success "Fail2Ban configuré"
}

# Création des dossiers
create_directories() {
    log_info "Création des dossiers..."
    
    mkdir -p "$WEB_ROOT"
    mkdir -p "/var/backups/crm"
    mkdir -p "/var/log/nginx"
    
    # Permissions
    chown -R www-data:www-data "$WEB_ROOT"
    chmod -R 755 "$WEB_ROOT"
    
    log_success "Dossiers créés"
}

# Configuration de Nginx
configure_nginx() {
    log_info "Configuration de Nginx..."
    
    # Sauvegarde de la configuration par défaut
    if [ -f "/etc/nginx/sites-enabled/default" ]; then
        rm /etc/nginx/sites-enabled/default
    fi
    
    # Configuration optimisée
    cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 10M;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;

    # Logging Settings
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;

    # Virtual Host Configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF
    
    # Configuration du site
    cat > "/etc/nginx/sites-available/$PROJECT_NAME" << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root $WEB_ROOT;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    access_log /var/log/nginx/${PROJECT_NAME}-access.log;
    error_log /var/log/nginx/${PROJECT_NAME}-error.log;
}
EOF
    
    # Activer le site
    ln -sf "/etc/nginx/sites-available/$PROJECT_NAME" "/etc/nginx/sites-enabled/"
    
    # Tester et redémarrer Nginx
    nginx -t
    systemctl enable nginx
    systemctl restart nginx
    
    log_success "Nginx configuré"
}

# Page d'accueil temporaire
create_temp_page() {
    log_info "Création de la page temporaire..."
    
    cat > "$WEB_ROOT/index.html" << EOF
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Racha Business Digital CRM - En cours d'installation</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1a2b3c; margin-bottom: 20px; }
        .status { color: #28a745; font-weight: bold; }
        .info { color: #6c757d; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Racha Business Digital CRM</h1>
        <p class="status">✅ Serveur configuré avec succès!</p>
        <p>Le système CRM est en cours d'installation.</p>
        <p class="info">
            Serveur: $(hostname)<br>
            Date: $(date)<br>
            Status: Prêt pour le déploiement
        </p>
    </div>
</body>
</html>
EOF
    
    chown www-data:www-data "$WEB_ROOT/index.html"
    
    log_success "Page temporaire créée"
}

# Configuration SSL automatique
setup_ssl() {
    log_info "Configuration SSL avec Let's Encrypt..."
    
    if [ "$DOMAIN" != "votre-domaine.ovh" ]; then
        certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive
        
        # Renouvellement automatique
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        
        log_success "SSL configuré"
    else
        log_warning "Domaine par défaut détecté - SSL non configuré"
        log_info "Configurez votre domaine et relancez: certbot --nginx -d votre-domaine.ovh"
    fi
}

# Optimisations système
optimize_system() {
    log_info "Optimisations système..."
    
    # Optimisations réseau
    cat >> /etc/sysctl.conf << 'EOF'

# Optimisations pour serveur web
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 12582912 16777216
net.ipv4.tcp_wmem = 4096 12582912 16777216
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_tw_reuse = 1
EOF
    
    sysctl -p
    
    log_success "Système optimisé"
}

# Résumé de l'installation
installation_summary() {
    log_success "🎉 Installation terminée!"
    echo
    echo "=== RÉSUMÉ DE L'INSTALLATION ==="
    echo "Serveur web: Nginx"
    echo "SSL: Let's Encrypt (si domaine configuré)"
    echo "Firewall: UFW activé"
    echo "Sécurité: Fail2Ban configuré"
    echo "Dossier web: $WEB_ROOT"
    echo
    echo "=== PROCHAINES ÉTAPES ==="
    echo "1. Configurez votre domaine DNS vers cette IP"
    echo "2. Modifiez le script deploy-ovh.sh avec vos paramètres"
    echo "3. Lancez le déploiement: ./deploy-ovh.sh"
    echo
    echo "=== COMMANDES UTILES ==="
    echo "Status Nginx: systemctl status nginx"
    echo "Logs Nginx: tail -f /var/log/nginx/error.log"
    echo "Renouveler SSL: certbot renew"
    echo "Status Firewall: ufw status"
    echo
}

# Fonction principale
main() {
    log_info "🚀 Installation du serveur OVH VPS pour Racha Business Digital CRM"
    
    check_root
    update_system
    install_packages
    install_nodejs
    configure_firewall
    configure_fail2ban
    create_directories
    configure_nginx
    create_temp_page
    setup_ssl
    optimize_system
    installation_summary
}

# Exécution
main "$@"
