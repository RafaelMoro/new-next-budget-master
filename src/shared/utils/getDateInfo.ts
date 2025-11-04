import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { ABBREVIATED_MONTHS, AbbreviatedMonthsType, CompleteMonthsType, MONTHS } from '../types/global.types';
import { createYearsArray } from './global.utils';

dayjs.extend(utc);
dayjs.extend(timezone);

interface UseDateProps {
  // for older records, the mont and complete month should be the before last month
  isOlderRecords?: boolean;
}

const getDateInfo = ({ isOlderRecords }: UseDateProps = {}) => {
  const dateOfToday = dayjs().tz('America/Mexico_City');
  const currentMonthNumber = dateOfToday.month();
  const currentMonth = ABBREVIATED_MONTHS[currentMonthNumber];
  const completeCurrentMonth = MONTHS[currentMonthNumber];
  const completeBeforeLastMonth = currentMonthNumber === 0 ? MONTHS[10] : MONTHS[currentMonthNumber - 2];

  // If we're on january, set last month as december
  const lastMonth = currentMonthNumber === 0 ? ABBREVIATED_MONTHS[11] : ABBREVIATED_MONTHS[currentMonthNumber - 1];
  const beforeLastMonth = currentMonthNumber === 0 ? ABBREVIATED_MONTHS[10] : ABBREVIATED_MONTHS[currentMonthNumber - 2];
  const beforeLastMonthComplete = currentMonthNumber === 0 ? MONTHS[10] : MONTHS[currentMonthNumber - 2];
  // If we're on january, set last month as december
  const completeLastMonth = currentMonthNumber === 0 ? MONTHS[11] : MONTHS[currentMonthNumber - 1];
  const currentYear = String(dateOfToday.year());
  const lastYear = String(dateOfToday.year() - 1);
  const yearOlderRecords = beforeLastMonth === 'Nov' || beforeLastMonth === 'Dec' ? String(dateOfToday.year() - 1) : String(dateOfToday.year());
  const yearLastMonth = lastMonth === 'Dec' ? lastYear : currentYear;
  const years: string[] = createYearsArray(currentYear);

  const month: AbbreviatedMonthsType = isOlderRecords ? beforeLastMonth : currentMonth;
  const completeMonth: CompleteMonthsType = isOlderRecords ? completeBeforeLastMonth : completeCurrentMonth;

  return {
    month,
    completeMonth,
    lastMonth,
    beforeLastMonth,
    beforeLastMonthComplete,
    years,
    year: currentYear,
    yearLastMonth,
    lastYear,
    yearOlderRecords,
    completeCurrentMonth,
    completeLastMonth,
  };
};

export { getDateInfo };