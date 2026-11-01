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
  const params = new URLSearchParams(window.location.search);
  const urlCode = params.get('code');

  const [otp, setOtp] = useState(urlCode || null);
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('Verifying your mobile GPS location...');
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadOtp = async () => {
      try {
        const latestOtp = await readLatestOtp();
        if (latestOtp) {
          setOtp(latestOtp);
        }
      } catch (err) {
        console.error('Error reading OTP from Firebase:', err);
      }
    };

    const saveLocationToFirebase = async (latitude, longitude) => {
      setCoords({ latitude, longitude });
      try {
        const locationPayload = {
          latitude,
          longitude,
          timestamp: serverTimestamp(),
        };
        await setDoc(doc(db, 'locations', 'latest'), locationPayload);
        await addDoc(collection(db, 'locations'), locationPayload);
        setError(false);
        setStatus(
          'Mobile GPS location verified! Type this 4-digit OTP into your laptop browser to finish payment.'
        );
      } catch (err) {
        console.error('Error saving location to Firebase:', err);
      }
    };

    const fallbackIpLocation = async () => {
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data = await res.json();
        if (data.latitude && data.longitude) {
          await saveLocationToFirebase(Number(data.latitude), Number(data.longitude));
          return;
        }
      } catch (err) {
        console.error('Mobile IP location fallback error:', err);
      }
      setError(true);
      setStatus('Please turn on Location on your phone and refresh this page.');
    };

    loadOtp();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          saveLocationToFirebase(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fallbackIpLocation();
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
      );
    } else {
      fallbackIpLocation();
    }
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
