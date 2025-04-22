import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

function TimerRunning() {
  const location = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(location.state?.initialTime || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [title] = useState(location.state?.title || 'Timer');

  useEffect(() => {
    audioRef.current = new Audio('/ASSETS/TimerSound.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            audioRef.current?.play().catch((error) => {
              console.error("Error playing audio:", error);
            });
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    navigate('/timer');
  };

  // Styles for the outer gradient circle
  const timerOuterCircleStyles = {
    position: 'relative',
    width: '250px',
    height: '250px',
    margin: '20px auto',
    borderRadius: '50%',
    background: `conic-gradient(
      white ${(1 - timeLeft / (location.state?.initialTime || 1)) * 360}deg, 
      #EF476F ${(1 - timeLeft / (location.state?.initialTime || 1)) * 360}deg, 
      #F78C6B 72deg, 
      #FFD166 144deg, 
      #06D6A0 216deg, 
      #118AB2 288deg, 
      #073B4C 360deg
    )`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // Styles for the inner white circle
  const timerInnerCircleStyles = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const timerTextStyles = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#073B4C',
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: 'url("/ASSETS/polkadot.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '20px',
    }}>
      <Box sx={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '30px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid lightgray',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        maxWidth: '500px',
        boxSizing: 'border-box',
      }}>
        <Typography variant="h4" color='#073B4C' gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: '20px', color: '#666' }}>
          {`${Math.floor(location.state?.initialTime / 3600)}h ${Math.floor(
            (location.state?.initialTime % 3600) / 60
          )}m ${(location.state?.initialTime % 60)}s`}
        </Typography>
        <Box sx={timerOuterCircleStyles}>
          <Box sx={timerInnerCircleStyles}>
            {timeLeft === 0 ? (
              <img 
                src="/ASSETS/popup-timer.png" 
                alt="Time's Up" 
                style={{ width: '350px', height: '350px', margin: '30px' }} 
              />
            ) : (
              <Typography sx={timerTextStyles}>
                {formatTime(timeLeft)}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <IconButton
            onClick={handlePlayPause}
            disabled={timeLeft === 0}
            sx={{
              backgroundColor: timeLeft === 0 ? '#cccccc' : '#06D6A0',
              color: 'white',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              cursor: timeLeft === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton
            onClick={handleStop}
            sx={{
              backgroundColor: '#EF476F',
              color: 'white',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
            }}
          >
            <StopIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default TimerRunning;
