interface CalendarEvent {
    id: string;
    title: string;
    time: string;
    type: 'class' | 'assignment' | 'exam' | 'meeting';
}

interface CalendarWidgetProps {
    date: Date;
    events: CalendarEvent[];
}

export function CalendarWidget({ date, events }: CalendarWidgetProps) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }).format(date);

    const getEventTypeColor = (type: CalendarEvent['type']) => {
        switch (type) {
            case 'class':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'assignment':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
            case 'exam':
                return 'bg-primary/10 text-primary dark:bg-primary/20';
            case 'meeting':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Today's Schedule</h3>
                <p className="text-muted-foreground">{formattedDate}</p>
            </div>

            <div className="space-y-3">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="flex items-center p-3 rounded-md border">
                            <div className="mr-4 text-sm text-center">
                                <div>{event.time}</div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">{event.title}</h4>
                            </div>
                            <div className={`px-2 py-1 rounded-md text-xs font-medium ${getEventTypeColor(event.type)}`}>
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-6 text-muted-foreground">No events scheduled for today</p>
                )}
            </div>
        </div>
    );
}