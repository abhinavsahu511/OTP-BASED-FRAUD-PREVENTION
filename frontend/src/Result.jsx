import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
  padding: 24px;
  box-sizing: border-box;
`;

const ReceiptCard = styled.div`
  max-width: 460px;
  width: 100%;
  background: #fff;
  border-radius: 24px;
  padding: 36px 32px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
  text-align: center;
  box-sizing: border-box;
`;

const Gif = styled.img`
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 16px;
`;

const Message = styled.h1`
  font-size: 1.65rem;
  color: ${(props) => (props.$success ? '#15803d' : '#dc2626')};
  margin: 0 0 8px;
`;

const SubMessage = styled.p`
  font-size: 0.92rem;
  color: #64748b;
  margin: 0 0 22px;
`;

const ReceiptDetails = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
  font-size: 0.88rem;

  div {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px dashed #e2e8f0;
  }
  div:last-child {
    border-bottom: none;
  }
  span {
    color: #64748b;
  }
  strong {
    color: #0f172a;
  }
`;

const HomeButton = styled.button`
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  }
`;

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSuccess, otpMatched, locationMatched, product, distance } = location.state || {};

  const getFailureReason = () => {
    if (!otpMatched && !locationMatched) {
      return 'Transaction denied: Both the OTP was incorrect and device distance exceeded the allowed security zone.';
    }
    if (!otpMatched) {
      return 'Transaction denied: Incorrect OTP entered (your device location matched).';
    }
    return 'Transaction denied: Device distance exceeded the allowed security zone.';
  };

  return (
    <ResultContainer>
      <ReceiptCard>
        <Gif
          src={isSuccess ? '/success.gif' : '/failure.gif'}
          alt={isSuccess ? 'Success' : 'Failure'}
        />
        <Message $success={isSuccess}>
          {isSuccess ? 'Payment Successful!' : 'Payment Blocked (Fraud Alert)'}
        </Message>
        <SubMessage>
          {isSuccess
            ? 'Your OTP and mobile GPS location matched within the allowed security zone.'
            : getFailureReason()}
        </SubMessage>

        <ReceiptDetails>
          {product && (
            <>
              <div>
                <span>Book Title</span>
                <strong>{product.name}</strong>
              </div>
              <div>
                <span>Amount Paid</span>
                <strong>₹{product.price}</strong>
              </div>
            </>
          )}
          <div>
            <span>OTP Check</span>
            <strong style={{ color: otpMatched ? '#16a34a' : '#dc2626' }}>
              {otpMatched ? '✓ Correct OTP' : '✕ Wrong OTP'}
            </strong>
          </div>
          {typeof distance === 'number' && !Number.isNaN(distance) && (
            <div>
              <span>Laptop ↔ Phone Distance</span>
              <strong style={{ color: locationMatched ? '#16a34a' : '#dc2626' }}>
                {(distance * 1000).toFixed(0)} m ({distance.toFixed(3)} km)
              </strong>
            </div>
          )}
          <div>
            <span>Final Status</span>
            <strong style={{ color: isSuccess ? '#16a34a' : '#dc2626' }}>
              {isSuccess ? '✓ Verified' : '✕ Rejected'}
            </strong>
          </div>
        </ReceiptDetails>

        <HomeButton onClick={() => navigate('/')}>Continue Shopping Books</HomeButton>
      </ReceiptCard>
    </ResultContainer>
  );
};

export default Result;

