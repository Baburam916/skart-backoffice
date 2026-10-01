import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const dailyData = [
  { name: "Mon", profit: 12, sales: 10 },
  { name: "Tue", profit: 18, sales: 15 },
  { name: "Wed", profit: 8, sales: 12 },
  { name: "Thu", profit: 22, sales: 20 },
  { name: "Fri", profit: 30, sales: 28 },
  { name: "Sat", profit: 25, sales: 22 },
  { name: "Sun", profit: 15, sales: 18 },
];

const monthlyData = [
  { name: "Jan", profit: 20, sales: 18 },
  { name: "Feb", profit: 40, sales: 35 },
  { name: "Mar", profit: 15, sales: 18 },
  { name: "Apr", profit: 50, sales: 45 },
  { name: "May", profit: 45, sales: 48 },
  { name: "Jun", profit: 25, sales: 28 },
  { name: "Jul", profit: 42, sales: 35 },
  { name: "Aug", profit: 30, sales: 22 },
  { name: "Sep", profit: 60, sales: 65 },
  { name: "Oct", profit: 42, sales: 38 },
  { name: "Nov", profit: 65, sales: 60 },
  { name: "Dec", profit: 70, sales: 65 },
];

const yearlyData = [
  { name: "2020", profit: 200, sales: 180 },
  { name: "2021", profit: 350, sales: 310 },
  { name: "2022", profit: 420, sales: 390 },
  { name: "2023", profit: 510, sales: 480 },
  { name: "2024", profit: 630, sales: 590 },
  { name: "2025", profit: 720, sales: 680 },
];

interface Props {
  period?: "Daily" | "Monthly" | "Yearly";
}

export default function Daily_sale_lineChart({ period = "Monthly" }: Props) {
  const data =
    period === "Daily"
      ? dailyData
      : period === "Yearly"
      ? yearlyData
      : monthlyData;

  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="profit"
          fill="#efb847"
          radius={[6, 6, 0, 0]}
          name="Product Profit"
        />
        <Bar
          dataKey="sales"
          fill="#D1D5DB"
          radius={[6, 6, 0, 0]}
          name="Author Sales"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}