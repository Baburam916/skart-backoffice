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
  { name: "Mon", actual: 12, target: 10 },
  { name: "Tue", actual: 18, target: 15 },
  { name: "Wed", actual: 8, target: 12 },
  { name: "Thu", actual: 22, target: 20 },
  { name: "Fri", actual: 30, target: 28 },
  { name: "Sat", actual: 25, target: 22 },
  { name: "Sun", actual: 15, target: 18 },
];

const monthlyData = [
  { name: "Jan", actual: 20, target: 18 },
  { name: "Feb", actual: 40, target: 35 },
  { name: "Mar", actual: 15, target: 18 },
  { name: "Apr", actual: 50, target: 45 },
  { name: "May", actual: 45, target: 48 },
  { name: "Jun", actual: 25, target: 28 },
  { name: "Jul", actual: 42, target: 35 },
  { name: "Aug", actual: 30, target: 22 },
  { name: "Sep", actual: 60, target: 65 },
  { name: "Oct", actual: 42, target: 38 },
  { name: "Nov", actual: 65, target: 60 },
  { name: "Dec", actual: 70, target: 65 },
];

const yearlyData = [
  { name: "2020", actual: 200, target: 180 },
  { name: "2021", actual: 350, target: 310 },
  { name: "2022", actual: 420, target: 390 },
  { name: "2023", actual: 510, target: 480 },
  { name: "2024", actual: 630, target: 590 },
  { name: "2025", actual: 720, target: 680 },
];

interface ChartDataPoint {
  name: string;
  target: number;
  actual: number;
}

interface Props {
  period?: "Daily" | "Monthly" | "Yearly";
  data?: ChartDataPoint[];
}

export default function Daily_sale_lineChart({ period = "Monthly", data }: Props) {
  const chartData =
    data ??
    (period === "Daily"
      ? dailyData
      : period === "Yearly"
      ? yearlyData
      : monthlyData);

  return (
    <ResponsiveContainer width="100%" height={370}>
      <BarChart data={chartData} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dfc898" />
        <XAxis dataKey="name" axisLine={{ stroke: "#dfc898 " }} tickLine={{ stroke: "#ccc" }} />
        <YAxis axisLine={{ stroke: "#dfc898 " }} tickLine={{ stroke: "#dfc898 " }} />
       <Tooltip cursor={{ fill: "#fcf7ee", opacity: 1.1 }} />
        <Legend />
        <Bar
          dataKey="actual"
          fill="#efb847"
          radius={[6, 6, 0, 0]}
          name="Actual"
        />
        <Bar
          dataKey="target"
          fill="#D1D5DB"
          radius={[6, 6, 0, 0]}
          name="Target"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}