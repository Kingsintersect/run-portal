export function LoadingSkeleton() {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
                <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-muted/30">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <th key={i} className="p-4">
                                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 10 }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="border-b">
                                {Array.from({ length: 6 }).map((_, cellIndex) => (
                                    <td key={cellIndex} className="p-4">
                                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}