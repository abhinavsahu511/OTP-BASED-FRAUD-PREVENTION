import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import readData from './ReadLatestData';
import readLatestOtp from './ReadOtp';

const PinContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
`;

const VerificationCard = styled.div`
  max-width: 460px;
  width: 100%;
  padding: 36px 32px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
  text-align: center;
  box-sizing: border-box;
`;

const IconCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e0e7ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto 16px;
`;

const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 1.45rem;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 0 0 20px;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
`;

const StatusBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 22px;
  text-align: left;
  font-size: 0.84rem;
  color: #334155;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 6px 0;
  }
  span.ok {
    color: #16a34a;
    font-weight: 700;
  }
  span.wait {
    color: #d97706;
    font-weight: 600;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const OtpInput = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.$error ? '#ef4444' : '#cbd5e1')};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.35em;
  text-align: center;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.14);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 6px;
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(79, 70, 229, 0.35);
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.84rem;
  margin: 0 0 10px;
  font-weight: 500;
`;

const PinPage = () => {
  const [otpInput, setOtpInput] = useState('');
  const [errors, setErrors] = useState({});
  const [verifying, setVerifying] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { cardNumber, product, otpLink } = location.state || {};

  const [lat1, setLatitude] = useState('');
  const [long1, setLongitude] = useState('');
  const [lat2, setLatitude1] = useState('');
  const [long2, setLongitude2] = useState('');
  const [otp, setOtp] = useState('');
  const { state } = location;
  const getOtp = state ? state.otp : 'No OTP received';

  useEffect(() => {
    const fetchData = async () => {
      const dataFromFirebase = await readData();
      if (dataFromFirebase && dataFromFirebase.latitude !== undefined) {
        setLatitude1(dataFromFirebase.latitude);
        setLongitude2(dataFromFirebase.longitude);
      }
    };
    const fetchOtp = async () => {
      const fetchedOtp = await readLatestOtp();
      if (fetchedOtp) setOtp(fetchedOtp);
    };
    fetchOtp();
    fetchData();
    fetchGeolocation();

    const interval = setInterval(fetchData, 2500);
    return () => clearInterval(interval);
  }, []);

  const fetchIpLocationFallback = async () => {
    try {
      const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const lat = Number(data.latitude);
        const lon = Number(data.longitude);
        setLatitude(lat);
        setLongitude(lon);
        return { lat, lon };
      }
    } catch (err) {
      console.error('Fallback geolocation failed:', err);
    }
    return null;
  };

  const fetchGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (err) => {
          console.warn('Browser geolocation error, using IP fallback:', err);
          fetchIpLocationFallback();
        },
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
      );
    } else {
      fetchIpLocationFallback();
    }
  };

  const distance = (latA, lonA, latB, lonB) => {
    lonA = (lonA * Math.PI) / 180;
    lonB = (lonB * Math.PI) / 180;
    latA = (latA * Math.PI) / 180;
    latB = (latB * Math.PI) / 180;
    const dlon = lonB - lonA;
    const dlat = latB - latA;
    const a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(latA) * Math.cos(latB) * Math.pow(Math.sin(dlon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    const r = 6371;
    return c * r;
  };

  const validate = () => {
    const newErrors = {};
    if (!otpInput) newErrors.otpInput = 'Please enter the 4-digit OTP';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setVerifying(true);
      let currentLat1 = lat1;
      let currentLong1 = long1;
      let currentLat2 = lat2;
      let currentLong2 = long2;
      let currentOtp = getOtp !== 'No OTP received' ? getOtp : otp;
      try {
        if (currentLat1 === '' || currentLong1 === '') {
          const fallback = await fetchIpLocationFallback();
          if (fallback) {
            currentLat1 = fallback.lat;
            currentLong1 = fallback.lon;
          }
        }
        const latestLocation = await readData();
        if (latestLocation && latestLocation.latitude !== undefined) {
          currentLat2 = latestLocation.latitude;
          currentLong2 = latestLocation.longitude;
          setLatitude1(currentLat2);
          setLongitude2(currentLong2);
        }
        const latestOtpFromDb = await readLatestOtp();
        if (latestOtpFromDb) {
          currentOtp = latestOtpFromDb;
          setOtp(latestOtpFromDb);
        }
      } catch (err) {
        console.error('Error fetching latest verification data:', err);
      }
      const dist = distance(currentLat1, currentLong1, currentLat2, currentLong2);
      const otpMatched = Number(otpInput) === Number(currentOtp);
      const locationMatched = dist <= 20;
      const isSuccess = locationMatched && otpMatched;
      setVerifying(false);
      navigate('/result', {
        state: {
          isSuccess,
          otpMatched,
          locationMatched,
          cardNumber,
          product,
          distance: dist,
        },
      });
    }
  };

  return (
    <PinContainer>
      <VerificationCard>
        <IconCircle>📲</IconCircle>
        <Title>Two-Step Geo-OTP Verification</Title>
        <Subtitle>
          Open the SMS link sent to your mobile number on your
          phone browser to verify your phone's GPS location and view your 4-digit OTP.
          {otpLink && (
            <div style={{ marginTop: '8px', fontSize: '0.8rem' }}>
              Mobile Link:{' '}
              <a
                href={otpLink}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#4f46e5', fontWeight: 600, wordBreak: 'break-all' }}
              >
                {otpLink}
              </a>
            </div>
          )}
        </Subtitle>

        <StatusBox>
          <div>
            <span>💻 Laptop GPS (Location 1):</span>
            {lat1 !== '' ? (
              <span className="ok">
                ✓ ({Number(lat1).toFixed(4)}, {Number(long1).toFixed(4)})
              </span>
            ) : (
              <span className="wait">Waiting for laptop location...</span>
            )}
          </div>
          <div>
            <span>📱 Phone GPS (Location 2):</span>
            {lat2 !== '' ? (
              <span className="ok">
                ✓ ({Number(lat2).toFixed(4)}, {Number(long2).toFixed(4)})
              </span>
            ) : (
              <span className="wait">Open SMS link on phone...</span>
            )}
          </div>
        </StatusBox>

        <Form onSubmit={handleSubmit}>
          <OtpInput
            type="text"
            maxLength={4}
            placeholder="••••"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
            $error={errors.otpInput}
          />
          {errors.otpInput && <ErrorMessage>{errors.otpInput}</ErrorMessage>}
          <Button type="submit" disabled={verifying}>
            {verifying ? 'Verifying OTP & Location...' : 'Verify & Complete Payment'}
          </Button>
        </Form>
      </VerificationCard>
    </PinContainer>
  );
};

export default PinPage;

