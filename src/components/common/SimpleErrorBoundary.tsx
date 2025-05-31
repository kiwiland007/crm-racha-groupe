import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string;
}

export class SimpleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: ''
    };
  }

  static getDerivedStateFromError(): Partial<State> {
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SimpleErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '32rem',
            width: '100%'
          }}>
            {/* Icône d'erreur */}
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#fef2f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <AlertTriangle style={{ width: '2rem', height: '2rem', color: '#dc2626' }} />
            </div>

            {/* Titre */}
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Oups ! Une erreur s'est produite
            </h1>

            {/* Description */}
            <p style={{
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              Nous nous excusons pour ce désagrément. Cliquez sur "Retour à l'accueil" pour continuer.
            </p>

            {/* ID d'erreur */}
            <div style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              color: '#6b7280',
              marginBottom: '1.5rem',
              display: 'inline-block'
            }}>
              ID: {this.state.errorId}
            </div>

            {/* Boutons d'action */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
              >
                <Home style={{ width: '1rem', height: '1rem' }} />
                Retour à l'accueil
              </button>

              <button
                onClick={() => {
                  console.log('Reloading...');
                  window.location.reload();
                }}
                style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                Recharger la page
              </button>
            </div>

            {/* Navigation directe */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1rem'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '0.75rem'
              }}>
                Ou naviguez directement vers :
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center'
              }}>
                {[
                  { label: 'Dashboard', path: '/' },
                  { label: 'Contacts', path: '/contacts' },
                  { label: 'Produits', path: '/products' },
                  { label: 'Devis', path: '/quotes' },
                  { label: 'Factures', path: '/invoices' }
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      window.location.href = item.path;
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      border: 'none',
                      borderRadius: '0.25rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#374151';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Support */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1rem',
              marginTop: '1rem',
              fontSize: '0.75rem',
              color: '#9ca3af'
            }}>
              <p>Support technique :</p>
              <p style={{ marginTop: '0.25rem' }}>
                <a 
                  href="mailto:support@rachabusiness.com"
                  style={{ color: '#2563eb', textDecoration: 'none' }}
                >
                  support@rachabusiness.com
                </a>
                {' | '}
                <a 
                  href="tel:+212669382828"
                  style={{ color: '#2563eb', textDecoration: 'none' }}
                >
                  +212 6 69 38 28 28
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SimpleErrorBoundary;
