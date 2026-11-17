import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CourseDetails from './pages/CourseDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Students from './pages/Students';
import StudentGroup from './pages/StudentGroup';
import api from './services/api';

function AdminRoute() {
  const [status, setStatus] = useState('checking');
  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('maxcode_token');
    if (!token) {
      setStatus('denied');
      return () => { active = false; };
    }
    api.get('/auth/me').then(({ data }) => {
      if (!active) return;
      const user = data.data;
      if (!['admin', 'super_admin'].includes(user.role)) {
        localStorage.removeItem('maxcode_token');
        localStorage.removeItem('maxcode_user');
        setStatus('denied');
        return;
      }
      localStorage.setItem('maxcode_user', JSON.stringify(user));
      setStatus('allowed');
    }).catch(() => {
      if (!active) return;
      localStorage.removeItem('maxcode_token');
      localStorage.removeItem('maxcode_user');
      setStatus('denied');
    });
    return () => { active = false; };
  }, []);
  if (status === 'checking') return <main className="login-page"><p>جارٍ التحقق من صلاحية الدخول…</p></main>;
  if (status === 'denied') return <Navigate to="/login" replace/>;
  return <Admin/>;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/courses/:slug" element={<CourseDetails/>}/>
    <Route path="/courses/:courseId/register" element={<Register/>}/>
    <Route path="/students" element={<Students/>}/>
    <Route path="/students/:groupId" element={<StudentGroup/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/admin" element={<AdminRoute/>}/>
    <Route path="*" element={<Home/>}/>
  </Routes>;
}
