import { getStudentByStudentId } from './studentService';

async function handleLoginSuccess(response, navigate, showAlert, setMessage) {
  try {
    if (response.data && response.data.student) {
      const studentId = response.data.student.studentId;
      localStorage.setItem('studentId', studentId);
      localStorage.setItem('studentName', response.data.student.name);
      localStorage.setItem('token', response.data.token);

      // Fetch full student info after login
      const fullStudentInfo = await getStudentByStudentId(studentId);
      console.log('Full student info:', fullStudentInfo);
      localStorage.setItem('fullStudentInfo', JSON.stringify(fullStudentInfo));

      showAlert('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setMessage('Invalid login response structure.');
    }
  } catch (error) {
    console.error('Error fetching full student info:', error);
    setMessage('Failed to load full student information.');
  }
}

export default handleLoginSuccess;
