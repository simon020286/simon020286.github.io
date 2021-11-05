import { format, parse } from 'date-fns';

export function parseAndFormat(date: string): string {
    return format(parse(date, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy')
}