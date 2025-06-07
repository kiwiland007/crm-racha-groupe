import React, { Suspense } from "react";
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
import { LoadingFallback } from "@/components/common/LoadingFallback";
import Index from "./pages/Index";
import { ThemeProvider } from "next-themes";

// Lazy load routes
const Contacts = React.lazy(() => import("./pages/Contacts"));
const Tasks = React.lazy(() => import("./pages/Tasks"));
const Notifications = React.lazy(() => import("./pages/Notifications"));
const Inventory = React.lazy(() => import("./pages/Inventory"));
const Events = React.lazy(() => import("./pages/Events"));
const Settings = React.lazy(() => import("./pages/Settings"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Quotes = React.lazy(() => import("./pages/Quotes"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Products = React.lazy(() => import("./pages/Products"));
const Services = React.lazy(() => import("./pages/Services"));
const InvoiceForm = React.lazy(() => import("./pages/InvoiceForm"));
const Invoices = React.lazy(() => import("./pages/Invoices"));
const BonLivraison = React.lazy(() => import("./pages/BonLivraison"));
const TechnicalSheets = React.lazy(() => import("./pages/TechnicalSheets"));
const DatabaseAdmin = React.lazy(() => import("./components/DatabaseAdmin"));
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

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ProductProvider>
              <ContactProvider>
                <TaskProvider>
                  <NotificationProvider>
                    <InventoryProvider>
                      <QuoteProvider>
                        <InvoiceProvider>
                          <EventProvider>
                            <BLProvider>
                              <TooltipProvider>
                                <RouterErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <AppContent />
                                  </Suspense>
                                </RouterErrorBoundary>
                                <Toaster />
                                <Sonner />
                              </TooltipProvider>
                            </BLProvider>
                          </EventProvider>
                        </InvoiceProvider>
                      </QuoteProvider>
                    </InventoryProvider>
                  </NotificationProvider>
                </TaskProvider>
              </ContactProvider>
            </ProductProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
