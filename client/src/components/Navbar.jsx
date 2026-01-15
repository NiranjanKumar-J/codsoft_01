import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 40px', 
      background: '#222', 
      borderBottom: '1px solid #444',
      position: 'sticky', 
      top: 0, 
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      {/* 1. BRAND LOGO */}
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#61dafb', fontSize: '26px', fontWeight: 'bold' }}>
          JobConnect 💼
        </Link>
      </h2>

      {/* 2. LINKS SECTION */}
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        
        {/* Public Link */}
        <Link to="/" style={linkStyle}>Home</Link>

        {token ? (
          <>
            {/* Show Role Badge */}
            <span style={{ 
              background: '#333', 
              padding: '5px 10px', 
              borderRadius: '20px', 
              fontSize: '12px', 
              color: '#aaa',
              border: '1px solid #555'
            }}>
              {role === 'employer' ? '👨‍💼 Employer' : '👨‍💻 Candidate'}
            </span>

            {/* 🔥 UPDATED LINKS BASED ON ROLE */}
            {role === 'employer' ? (
              // 👨‍💼 EMPLOYER: Only "My Posted Jobs" (Post Job removed from Navbar)
              <Link to="/employer-dashboard" style={activeLinkStyle}>My Posted Jobs</Link>
            ) : (
              // 👨‍💻 CANDIDATE: "Available Jobs" & "My Applied Jobs"
              <>
                <Link to="/jobs" style={activeLinkStyle}>Available Jobs</Link>
                <Link to="/applied-jobs" style={activeLinkStyle}>My Applied Jobs</Link>
              </>
            )}

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              style={{ 
                padding: '8px 16px', 
                background: 'transparent', 
                color: '#d9534f', 
                border: '1px solid #d9534f', 
                borderRadius: '5px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: '0.3s'
              }}
              onMouseOver={(e) => { e.target.style.background = '#d9534f'; e.target.style.color = 'white'; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#d9534f'; }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={{ 
              padding: '10px 20px', 
              background: '#61dafb', 
              color: '#000', 
              textDecoration: 'none', 
              borderRadius: '25px',
              fontWeight: 'bold'
            }}>
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// STYLES
const linkStyle = {
  textDecoration: 'none',
  color: '#e0e0e0',
  fontSize: '16px',
  fontWeight: '500',
  transition: 'color 0.3s'
};

const activeLinkStyle = {
  textDecoration: 'none',
  color: '#61dafb', // Highlight color
  fontSize: '16px',
  fontWeight: 'bold'
};

export default Navbar;