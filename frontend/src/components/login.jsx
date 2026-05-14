import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTP } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [aadhaar, setAadhaar] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (aadhaar.length !== 12) {
      setMessage('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setLoading(true);
    const res = await sendOTP(aadhaar);
    setLoading(false);
    setMessage(res.message);
    if (res.message.includes('OTP sent')) {
      // store aadhaar temporarily and go to verify page
      sessionStorage.setItem('aadhaar', aadhaar);
      navigate('/verify');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>AadhaarVoteGuard</h2>
        <p style={styles.sub}>Secure Biometric Voting System</p>
        <input
          style={styles.input}
          type="text"
          maxLength={12}
          placeholder="Enter 12-digit Aadhaar Number"
          value={aadhaar}
          onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
        />
        <button style={styles.btn} onClick={handleSendOTP} disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
        {message && <p style={styles.msg}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f4ff' },
  card: { background:'#fff', padding:'2rem', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'360px', textAlign:'center' },
  title: { color:'#1a1a2e', fontSize:'24px', marginBottom:'4px' },
  sub: { color:'#666', fontSize:'14px', marginBottom:'1.5rem' },
  input: { width:'100%', padding:'12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'16px', marginBottom:'1rem', boxSizing:'border-box' },
  btn: { width:'100%', padding:'12px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer' },
  msg: { marginTop:'1rem', color:'#555', fontSize:'14px' },
};