
import { 
  Users, 
  Package, 
  Calendar, 
  TrendingUp,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentContacts } from "@/components/dashboard/RecentContacts";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";

export default function Dashboard() {
  return (
    <Layout title="Tableau de bord">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value="128"
          icon={<Users className="h-4 w-4 text-gray-500" />}
          description="Ce mois"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Prospects"
          value="32"
          icon={<Users className="h-4 w-4 text-gray-500" />}
          description="Ce mois"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Équipements"
          value="45"
          icon={<Package className="h-4 w-4 text-gray-500" />}
          description="En stock"
          trend={{ value: 5, positive: false }}
        />
        <StatCard
          title="Évènements"
          value="12"
          icon={<Calendar className="h-4 w-4 text-gray-500" />}
          description="À venir"
          trend={{ value: 20, positive: true }}
        />
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <SalesChart />
        </div>
        <div className="lg:col-span-3">
          <UpcomingEvents />
        </div>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <RecentContacts />
        <InventoryStatus />
      </div>
    </Layout>
  );
}
