-- =====================================================
-- RACHA BUSINESS CRM - SCHÉMA DE BASE DE DONNÉES MARIADB
-- Version: 1.0.0
-- Date: 2024-12-19
-- Compatible: MariaDB v10.3.39+
-- =====================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS admin_crm
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE admin_crm;

-- =====================================================
-- TABLE DES UTILISATEURS
-- =====================================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee',
    avatar VARCHAR(500) NULL,
    phone VARCHAR(20) NULL,
    department VARCHAR(100) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- =====================================================
-- TABLE DES CONTACTS
-- =====================================================
CREATE TABLE contacts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    company VARCHAR(255) NULL,
    address TEXT NULL,
    type ENUM('client', 'prospect', 'supplier', 'partner') NOT NULL DEFAULT 'prospect',
    status ENUM('active', 'inactive', 'blocked') NOT NULL DEFAULT 'active',
    notes TEXT NULL,
    tags JSON NULL,
    created_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_company (company),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES CATÉGORIES DE PRODUITS
-- =====================================================
CREATE TABLE product_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    parent_id VARCHAR(36) NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_parent (parent_id),
    INDEX idx_active (is_active),
    FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES PRODUITS
-- =====================================================
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id VARCHAR(36) NULL,
    cost_price DECIMAL(10,2) DEFAULT 0.00,
    sale_price DECIMAL(10,2) NOT NULL,
    currency ENUM('MAD', 'EUR', 'USD') DEFAULT 'MAD',
    stock_quantity INT DEFAULT 0,
    min_quantity INT DEFAULT 0,
    stock_location VARCHAR(255) NULL,
    specifications JSON NULL,
    images JSON NULL,
    availability ENUM('available', 'out_of_stock', 'discontinued') DEFAULT 'available',
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_sku (sku),
    INDEX idx_category (category_id),
    INDEX idx_availability (availability),
    INDEX idx_active (is_active),
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES SERVICES
-- =====================================================
CREATE TABLE services (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category VARCHAR(100) NULL,
    pricing_type ENUM('fixed', 'hourly', 'project') NOT NULL DEFAULT 'fixed',
    price DECIMAL(10,2) NOT NULL,
    currency ENUM('MAD', 'EUR', 'USD') DEFAULT 'MAD',
    duration_hours INT NULL,
    requirements JSON NULL,
    availability ENUM('available', 'unavailable') DEFAULT 'available',
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_availability (availability),
    INDEX idx_active (is_active),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES DEVIS
-- =====================================================
CREATE TABLE quotes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NULL,
    client_phone VARCHAR(20) NULL,
    client_address TEXT NULL,
    project_name VARCHAR(255) NULL,
    description TEXT NULL,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    currency ENUM('MAD', 'EUR', 'USD') DEFAULT 'MAD',
    status ENUM('draft', 'sent', 'accepted', 'rejected', 'expired') DEFAULT 'draft',
    validity_days INT DEFAULT 30,
    payment_terms TEXT NULL,
    notes TEXT NULL,
    created_by VARCHAR(36) NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_quote_number (quote_number),
    INDEX idx_client (client_id),
    INDEX idx_status (status),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (client_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES ÉLÉMENTS DE DEVIS
-- =====================================================
CREATE TABLE quote_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    quote_id VARCHAR(36) NOT NULL,
    type ENUM('product', 'service') NOT NULL,
    product_id VARCHAR(36) NULL,
    service_id VARCHAR(36) NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    sort_order INT DEFAULT 0,
    
    INDEX idx_quote (quote_id),
    INDEX idx_product (product_id),
    INDEX idx_service (service_id),
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES FACTURES
-- =====================================================
CREATE TABLE invoices (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    quote_id VARCHAR(36) NULL,
    client_id VARCHAR(36) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NULL,
    client_phone VARCHAR(20) NULL,
    client_address TEXT NULL,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    currency ENUM('MAD', 'EUR', 'USD') DEFAULT 'MAD',
    status ENUM('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled') DEFAULT 'draft',
    payment_method VARCHAR(100) NULL,
    payment_terms TEXT NULL,
    notes TEXT NULL,
    due_date DATE NULL,
    paid_at TIMESTAMP NULL,
    created_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_quote (quote_id),
    INDEX idx_client (client_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES ÉLÉMENTS DE FACTURE
-- =====================================================
CREATE TABLE invoice_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    invoice_id VARCHAR(36) NOT NULL,
    type ENUM('product', 'service') NOT NULL,
    product_id VARCHAR(36) NULL,
    service_id VARCHAR(36) NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    sort_order INT DEFAULT 0,
    
    INDEX idx_invoice (invoice_id),
    INDEX idx_product (product_id),
    INDEX idx_service (service_id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES BONS DE LIVRAISON
-- =====================================================
CREATE TABLE delivery_notes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    delivery_number VARCHAR(50) UNIQUE NOT NULL,
    quote_id VARCHAR(36) NULL,
    invoice_id VARCHAR(36) NULL,
    client_id VARCHAR(36) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_address TEXT NULL,
    delivery_address TEXT NULL,
    delivery_date DATE NULL,
    status ENUM('pending', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
    notes TEXT NULL,
    signature_data TEXT NULL,
    delivered_by VARCHAR(36) NULL,
    delivered_at TIMESTAMP NULL,
    created_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_delivery_number (delivery_number),
    INDEX idx_quote (quote_id),
    INDEX idx_invoice (invoice_id),
    INDEX idx_client (client_id),
    INDEX idx_status (status),
    INDEX idx_delivery_date (delivery_date),
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (delivered_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES ÉVÉNEMENTS
-- =====================================================
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    client_id VARCHAR(36) NULL,
    client_name VARCHAR(255) NULL,
    location VARCHAR(500) NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    type ENUM('installation', 'maintenance', 'training', 'meeting', 'demo') NOT NULL,
    status ENUM('planned', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned',
    assigned_to JSON NULL,
    materials JSON NULL,
    notes TEXT NULL,
    created_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_client (client_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date),
    FOREIGN KEY (client_id) REFERENCES contacts(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DE L'INVENTAIRE
-- =====================================================
CREATE TABLE inventory (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_quantity INT DEFAULT 0,
    max_quantity INT NULL,
    location VARCHAR(255) NULL,
    status ENUM('available', 'reserved', 'maintenance', 'damaged') DEFAULT 'available',
    serial_number VARCHAR(255) NULL,
    notes TEXT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(36) NULL,
    
    INDEX idx_product (product_id),
    INDEX idx_status (status),
    INDEX idx_location (location),
    INDEX idx_serial_number (serial_number),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES TÂCHES
-- =====================================================
CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    contact_id VARCHAR(36) NULL,
    assigned_to VARCHAR(36) NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('todo', 'in_progress', 'completed', 'cancelled') DEFAULT 'todo',
    due_date DATETIME NULL,
    category ENUM('call', 'meeting', 'follow_up', 'demo', 'proposal', 'installation', 'maintenance', 'other') DEFAULT 'other',
    tags JSON NULL,
    notes TEXT NULL,
    completed_at TIMESTAMP NULL,
    created_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_contact (contact_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_priority (priority),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_category (category),
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES NOTIFICATIONS
-- =====================================================
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NULL,
    data JSON NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE DES LOGS D'AUDIT
-- =====================================================
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(36) NULL,
    changes JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource),
    INDEX idx_resource_id (resource_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE DES PARAMÈTRES SYSTÈME
-- =====================================================
CREATE TABLE system_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    key_name VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NULL,
    type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by VARCHAR(36) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key_name (key_name),
    INDEX idx_is_public (is_public),
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- INSERTION DES DONNÉES INITIALES
-- =====================================================

-- Utilisateur administrateur par défaut
INSERT INTO users (id, name, email, password_hash, role) VALUES 
('admin-001', 'Administrateur', 'admin@rachabusiness.com', '$2b$10$hash_placeholder', 'admin');

-- Catégories de produits par défaut
INSERT INTO product_categories (name, description) VALUES 
('Électronique', 'Produits électroniques et high-tech'),
('Mobilier', 'Mobilier de bureau et équipements'),
('Services', 'Services et prestations');

-- Paramètres système par défaut
INSERT INTO system_settings (key_name, value, type, description, is_public) VALUES 
('company_name', 'Racha Business Group', 'string', 'Nom de l\'entreprise', TRUE),
('company_email', 'contact@rachabusiness.com', 'string', 'Email de l\'entreprise', TRUE),
('company_phone', '+212 6 69 38 28 28', 'string', 'Téléphone de l\'entreprise', TRUE),
('default_currency', 'MAD', 'string', 'Devise par défaut', TRUE),
('tax_rate', '20', 'number', 'Taux de TVA par défaut (%)', TRUE);

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue des statistiques des devis
CREATE VIEW quote_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_quotes,
    SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_quotes,
    SUM(CASE WHEN status = 'accepted' THEN total ELSE 0 END) as accepted_amount,
    SUM(total) as total_amount
FROM quotes 
GROUP BY DATE(created_at);

-- Vue des produits en stock faible
CREATE VIEW low_stock_products AS
SELECT 
    p.id,
    p.name,
    p.sku,
    i.quantity,
    i.min_quantity,
    pc.name as category_name
FROM products p
JOIN inventory i ON p.id = i.product_id
LEFT JOIN product_categories pc ON p.category_id = pc.id
WHERE i.quantity <= i.min_quantity AND p.is_active = TRUE;

-- =====================================================
-- PROCÉDURES STOCKÉES UTILES
-- =====================================================

DELIMITER //

-- Procédure pour créer une facture à partir d'un devis
CREATE PROCEDURE CreateInvoiceFromQuote(
    IN quote_id_param VARCHAR(36),
    IN created_by_param VARCHAR(36)
)
BEGIN
    DECLARE invoice_id_var VARCHAR(36) DEFAULT (UUID());
    DECLARE invoice_number_var VARCHAR(50);
    
    -- Générer le numéro de facture
    SELECT CONCAT('FAC-', YEAR(NOW()), '-', LPAD((SELECT COUNT(*) + 1 FROM invoices WHERE YEAR(created_at) = YEAR(NOW())), 4, '0'))
    INTO invoice_number_var;
    
    -- Créer la facture
    INSERT INTO invoices (
        id, invoice_number, quote_id, client_id, client_name, client_email, 
        client_phone, client_address, subtotal, discount, tax, total, 
        currency, created_by
    )
    SELECT 
        invoice_id_var, invoice_number_var, id, client_id, client_name, 
        client_email, client_phone, client_address, subtotal, discount, 
        tax, total, currency, created_by_param
    FROM quotes 
    WHERE id = quote_id_param;
    
    -- Copier les éléments
    INSERT INTO invoice_items (
        invoice_id, type, product_id, service_id, name, description,
        quantity, unit_price, discount, total, sort_order
    )
    SELECT 
        invoice_id_var, type, product_id, service_id, name, description,
        quantity, unit_price, discount, total, sort_order
    FROM quote_items 
    WHERE quote_id = quote_id_param;
    
    -- Mettre à jour le statut du devis
    UPDATE quotes SET status = 'accepted' WHERE id = quote_id_param;
    
    SELECT invoice_id_var as invoice_id, invoice_number_var as invoice_number;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS POUR L'AUDIT
-- =====================================================

DELIMITER //

CREATE TRIGGER audit_quotes_insert AFTER INSERT ON quotes
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, resource, resource_id, changes)
    VALUES (NEW.created_by, 'CREATE', 'quote', NEW.id, JSON_OBJECT('quote_number', NEW.quote_number, 'total', NEW.total));
END //

CREATE TRIGGER audit_quotes_update AFTER UPDATE ON quotes
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, resource, resource_id, changes)
    VALUES (NEW.created_by, 'UPDATE', 'quote', NEW.id, JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status));
END //

DELIMITER ;

-- =====================================================
-- INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index composites pour les requêtes fréquentes
CREATE INDEX idx_quotes_client_status ON quotes(client_id, status);
CREATE INDEX idx_invoices_client_status ON invoices(client_id, status);
CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to, status);
CREATE INDEX idx_events_date_status ON events(start_date, status);

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Contacts de test
INSERT INTO contacts (id, name, email, phone, company, type, status) VALUES
('contact-001', 'Mohammed Alami', 'mohammed@alami-corp.ma', '+212 6 12 34 56 78', 'Alami Corporation', 'client', 'active'),
('contact-002', 'Fatima Benali', 'fatima@techno-solutions.ma', '+212 6 87 65 43 21', 'Techno Solutions', 'prospect', 'active'),
('contact-003', 'Ahmed Tazi', 'ahmed@tazi-group.ma', '+212 6 55 44 33 22', 'Tazi Group', 'client', 'active');

-- Produits de test
INSERT INTO products (id, name, description, sku, category_id, cost_price, sale_price, stock_quantity, min_quantity) VALUES
('product-001', 'Ordinateur Portable HP', 'HP EliteBook 840 G8', 'HP-ELB-840-G8', (SELECT id FROM product_categories WHERE name = 'Électronique' LIMIT 1), 8500.00, 12000.00, 15, 5),
('product-002', 'Bureau Exécutif', 'Bureau en bois massif 180x80cm', 'BUR-EXEC-180', (SELECT id FROM product_categories WHERE name = 'Mobilier' LIMIT 1), 2500.00, 4200.00, 8, 2),
('product-003', 'Imprimante Laser', 'Canon imageCLASS MF445dw', 'CAN-MF445DW', (SELECT id FROM product_categories WHERE name = 'Électronique' LIMIT 1), 1800.00, 2800.00, 12, 3);

-- Services de test
INSERT INTO services (id, name, description, category, pricing_type, price, duration_hours) VALUES
('service-001', 'Installation Réseau', 'Installation et configuration réseau informatique', 'IT', 'project', 5000.00, 16),
('service-002', 'Formation Bureautique', 'Formation Microsoft Office', 'Formation', 'hourly', 300.00, 8),
('service-003', 'Maintenance Préventive', 'Maintenance préventive équipements IT', 'Maintenance', 'fixed', 1500.00, 4);

-- Devis de test
INSERT INTO quotes (id, quote_number, client_id, client_name, client_email, project_name, subtotal, tax, total, status) VALUES
('quote-001', 'DEV-2024-0001', 'contact-001', 'Mohammed Alami', 'mohammed@alami-corp.ma', 'Équipement Bureau Casablanca', 16000.00, 3200.00, 19200.00, 'sent'),
('quote-002', 'DEV-2024-0002', 'contact-002', 'Fatima Benali', 'fatima@techno-solutions.ma', 'Installation Réseau Rabat', 8500.00, 1700.00, 10200.00, 'draft');

-- Éléments de devis
INSERT INTO quote_items (quote_id, type, product_id, name, quantity, unit_price, total) VALUES
('quote-001', 'product', 'product-001', 'Ordinateur Portable HP', 2.00, 12000.00, 24000.00),
('quote-001', 'product', 'product-002', 'Bureau Exécutif', 1.00, 4200.00, 4200.00),
('quote-002', 'service', 'service-001', 'Installation Réseau', 1.00, 5000.00, 5000.00);

-- Inventaire initial
INSERT INTO inventory (product_id, quantity, min_quantity, location, status) VALUES
('product-001', 15, 5, 'Entrepôt Principal - A1', 'available'),
('product-002', 8, 2, 'Entrepôt Principal - B2', 'available'),
('product-003', 12, 3, 'Entrepôt Principal - A3', 'available');

-- Événements de test
INSERT INTO events (id, title, description, client_id, client_name, location, start_date, end_date, type, status) VALUES
('event-001', 'Installation Équipements Alami Corp', 'Installation des ordinateurs et bureaux', 'contact-001', 'Mohammed Alami', 'Casablanca - Maarif', '2024-12-25 09:00:00', '2024-12-25 17:00:00', 'installation', 'planned'),
('event-002', 'Démonstration Techno Solutions', 'Présentation des solutions IT', 'contact-002', 'Fatima Benali', 'Rabat - Agdal', '2024-12-22 14:00:00', '2024-12-22 16:00:00', 'demo', 'planned');

-- Tâches de test
INSERT INTO tasks (id, title, description, contact_id, priority, status, due_date, category) VALUES
('task-001', 'Appeler Mohammed Alami', 'Confirmer la date d\'installation', 'contact-001', 'high', 'todo', '2024-12-20 10:00:00', 'call'),
('task-002', 'Préparer devis Tazi Group', 'Établir devis pour équipement complet', 'contact-003', 'medium', 'in_progress', '2024-12-21 17:00:00', 'proposal');

-- =====================================================
-- SCRIPT DE SAUVEGARDE AUTOMATIQUE
-- =====================================================

-- Créer un utilisateur pour les sauvegardes
CREATE USER IF NOT EXISTS 'backup_user'@'localhost' IDENTIFIED BY 'backup_password_2024!';
GRANT SELECT, LOCK TABLES ON racha_business_crm.* TO 'backup_user'@'localhost';

-- =====================================================
-- PROCÉDURES DE MAINTENANCE
-- =====================================================

DELIMITER //

-- Procédure de nettoyage des logs anciens
CREATE PROCEDURE CleanOldAuditLogs(IN days_to_keep INT)
BEGIN
    DELETE FROM audit_logs
    WHERE created_at < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);

    SELECT ROW_COUNT() as deleted_rows;
END //

-- Procédure de statistiques rapides
CREATE PROCEDURE GetDashboardStats()
BEGIN
    SELECT
        (SELECT COUNT(*) FROM contacts WHERE status = 'active') as active_contacts,
        (SELECT COUNT(*) FROM quotes WHERE status = 'sent') as pending_quotes,
        (SELECT COUNT(*) FROM invoices WHERE status = 'sent') as pending_invoices,
        (SELECT COUNT(*) FROM tasks WHERE status = 'todo') as pending_tasks,
        (SELECT COUNT(*) FROM products WHERE id IN (SELECT product_id FROM inventory WHERE quantity <= min_quantity)) as low_stock_products,
        (SELECT SUM(total) FROM invoices WHERE status = 'paid' AND MONTH(created_at) = MONTH(NOW())) as monthly_revenue;
END //

DELIMITER ;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
