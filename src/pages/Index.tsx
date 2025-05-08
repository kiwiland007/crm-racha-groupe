
import React from "react";
import Layout from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentContacts } from "@/components/dashboard/RecentContacts";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import { CreditCard, Receipt } from "lucide-react";
import InvoiceForm from "./InvoiceForm";
import RecentInvoices from "@/components/dashboard/RecentInvoices";

const Index = () => {
  return (
    <Layout title="Tableau de bord">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Chiffre d'affaires mensuel" 
            value="152 000 MAD" 
            icon={<CreditCard className="h-4 w-4 text-gray-500" />}
            trend={{ value: 12, positive: true }}
          />
          <StatCard 
            title="Factures en attente" 
            value="7" 
            icon={<Receipt className="h-4 w-4 text-gray-500" />}
            description="3 factures en retard"
          />
          <StatCard 
            title="Avances encaissées" 
            value="45 000 MAD" 
            icon={<CreditCard className="h-4 w-4 text-gray-500" />}
            trend={{ value: 8, positive: true }}
          />
          <StatCard 
            title="Clients du mois" 
            value="15" 
            icon={<CreditCard className="h-4 w-4 text-gray-500" />}
            trend={{ value: 5, positive: true }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SalesChart />
          <RecentInvoices />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RecentContacts />
          <UpcomingEvents />
          <InventoryStatus />
        </div>

        <div className="mt-8">
          <InvoiceForm />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
