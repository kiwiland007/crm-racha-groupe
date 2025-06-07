import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "@/contexts/ProductContext";
import { AuthProvider, ProtectedRoute } from "@/contexts/AuthContext";
import { ContactProvider } from "@/contexts/ContactContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { QuoteProvider } from "@/contexts/QuoteContext";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import { EventProvider } from "@/contexts/EventContext";
import { BLProvider } from "@/contexts/BLContext";
import RouterErrorBoundary from "@/components/common/RouterErrorBoundary";
import { useKeyboardNavigation } from "@/components/common/AccessibleComponents";
import { useMonitoring } from "@/utils/monitoring";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Tasks from "./pages/Tasks";
import Notifications from "./pages/Notifications";
import Inventory from "./pages/Inventory";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Quotes from "./pages/Quotes";
import Analytics from "./pages/Analytics";
import Products from "./pages/Products";
import Services from "./pages/Services";
import InvoiceForm from "./pages/InvoiceForm";
import Invoices from "./pages/Invoices";
import BonLivraison from "./pages/BonLivraison";
import TechnicalSheets from "./pages/TechnicalSheets";
import DatabaseAdmin from "./components/DatabaseAdmin";
import { crmDatabase } from "./services/crmDatabaseService";

const queryClient = new QueryClient();

const AppContent = () => {
  useKeyboardNavigation();
  const { recordPageView } = useMonitoring();

  React.useEffect(() => {
    recordPageView(window.location.pathname);

    // Initialiser la base de données au démarrage
    crmDatabase.initialize().catch(console.error);
  }, [recordPageView]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/events" element={<Events />} />
      <Route path="/quotes" element={<Quotes />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/bon-livraison" element={<BonLivraison />} />
      <Route path="/technical-sheets" element={<TechnicalSheets />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/products" element={<Products />} />
      <Route path="/services" element={<Services />} />
      <Route path="/invoice/new" element={<InvoiceForm />} />
      <Route path="/database-admin" element={<DatabaseAdmin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <RouterErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ContactProvider>
          <TaskProvider>
            <NotificationProvider>
              <InventoryProvider>
                <EventProvider>
                  <QuoteProvider>
                    <InvoiceProvider>
                      <BLProvider>
                        <ProductProvider>
                          <TooltipProvider>
                            <Toaster />
                            <Sonner />
                            <BrowserRouter>
                              <ProtectedRoute>
                                <AppContent />
                              </ProtectedRoute>
                            </BrowserRouter>
                          </TooltipProvider>
                        </ProductProvider>
                      </BLProvider>
                    </InvoiceProvider>
                  </QuoteProvider>
                </EventProvider>
              </InventoryProvider>
            </NotificationProvider>
          </TaskProvider>
        </ContactProvider>
      </AuthProvider>
    </QueryClientProvider>
  </RouterErrorBoundary>
);

export default App;
