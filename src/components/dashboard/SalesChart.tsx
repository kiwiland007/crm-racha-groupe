
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SalesChart() {
  const data = [
    { month: "Jan", value: 45000 },
    { month: "Fév", value: 52000 },
    { month: "Mar", value: 48000 },
    { month: "Avr", value: 61000 },
    { month: "Mai", value: 55000 },
    { month: "Juin", value: 67000 },
    { month: "Juil", value: 72000 },
    { month: "Août", value: 70000 },
    { month: "Sep", value: 81000 },
    { month: "Oct", value: 75000 },
    { month: "Nov", value: 85000 },
    { month: "Déc", value: 94000 }
  ];

  const formatValue = (value: number) => {
    return `${value / 1000}k MAD`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle>Ventes</CardTitle>
        <Select defaultValue="year">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Cette année</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatValue} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()} MAD`, "Ventes"]} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1AB8B0"
                fillOpacity={0.2}
                fill="#1AB8B0"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
