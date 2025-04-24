"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
    {
        name: "Sarah J.",
        properties: 24,
        sales: 4.2,
        rating: 4.8,
    },
    {
        name: "Michael C.",
        properties: 18,
        sales: 3.1,
        rating: 4.5,
    },
    {
        name: "Emily R.",
        properties: 12,
        sales: 2.8,
        rating: 4.7,
    },
    {
        name: "David M.",
        properties: 9,
        sales: 1.5,
        rating: 4.2,
    },
    {
        name: "Grace B.",
        properties: 15,
        sales: 2.3,
        rating: 4.6,
    },
]

export default function AgentsAnalytics() {
    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <defs>
                        <linearGradient id="colorProperties" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.2} />
                        </linearGradient>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.2} />
                        </linearGradient>
                        <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e0e0e0" }} />
                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: "#e0e0e0" }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 5]}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: "#e0e0e0" }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            border: "none",
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar
                        yAxisId="left"
                        dataKey="properties"
                        name="Properties"
                        fill="url(#colorProperties)"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                        animationDuration={1500}
                    />
                    <Bar
                        yAxisId="left"
                        dataKey="sales"
                        name="Sales (ZMW M)"
                        fill="url(#colorSales)"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                        animationDuration={1500}
                    />
                    <Bar
                        yAxisId="right"
                        dataKey="rating"
                        name="Rating"
                        fill="url(#colorRating)"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
