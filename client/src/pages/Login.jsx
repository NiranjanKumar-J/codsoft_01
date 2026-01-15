import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// இந்த ஸ்டைல் ஃபைல் தேவைப்பட்டால் மட்டும் வச்சுக்கோங்க
// import '../App.css'; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend Port 5000-னு வச்சிருக்கேன். உங்க போர்ட் வேறனா மாத்திக்கோங்க.
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Token & User Details சேவ் பண்றோம்
      localStorage.setItem('token', res.data.token);
      
      // Backend-ல இருந்து வர்ற டேட்டா பொறுத்து இதை அட்ஜஸ்ட் பண்ணிக்கோங்க
      const userRole = res.data.user ? res.data.user.role : res.data.role;
      const userName = res.data.user ? res.data.user.name : res.data.name;
      const userEmail = res.data.user ? res.data.user.email : res.data.email;

      localStorage.setItem('role', userRole);
      localStorage.setItem('name', userName);
      localStorage.setItem('email', userEmail);

      alert('Login Successful! 🚀');

      // ரோல் பொறுத்து ரீடைரக்ட் பண்றோம்
      if (userRole === 'employer') {
        navigate('/employer-dashboard'); // Employer -> Dashboard
      } else {
        navigate('/'); // Candidate -> Home Page
      }
      
      // Navbar அப்டேட் ஆக ஒரு ரீலோட் (Optional)
      window.location.reload(); 

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Invalid Credentials');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formBoxStyle}>
        <h2 style={{ color: '#ffffff', marginBottom: '20px', fontWeight: 'bold' }}>
          Login
        </h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
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
          
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <p style={{ marginTop: '15px', color: '#ccc' }}>
          Don't have an account? <Link to="/register" style={{ color: '#61dafb' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

// --- ✨ STYLES (Matched with Register Page) ---

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '90vh', // Full Screen Center
  background: '#1a1a1a', // Page Background
};

// 👇 இதுதான் Register Page-ல இருந்து எடுத்த அதே பாக்ஸ் ஸ்டைல்
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
  background: '#007bff', // Blue Button
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
  transition: '0.3s'
};

export default Login;