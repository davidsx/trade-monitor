'use client';

import {
  addDays,
  differenceInDays,
  startOfDay,
  subDays,
  format,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { cn } from '@/styles';
import { Weekdays } from '@/constants/date';
import { useState } from 'react';
import { ParsedTrade } from '@/types';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { compareDateOnly } from '@/utils';

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
      <div className="bg-teal01 flex min-h-10 w-full items-center justify-between rounded-full px-4 py-4">
        <button onClick={goToPrevMonth}>
          <IconChevronLeft />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xl" suppressHydrationWarning>
            {format(calendarDate, 'yyyy MMMM')}
          </span>
          <span className="text-sm uppercase">{trades.length || 'No'} Trades</span>
        </div>
        <button onClick={goToNextMonth}>
          <IconChevronRight />
        </button>
      </div>
      <div className="rounded-md">
        <div className="flex gap-1 py-2">
          {Weekdays.map((weekday) => (
            <div
              key={weekday}
              className="text-teal flex-1 rounded border border-slate-600 py-1 text-center text-xs md:text-base"
            >
              {weekday}
            </div>
          ))}
        </div>
        <div className="grid auto-cols-[60px] grid-cols-[repeat(7,minmax(0,1fr))] place-items-center gap-1">
          {Array.from({ length: daysInCalendar }).map((_, index) => {
            const date = startOfDay(addDays(startOfCalendar, index));
            const isWithinThisMonth = date.getMonth() === month;
            const isToday = compareDateOnly(date, today);
            // const rowOfDate = Math.ceil((index + 1) / 7);
            // const isFirstRow = rowOfDate === 1;
            // const isLastRow = rowOfDate === totalRowsInCalendar;
            // const isFirstColumn = index % 7 === 0;
            // const isLastColumn = (index + 1) % 7 === 0;

            const tradesOnDate = isWithinThisMonth
              ? trades.filter(
                  (trade) =>
                    trade.realized_pnl !== null && compareDateOnly(trade.timestamp, date),
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
                  'relative flex w-full flex-col items-start justify-start p-1',
                  'rounded border border-slate-600 md:aspect-square',
                  !isWithinThisMonth && 'text-grey font-thin',
                  isToday && 'bg-teal01',
                  // isFirstRow && 'md:border-t-0',
                  // isLastRow && 'md:border-b-0',
                  // isFirstColumn && 'md:border-l-0',
                  // isLastColumn && 'md:border-r-0',
                  pnlOnDate > 0 && 'bg-teal-500 bg-opacity-20 text-green-500',
                  pnlOnDate < 0 && 'bg-red-500 bg-opacity-20 text-red-500',
                )}
              >
                <div
                  className={cn(
                    'flex size-8 items-start justify-start rounded-full text-xs md:size-10 md:text-2xl',
                    isToday && 'border-b border-b-black',
                  )}
                  suppressHydrationWarning
                >
                  {date.getDate()}
                </div>
                <div
                  className={cn(
                    'flex min-w-9 items-center justify-center gap-0.5 text-xs md:text-base',
                    tradesOnDate.length === 0 && 'opacity-0',
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
