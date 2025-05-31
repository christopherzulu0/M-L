"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useAgentPerformance } from "@/hooks/useAgentPerformance"

interface AgentsAnalyticsProps {
    timePeriod: string;
}

export default function AgentsAnalytics({ timePeriod }: AgentsAnalyticsProps) {
    // Fetch agent performance data using the custom hook
    const { 
        data: performanceData, 
        isLoading, 
        error 
    } = useAgentPerformance(timePeriod)

    // Handle loading state
    if (isLoading) {
        return (
            <div className="h-[400px] w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-muted-foreground">Loading performance data...</p>
                </div>
            </div>
        )
    }

    // Handle error state
    if (error) {
        return (
            <div className="h-[400px] w-full flex items-center justify-center">
                <div className="text-center text-red-600 dark:text-red-400">
                    <p className="font-medium">Error loading performance data</p>
                    <p className="text-sm mt-1">{error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={performanceData}
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
