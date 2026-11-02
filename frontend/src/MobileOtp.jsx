import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from './firebaseconfig';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import readLatestOtp from './ReadOtp';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
`;

const Card = styled.div`
  max-width: 390px;
  width: 100%;
  padding: 32px 24px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
`;

const ShieldBadge = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #ecfdf5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto 14px;
`;

const Title = styled.h2`
  color: #0f172a;
  margin: 0 0 6px;
  font-size: 1.35rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.86rem;
  margin: 0 0 20px;
`;

const OtpBox = styled.div`
  font-size: 2.6rem;
  font-weight: 800;
  letter-spacing: 10px;
  color: #4f46e5;
  background: #eef2ff;
  border: 2px dashed #818cf8;
  padding: 18px;
  border-radius: 16px;
  margin: 18px 0;
`;

const CoordsBadge = styled.div`
  display: inline-block;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  margin-bottom: 10px;
`;

const StatusText = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => (props.$error ? '#dc2626' : '#059669')};
  margin: 10px 0 0;
  line-height: 1.45;
`;

const MobileOtp = () => {
  const [otp, setOtp] = useState(null);
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('Acquiring high-accuracy mobile GPS location...');
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyLocationAndUnlockOtp = async (latitude, longitude, accuracy) => {
      setCoords({ latitude, longitude, accuracy });
      try {
        const locationPayload = {
          latitude,
          longitude,
          accuracy: accuracy || null,
          timestamp: serverTimestamp(),
        };
        await setDoc(doc(db, 'locations', 'latest'), locationPayload);
        await addDoc(collection(db, 'locations'), locationPayload);

        const latestOtp = await readLatestOtp();
        setOtp(latestOtp);
        setError(false);
        setStatus(
          'Mobile GPS location verified! Type this 4-digit OTP into your laptop browser to finish payment.'
        );
      } catch (err) {
        console.error('Error communicating with Firebase:', err);
        setError(true);
        setStatus('Failed to sync location with database.');
      }
    };

    if (!navigator.geolocation) {
      setError(true);
      setStatus('Hardware Geolocation is not supported by your mobile browser.');
      return;
    }

    // Stage 1: High-accuracy hardware GPS (satellite + Wi-Fi sensors, no cached position)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        verifyLocationAndUnlockOtp(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        );
      },
      () => {
        // Stage 2: Indoor cellular/Wi-Fi triangulation via W3C Geolocation API (never IP lookup)
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            verifyLocationAndUnlockOtp(
              pos.coords.latitude,
              pos.coords.longitude,
              pos.coords.accuracy
            );
          },
          (geoErr) => {
            console.error('Geolocation error:', geoErr);
            setError(true);
            setStatus(
              'Location permission denied. You must allow GPS Location access on your phone to unlock your OTP.'
            );
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  return (
    <Container>
      <Card>
        <ShieldBadge>🛡️</ShieldBadge>
        <Title>BookVault Mobile OTP</Title>
        <Subtitle>Location-Verified Transaction Code</Subtitle>

        {coords && (
          <CoordsBadge>
            📍 Phone GPS: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
          </CoordsBadge>
        )}

        {otp ? <OtpBox>{otp}</OtpBox> : <OtpBox>••••</OtpBox>}

        <StatusText $error={error}>{status}</StatusText>
      </Card>
    </Container>
  );
};

export default MobileOtp;
