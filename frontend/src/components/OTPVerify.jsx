import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOTP } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function OTPVerify() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const aadhaar = sessionStorage.getItem('aadhaar');

  const handleVerify = async () => {
    setLoading(true);
    const res = await verifyOTP(aadhaar, otp);
    setLoading(false);
    setMessage(res.message);
    if (res.token) {
      login(res.token, aadhaar);
      navigate('/vote');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>OTP Verification</h2>
        <p style={styles.sub}>Enter the 6-digit OTP sent to your email</p>
        <input
          style={styles.input}
          type="text"
          maxLength={6}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        />
        <button style={styles.btn} onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
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