import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    // LocalStorage-ல் இருந்து தகவலை எடுப்போம்
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    if (!email) {
      navigate('/login'); // Login செய்யவில்லை என்றால் வெளியே அனுப்பு
    } else {
      setUser({ name, email, role });
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'white' }}>
      <div style={{ background: '#222', padding: '40px', borderRadius: '10px', textAlign: 'center', width: '350px' }}>
        <h2 style={{ color: '#61dafb' }}>My Profile 👤</h2>
        <div style={{ textAlign: 'left', marginTop: '20px', lineHeight: '2' }}>
            <p><strong>Name:</strong> {user.name || 'User'}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;