import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Box } from '@mui/material';
import './CalendarHeatmap.css';

interface CalendarMoodHeatmapProps {
  startDate: Date;
  data: HeatmapData[];
  onDateClick: (date: string) => void;
}

export interface HeatmapData {
  date: string;
  count: number;
  mood: string;
}

const CalendarMoodHeatmap: React.FC<CalendarMoodHeatmapProps> = ({ startDate, data, onDateClick }) => {
  const endDate = new Date();

  return (
    <Box
      sx={{
        overflowX: 'auto',
        display: 'flex',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={data}
        classForValue={(value: any) => {
          if (!value || !value.mood) return 'color-empty';
          return `mood-${value.mood}`;
        }}
        tooltipDataAttrs={((value: any) => ({
          'data-tooltip': value?.date ? `${value.date} – Mood: ${value.mood}` : 'No data',
        })) as (value: any) => { [key: string]: string | number | boolean }}
        onClick={(value: any) => {
          if (value?.date) onDateClick(value.date);
        }}
        showWeekdayLabels={true}
      />
    </Box>
  );
};

export default CalendarMoodHeatmap;
