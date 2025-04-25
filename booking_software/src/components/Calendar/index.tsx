import React, { type Dispatch, type SetStateAction } from 'react';
import ReactCalendar from 'react-calendar';
import {add, format} from 'date-fns';
import { INTERVALS, STORE_CLOSING_TIME, STORE_OPENING_TIME } from '@/constants/config';
import type { DateTime } from '@/utils/types';

interface indexProps {
  date: DateTime
  setDate: Dispatch<SetStateAction<DateTime>>
};

const Index = ({setDate, date}: indexProps) => {

  const getTimes = () => {
    if(!date.justDate) return;

    const { justDate } = date;

    const beginning = add(justDate, { hours: STORE_OPENING_TIME })
    const end = add(justDate, { hours: STORE_CLOSING_TIME })
    const interval = INTERVALS;

    const times = [];

    for(let i = beginning; i <= end; i = add(i, {minutes: interval})) {
      times.push(i);
    }

    return times;
  }

  const times = getTimes();

  return <div className='h-screen flex flex-col justify-center items-center'>
    {date.justDate ? (
      <div className='flex gap-4'>
        {times?.map((time, i) => (
          <div key={`time-${i}`} className= 'rounded-sm p-2'>
            <button type='button' onClick={() => setDate((prev) => ({...prev, dateTime: time}))}>
              {format(time, 'kk:mm')}
            </button>
          </div>
        ))}
      </div>
    ) : (
      <ReactCalendar minDate={new Date()}
      className='REACT_CALENDAR p-2'
      view='month'
      onClickDay={(date) => setDate((prev) => ({...prev, justDate: date}))}
    />
    )}

  </div>
};

export default Index;