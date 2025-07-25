
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new unified settings page
    navigate('/unified-settings', { replace: true });
  }, [navigate]);

  return null;
};

export default Settings;
