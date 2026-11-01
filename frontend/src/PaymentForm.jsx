import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import storeData from './StoreData';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  max-width: 880px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }
`;

const StepBadge = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #4f46e5;
  background: #e0e7ff;
  padding: 6px 14px;
  border-radius: 999px;
`;

const CheckoutGrid = styled.div`
  max-width: 880px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 28px;
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 24px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const VisualCard = styled.div`
  width: 100%;
  height: 215px;
  background: linear-gradient(135deg, #312e81 0%, #4f46e5 55%, #06b6d4 100%);
  border-radius: 18px;
  padding: 24px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 14px 28px rgba(79, 70, 229, 0.3);
  box-sizing: border-box;
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    opacity: 0.9;
  }
`;

const Chip = styled.div`
  width: 44px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, #fde68a, #f59e0b);
  border: 1px solid rgba(255, 255, 255, 0.4);
`;

const CardNumberDisplay = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  font-family: 'Courier New', monospace;
`;

const CardBottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  div {
    display: flex;
    flex-direction: column;
  }
  small {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.75;
    margin-bottom: 3px;
  }
  strong {
    font-size: 0.92rem;
    letter-spacing: 0.04em;
  }
`;

const OrderSummaryCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 16px;

  img {
    width: 60px;
    height: 85px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  }
`;

const SummaryDetails = styled.div`
  flex: 1;
  h4 {
    margin: 0 0 4px;
    font-size: 1rem;
    color: #0f172a;
  }
  p {
    margin: 0 0 8px;
    font-size: 0.82rem;
    color: #64748b;
  }
  strong {
    font-size: 1.2rem;
    color: #4f46e5;
    font-weight: 800;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 1.4rem;
  color: #0f172a;
`;

const FormSubtitle = styled.p`
  margin: 0 0 22px;
  font-size: 0.88rem;
  color: #64748b;
`;

const FieldGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid ${(props) => (props.$error ? '#ef4444' : '#cbd5e1')};
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }
`;

const RowFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.78rem;
  margin: 4px 0 0;
  font-weight: 500;
`;

const SubmitButton = styled.button`
  margin-top: 8px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.28);
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(79, 70, 229, 0.36);
  }
`;

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [ccv, setCcv] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const selectedBook = location.state?.product || {
    name: 'Wings of Fire: An Autobiography',
    author: 'A.P.J. Abdul Kalam',
    price: 299,
    image: 'https://covers.openlibrary.org/b/isbn/9788173711466-L.jpg',
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const validate = () => {
    const newErrors = {};
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 12) {
      newErrors.cardNumber = 'Valid card number is required';
    }
    if (!cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required';
    if (!expirationDate || expirationDate.length < 4) {
      newErrors.expirationDate = 'Expiry date (MM/YY) is required';
    }
    if (!ccv || ccv.length < 3) newErrors.ccv = '3-digit CVV is required';
    return newErrors;
  };

  const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const otp = generateOTP();
      await storeData(otp);
      const apiUrl =
        window.location.hostname === 'localhost'
          ? 'http://localhost:8000/send-message'
          : '/api/send-message';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: '+919721848820',
          otp,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      navigate('/pin', {
        state: { otp, cardNumber, product: selectedBook, otpLink: data.otpLink },
      });
    } catch (error) {
      console.error('Error sending message:', error.message);
      alert(`Failed to send SMS: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      sendMessage();
    }
  };

  return (
    <PageContainer>
      <TopBar>
        <BackButton onClick={() => navigate('/')}>← Back to Bookstore</BackButton>
        <StepBadge>Step 1 of 2 • Secure Card Checkout</StepBadge>
      </TopBar>

      <CheckoutGrid>
        <LeftColumn>
          <VisualCard>
            <CardTopRow>
              <Chip />
              <span>RUPAY / VISA</span>
            </CardTopRow>
            <CardNumberDisplay>
              {cardNumber || '•••• •••• •••• ••••'}
            </CardNumberDisplay>
            <CardBottomRow>
              <div>
                <small>Card Holder</small>
                <strong>{cardHolder ? cardHolder.toUpperCase() : 'YOUR NAME'}</strong>
              </div>
              <div>
                <small>Expires</small>
                <strong>{expirationDate || 'MM/YY'}</strong>
              </div>
            </CardBottomRow>
          </VisualCard>

          <OrderSummaryCard>
            <img src={selectedBook.image} alt={selectedBook.name} />
            <SummaryDetails>
              <h4>{selectedBook.name}</h4>
              <p>by {selectedBook.author}</p>
              <strong>₹{selectedBook.price}</strong>
            </SummaryDetails>
          </OrderSummaryCard>
        </LeftColumn>

        <Form onSubmit={handleSubmit}>
          <FormTitle>Payment Details</FormTitle>
          <FormSubtitle>Complete your book purchase securely</FormSubtitle>

          <FieldGroup>
            <Label>Card Number</Label>
            <Input
              type="text"
              placeholder="4532 •••• •••• ••••"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              $error={errors.cardNumber}
            />
            {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
          </FieldGroup>

          <FieldGroup>
            <Label>Cardholder Name</Label>
            <Input
              type="text"
              placeholder="e.g. Abhinav Sharma"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              $error={errors.cardHolder}
            />
            {errors.cardHolder && <ErrorMessage>{errors.cardHolder}</ErrorMessage>}
          </FieldGroup>

          <RowFields>
            <FieldGroup>
              <Label>Expiration Date</Label>
              <Input
                type="text"
                placeholder="MM/YY"
                value={expirationDate}
                onChange={(e) => setExpirationDate(formatExpiry(e.target.value))}
                $error={errors.expirationDate}
              />
              {errors.expirationDate && (
                <ErrorMessage>{errors.expirationDate}</ErrorMessage>
              )}
            </FieldGroup>

            <FieldGroup>
              <Label>CVV</Label>
              <Input
                type="password"
                placeholder="•••"
                maxLength={4}
                value={ccv}
                onChange={(e) => setCcv(e.target.value.replace(/\D/g, ''))}
                $error={errors.ccv}
              />
              {errors.ccv && <ErrorMessage>{errors.ccv}</ErrorMessage>}
            </FieldGroup>
          </RowFields>

          <SubmitButton type="submit" disabled={loading}>
            {loading
              ? 'Sending Secure OTP Link via SMS...'
              : `Pay ₹${selectedBook.price}`}
          </SubmitButton>
        </Form>
      </CheckoutGrid>
    </PageContainer>
  );
};

export default PaymentForm;

