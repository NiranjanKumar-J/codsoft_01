import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', formData);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration Failed: ' + (err.response?.data?.msg || 'Server Error'));
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formBoxStyle}>
        
        {/* Title */}
        <h2 style={{ color: '#ffffff', marginBottom: '20px', fontWeight: 'bold' }}>
          Create Account
        </h2>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={formData.name}
            onChange={handleChange} 
            required 
            style={inputStyle}
          />

          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleChange} 
            required 
            style={inputStyle}
          />

          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange} 
            required 
            style={inputStyle}
          />

          <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
            <option value="candidate">I am a Candidate 👨‍💻</option>
            <option value="employer">I am an Employer 👨‍💼</option>
          </select>

          <button type="submit" style={buttonStyle}>
            Register Now
          </button>
        
        </form>

        <p style={{ marginTop: '15px', color: '#ccc' }}>
          Already have an account? <Link to="/login" style={{ color: '#61dafb' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

// --- ✨ STYLES (Box Design) ---

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '90vh', // Full Screen Center
  background: '#1a1a1a', // Page Background
};

const formBoxStyle = {
  background: '#2a2a2a', // 📦 The Box Color (Dark Grey)
  padding: '40px',
  borderRadius: '12px', // Rounded Corners
  boxShadow: '0 8px 24px rgba(0,0,0,0.5)', // Shadow Effect
  textAlign: 'center',
  width: '100%',
  maxWidth: '400px', // Box Width limit
  border: '1px solid #333'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #555',
  background: '#333',
  color: 'white',
  fontSize: '15px',
  outline: 'none'
};

const buttonStyle = {
  padding: '12px',
  background: '#007bff', // Blue Button like Login page
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
  transition: '0.3s'
};

export default Register;