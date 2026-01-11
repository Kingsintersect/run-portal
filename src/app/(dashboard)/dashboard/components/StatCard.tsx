interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        positive: boolean;
    };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
    return (
        <div className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {trend && (
                        <p className={`text-xs flex items-center mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    {icon}
                </div>
            </div>
        </div>
    );
}