const BASE = process.env.REACT_APP_API_URL;

export const sendOTP = async (aadhaar) => {
  const res = await fetch(`${BASE}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aadhaar }),
  });
  return res.json();
};

export const verifyOTP = async (aadhaar, otp) => {
  const res = await fetch(`${BASE}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aadhaar, otp }),
  });
  return res.json();
};

export const getCandidates = async () => {
  const res = await fetch(`${BASE}/api/vote/candidates`);
  return res.json();
};

export const castVote = async (candidateId, token) => {
  const res = await fetch(`${BASE}/api/vote/cast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ candidateId }),
  });
  return res.json();
};

export const getResults = async () => {
  const res = await fetch(`${BASE}/api/vote/results`);
  return res.json();
};