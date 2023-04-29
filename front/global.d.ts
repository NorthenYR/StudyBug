

interface Date {
    getWeek: (start: number | undefined) => [Date, Date];
    addDays: (start: number | undefined) => [Date, Date];
}
