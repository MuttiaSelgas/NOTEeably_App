import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import axios from 'axios';
import KanbanBoard from './KanbanBoard'; 
import { Box, Typography, Button, Tabs, Tab } from '@mui/material';

const apiUrl = "http://localhost:8080/api/schedule";

function Calendar() {
  const [schedules, setSchedules] = useState([]);
  const [currentView, setCurrentView] = useState("calendar");

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${apiUrl}/all`);
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
          indicatorColor="primary"
          textColor="primary"
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