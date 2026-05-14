import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from  './components/login'; 
import OTPVerify from './components/OTPVerify';
import VotingPage from './components/VotingPage';
import Results from './components/Results';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/verify" element={<OTPVerify />} />
          <Route path="/vote" element={<VotingPage />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;