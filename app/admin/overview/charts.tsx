'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
} from 'recharts';

const Charts = ({
    data: { salesData },
}: {
    data: {
        salesData: {
            month: string;
            totalSales: number;
        }[];
    };
}) => {
    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={salesData}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 10,
                    }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        className="stroke-muted"
                    />

                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        className="fill-muted-foreground"
                        dy={10}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        className="fill-muted-foreground"
                        tickFormatter={(value) => `$${value}`}
                        width={60}
                    />

                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted) / 0.4)' }}
                        contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid hsl(var(--border))',
                            backgroundColor: 'hsl(var(--card))',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}
                        formatter={(value: number) => [
                            `$${value.toLocaleString()}`,
                            'Sales',
                        ]}
                    />

                    <Bar
                        dataKey="totalSales"
                        className="fill-primary"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={55}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Charts;