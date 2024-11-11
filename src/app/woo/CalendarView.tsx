'use client';

import {
  addDays,
  differenceInDays,
  startOfDay,
  subDays,
  format,
  startOfMonth,
  endOfMonth,
  endOfDay,
} from 'date-fns';
import { cn } from '@/styles';
import { Weekdays } from '@/constants/date';
import { useState } from 'react';
import { ParsedTrade } from '@/types';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { compareDateOnly } from '@/utils';
import { fromZonedTime } from 'date-fns-tz';

export default function CalendarView({ trades }: { trades: ParsedTrade[] }): JSX.Element {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const today = new Date();
  let startOfCalendar = startOfMonth(new Date(year, month, 1));
  while (startOfCalendar.getDay() > 0) {
    startOfCalendar = startOfDay(subDays(startOfCalendar, 1));
  }
  let endOfCalendar = endOfMonth(new Date(year, month, 1));
  while (endOfCalendar.getDay() < 6) {
    endOfCalendar = startOfDay(addDays(endOfCalendar, 1));
  }
  const daysInCalendar = differenceInDays(endOfCalendar, startOfCalendar) + 1;

  const calendarDate = new Date(year, month, 1);
  const prevMonth = (month - 1) % 12;
  const prevYear = prevMonth === 11 ? year - 1 : year;
  const nextMonth = (month + 1) % 12;
  const nextYear = nextMonth === 0 ? year + 1 : year;

  const goToPrevMonth = () => {
    setMonth(prevMonth);
    setYear(prevYear);
  };

  const goToNextMonth = () => {
    setMonth(nextMonth);
    setYear(nextYear);
  };

  return (
    <div className="flex w-full flex-col justify-start gap-2">
      <div className="bg-teal01 flex min-h-10 w-full items-center justify-between rounded-full">
        {/* <button onClick={goToPrevMonth}>
          <IconChevronLeft />
        </button> */}
        <div className="flex flex-row items-center justify-between w-full">
          <span className="text-xl" suppressHydrationWarning>
            {format(calendarDate, 'yyyy MMMM')}
          </span>
          <span className="text-sm uppercase">{trades.length || 'No'} Trades</span>
        </div>
        {/* <button onClick={goToNextMonth}>
          <IconChevronRight />
        </button> */}
      </div>
      <div className="flex flex-col gap-1 rounded-md">
        <div className="flex gap-1 rounded-md bg-zinc-800 py-2">
          {Weekdays.map((weekday) => (
            <div
              key={weekday}
              className="text-teal flex-1 py-1 text-center text-xs uppercase text-zinc-500"
            >
              {weekday}
            </div>
          ))}
        </div>
        <div className="grid auto-cols-[60px] grid-cols-[repeat(7,minmax(0,1fr))] place-items-center gap-1">
          {Array.from({ length: daysInCalendar }).map((_, index) => {
            const date = addDays(startOfCalendar, index);
            const dateStart = fromZonedTime(date, 'UTC');
            const dateEnd = fromZonedTime(endOfDay(date), 'UTC');
            const isWithinThisMonth = date.getMonth() === month;
            const isToday = compareDateOnly(date, today);

            const tradesOnDate = isWithinThisMonth
              ? trades.filter(
                  (trade) =>
                    trade.realized_pnl !== null &&
                    trade.timestamp >= dateStart.getTime() &&
                    trade.timestamp <= dateEnd.getTime(),
                )
              : [];
            const pnlOnDate = tradesOnDate.reduce(
              (acc, trade) => acc + (trade.realized_pnl || 0),
              0,
            );
            return (
              <div
                key={date.getTime()}
                className={cn(
                  'min-size-8 md:min-size-10 relative flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 p-1 text-center',
                  pnlOnDate > 0 && 'bg-green-700 bg-opacity-20',
                  pnlOnDate < 0 && 'bg-red-700 bg-opacity-20',
                )}
              >
                <div
                  className={cn(
                    'text-xs text-zinc-300',
                    !isWithinThisMonth && 'font-thin text-zinc-600',
                    isToday && 'border-b border-b-zinc-300',
                  )}
                  suppressHydrationWarning
                >
                  {date.getDate()}
                </div>
                <div
                  className={cn(
                    'flex min-w-9 items-center justify-center gap-0.5 text-xs',
                    tradesOnDate.length === 0 && 'opacity-0',
                    pnlOnDate > 0 && 'text-green-500',
                    pnlOnDate < 0 && 'text-red-500',
                  )}
                >
                  <span>{pnlOnDate.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
