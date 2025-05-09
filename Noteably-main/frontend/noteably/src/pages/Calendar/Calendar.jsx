import React, { useEffect, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import KanbanBoard from '../../KanbanBoard';
import { Box, Tabs, Tab } from '@mui/material';
import { axiosRequest } from '../../services/studentService';

const apiUrl = "https://noteeablyapp-production.up.railway.app/api/schedules";


function Calendar() {
  const studentId = localStorage.getItem('studentId');
  const [schedules, setSchedules] = useState([]);
  const [currentView, setCurrentView] = useState("calendar");

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await axiosRequest({ method: 'get', url: `${apiUrl}/getByStudent/${studentId}` });
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules", error);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      fetchSchedules();
    }
  }, [studentId, fetchSchedules]); // ✅ Hook dependencies

  const handleViewChange = (event, newValue) => {
    setCurrentView(newValue);
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '1000px', mb: 4 }}>
        <Tabs
          value={currentView}
          onChange={handleViewChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root:hover': {
              backgroundColor: '#F8F9FA',
            },
          }}
        >
          <Tab value="calendar" label="Calendar View" />
          <Tab value="board" label="Board View" />
        </Tabs>
      </Box>

      {currentView === "calendar" && (
        <Box sx={{ width: '100%', maxWidth: '1000px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: 3, p: 3, mb: 4 }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            events={schedules.map((s) => ({
              title: s.title,
              start: s.startDate,
              end: s.endDate || s.startDate,
              color: s.colorCode,
            }))}
            height="600px"
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
              list: 'List',
            }}
          />
        </Box>
      )}

      {currentView === "board" && (
        <KanbanBoard schedules={schedules} />
      )}
    </Box>
  );
}

export default Calendar;
