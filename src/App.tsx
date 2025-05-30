import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "@/contexts/ProductContext";
import { AuthProvider, ProtectedRoute } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { useKeyboardNavigation } from "@/components/common/AccessibleComponents";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Inventory from "./pages/Inventory";
import Events from "./pages/Events";
import Chat from "./pages/Chat";
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
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const AppContent = () => {
  useKeyboardNavigation();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/events" element={<Events />} />
      <Route path="/quotes" element={<Quotes />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/bon-livraison" element={<BonLivraison />} />
      <Route path="/technical-sheets" element={<TechnicalSheets />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/products" element={<Products />} />
      <Route path="/services" element={<Services />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/invoice/new" element={<InvoiceForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
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
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
