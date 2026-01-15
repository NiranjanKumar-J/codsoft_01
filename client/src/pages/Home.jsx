import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div style={{ width: '100%', minHeight: '100vh', textAlign: 'left' }}>
      
      {/* 1. HERO SECTION */}
      <div style={{ 
        textAlign: 'center', 
        padding: '100px 20px', 
        background: 'linear-gradient(to bottom, #1f1f1f, #121212)',
        borderBottom: '1px solid #333'
      }}>
        {role === 'employer' ? (
          <>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Hire the <span style={{ color: '#61dafb' }}>Best Talent</span></h1>
            <p style={{ fontSize: '1.3rem', color: '#aaa', maxWidth: '600px', margin: '0 auto 30px' }}>
              Post jobs and find the perfect candidate for your company.
            </p>
            <button onClick={() => navigate('/post-job')} style={primaryBtnStyle}>Post a New Job</button>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Find Your <span style={{ color: '#61dafb' }}>Dream Job</span></h1>
            <p style={{ fontSize: '1.3rem', color: '#aaa', maxWidth: '600px', margin: '0 auto 30px' }}>
              Thousands of jobs are waiting for you. Apply with one click!
            </p>
            <button onClick={() => navigate('/jobs')} style={primaryBtnStyle}>Browse Available Jobs</button>
          </>
        )}
      </div>

      {/* 2. CONTENT SECTION */}
      <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        
        {role === 'employer' ? (
          // EMPLOYER VIEW: Recruiter Dashboard Cards
          <div>
             <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Recruiter Quick Actions</h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
               <div style={cardStyle} onClick={() => navigate('/employer-dashboard')}>
                 <h3 style={{ color: '#61dafb' }}>📋 Manage Jobs</h3>
                 <p style={{ color: '#aaa' }}>View applications and update status.</p>
               </div>
               <div style={cardStyle} onClick={() => navigate('/post-job')}>
                 <h3 style={{ color: '#61dafb' }}>✍️ Post Job</h3>
                 <p style={{ color: '#aaa' }}>Create a new vacancy listing.</p>
               </div>
             </div>
          </div>
        ) : (
          // ✅ CANDIDATE VIEW: How It Works (Instead of Latest Openings)
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '50px' }}>How It Works?</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
              
              {/* Step 1 */}
              <div style={stepCardStyle}>
                <div style={iconStyle}>1</div>
                <h3>Create Account</h3>
                <p style={{ color: '#aaa' }}>Register as a candidate and complete your profile.</p>
              </div>

              {/* Step 2 */}
              <div style={stepCardStyle}>
                <div style={iconStyle}>2</div>
                <h3>Find Jobs</h3>
                <p style={{ color: '#aaa' }}>Browse through hundreds of job openings.</p>
              </div>

              {/* Step 3 */}
              <div style={stepCardStyle}>
                <div style={iconStyle}>3</div>
                <h3>Apply & Get Hired</h3>
                <p style={{ color: '#aaa' }}>Upload your resume and apply instantly.</p>
              </div>

            </div>
            
            <button onClick={() => navigate('/jobs')} style={{ ...primaryBtnStyle, marginTop: '50px', background: '#333', border: '1px solid #555', backgroundColor:'#61dafb' }}>
              Start Searching
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// Styles
const primaryBtnStyle = {
  padding: '15px 35px', 
  fontSize: '18px', 
  background: '#61dafb', 
  color: 'black', 
  fontWeight: 'bold', 
  border: 'none', 
  borderRadius: '30px', 
  cursor: 'pointer',
  transition: '0.3s'
};

const cardStyle = {
  background: '#2a2a2a', 
  padding: '30px', 
  borderRadius: '15px', 
  cursor: 'pointer',
  textAlign: 'center',
  border: '1px solid #333'
};

const stepCardStyle = {
  background: '#222',
  padding: '30px',
  borderRadius: '15px',
  width: '280px',
  textAlign: 'center',
  border: '1px solid #333'
};

const iconStyle = {
  width: '50px',
  height: '50px',
  background: '#61dafb',
  color: 'black',
  fontSize: '24px',
  fontWeight: 'bold',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px'
};

export default Home;