import React from 'react';
import { Box, Typography } from '@mui/material';

function KanbanBoard({ schedules }) {
  const groupedSchedules = {
    high: schedules.filter((s) => s.priority === 'high'),
    moderate: schedules.filter((s) => s.priority === 'moderate'),
    low: schedules.filter((s) => s.priority === 'low'),
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
      {Object.keys(groupedSchedules).map((priority, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            backgroundColor: '#f4f4f4',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: 3,
            minWidth: '300px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              textAlign: 'center',
              color:
                priority === 'high'
                  ? '#EF476F'
                  : priority === 'moderate'
                  ? '#FFD166'
                  : '#06D6A0',
            }}
          >
            {priority.toUpperCase()} PRIORITY
          </Typography>
          {groupedSchedules[priority].map((schedule) => (
            <Box
              key={schedule.scheduleID}
              sx={{
                backgroundColor: schedule.colorCode,
                borderRadius: '15px',
                padding: '16px',
                mb: 3,
                color: '#ffffff',
                boxShadow: 3,
              }}
            >
              <Typography variant="h6">{schedule.title}</Typography>
              <Typography variant="body2">
                {schedule.startDate} - {schedule.endDate || "No End Date"}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default KanbanBoard;
