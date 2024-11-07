import { format } from 'date-fns';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

export function formatTimeAgo(date: string | number | Date): string {
  return timeAgo.format(new Date(date));
}

export function compareDateOnly(date1: string | number | Date, date2: string | number | Date) {
  return format(date1, 'yyyy/MM/dd') === format(date2, 'yyyy/MM/dd');
}
