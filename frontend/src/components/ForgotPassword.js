import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword({ onClose }) {
  const { forgotPassword, verifyResetOtp, resetPassword } = useAuth();

  const [step, setStep] = useState('email'); // email | otp | newpass | done
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    const data = await forgotPassword(email);
    if (data?.success) {
      setStep('otp');
    } else {
      setError(data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);
    const data = await verifyResetOtp(email, otp);
    if (data?.success) {
      setResetToken(data.resetToken);
      setStep('newpass');
    } else {
      setError(data?.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords match nahi kar rahe');
      return;
    }
    setLoading(true);
    // resetPassword now logs the user in immediately (sets tokens + user in AuthContext)
    const data = await resetPassword(resetToken, newPassword);
    if (data?.success) {
      // User is already logged in — close the modal straight away, no login screen
      onClose();
    } else {
      setError(data?.message || 'Reset failed');
    }
    setLoading(false);
  };

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        {step === 'email' && (
          <>
            <h2 style={titleStyle}>Forgot Password?</h2>
            <input
              type="email"
              placeholder="Apna email daalein"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            {error && <p style={errorStyle}>{error}</p>}
            <button onClick={handleSendOtp} disabled={loading} style={btnStyle(loading)}>
              {loading ? 'Please wait...' : 'SEND OTP'}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <h2 style={titleStyle}>OTP Verify Karo</h2>
            <p style={descStyle}>
              <span style={{ color: '#C9A84C' }}>{email}</span> pe 6-digit OTP bheja gaya hai
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              style={{ ...inputStyle, textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.5em' }}
            />
            {error && <p style={errorStyle}>{error}</p>}
            <button onClick={handleVerifyOtp} disabled={loading} style={btnStyle(loading)}>
              {loading ? 'Verifying...' : 'VERIFY'}
            </button>
          </>
        )}

        {step === 'newpass' && (
          <>
            <h2 style={titleStyle}>New Password Set Karo</h2>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
            {error && <p style={errorStyle}>{error}</p>}
            <button onClick={handleResetPassword} disabled={loading} style={btnStyle(loading)}>
              {loading ? 'Please wait...' : 'RESET PASSWORD & LOGIN'}
            </button>
          </>
        )}

        {step !== 'done' && (
          <p
            onClick={onClose}
            style={{ color: 'rgba(242,232,208,0.4)', fontSize: '0.72rem', textAlign: 'center', marginTop: '1rem', cursor: 'pointer' }}
          >
            ← Cancel
          </p>
        )}

        <button onClick={onClose} style={closeBtn}>✕</button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, zIndex: 9999,
  background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const cardStyle = {
  position: 'relative',
  background: '#0D1B2A', border: '1px solid rgba(201,168,76,0.3)',
  borderRadius: '16px', padding: '2rem', width: '360px',
};

const titleStyle = {
  color: '#C9A84C', fontFamily: 'Cormorant Garamond', marginBottom: '1rem',
};

const descStyle = {
  color: 'rgba(242,232,208,0.6)', fontSize: '0.82rem', marginBottom: '1.5rem', lineHeight: 1.6,
};

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(201,168,76,0.2)',
  borderRadius: '8px', color: '#F2E8D0',
  fontFamily: 'Poppins', fontSize: '0.85rem',
  marginBottom: '1rem', outline: 'none',
  boxSizing: 'border-box',
};

const btnStyle = (loading) => ({
  width: '100%', padding: '0.85rem',
  background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
  color: '#0D1B2A', border: 'none', borderRadius: '8px',
  fontFamily: 'Space Mono', fontWeight: 700,
  fontSize: '0.7rem', letterSpacing: '0.1em',
  cursor: loading ? 'not-allowed' : 'pointer',
  opacity: loading ? 0.6 : 1,
});

const errorStyle = {
  color: '#E24B4A', fontSize: '0.8rem', marginBottom: '1rem',
};

const closeBtn = {
  position: 'absolute', top: '1rem', right: '1rem',
  background: 'none', border: 'none',
  color: 'rgba(242,232,208,0.5)', cursor: 'pointer', fontSize: '1.2rem',
};