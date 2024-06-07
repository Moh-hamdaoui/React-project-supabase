import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import supabase from './services/supabase/supabaseClient';
import AuthComponent from './components/Auth/Auth.jsx';
import ProjectList from './components/Projects/ProjectList.jsx';


export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        navigate('/projects');  
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/projects');  
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthComponent />} />
      <Route path="/projects" element={session ? <ProjectList /> : <Navigate to="/auth" />} />
      <Route path="*" element={<Navigate to={session ? "/projects" : "/auth"} />} />
    </Routes>
  );
}
