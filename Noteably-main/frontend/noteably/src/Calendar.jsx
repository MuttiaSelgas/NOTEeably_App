import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import axios from 'axios';
import KanbanBoard from './KanbanBoard';
import { Box, Tabs, Tab } from '@mui/material';

const apiUrl = "http://localhost:8080/api/schedules"; 

function Calendar() { 
  const studentId = localStorage.getItem('studentId'); // Get studentId from local storage
  const [schedules, setSchedules] = useState([]);
  const [currentView, setCurrentView] = useState("calendar");

  useEffect(() => {
    if (studentId) {
      fetchSchedules(studentId); // Fetch schedules for the specific student
    }
  }, [studentId]);

  const fetchSchedules = async (studentId) => {
    try {
      const response = await axios.get(`${apiUrl}/getByStudent/${studentId}`);
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules", error);
    }
  };

  const handleViewChange = (event, newValue) => {
    setCurrentView(newValue);
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Navigation Tabs */}
      <Box sx={{ width: '100%', maxWidth: '1000px', mb: 4 }}>
      <Tabs
            value={currentView}
            onChange={handleViewChange}
            centered
            indicatorColor="#06D6A0"
            textColor="primary"
            sx={{
              '& .MuiTab-root': {
                '&:hover': {
                  backgroundColor: '#FFFFF', 
                },
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
              list: 'List'
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
