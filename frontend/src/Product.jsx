import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ProductCard = styled.div`
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 260px;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const BookCover = styled.img`
  height: 100%;
  max-width: 180px;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
  transition: transform 0.3s ease;

  ${ProductCard}:hover & {
    transform: scale(1.04);
  }
`;

const FallbackCover = styled.div`
  width: 150px;
  height: 220px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  font-weight: 700;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.2);
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(6px);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 999px;
  letter-spacing: 0.02em;
`;

const RatingBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  background: #fef3c7;
  color: #b45309;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 999px;
`;

const CardBody = styled.div`
  padding: 20px 22px 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BookTitle = styled.h2`
  font-size: 1.12rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
  line-height: 1.35;
`;

const AuthorName = styled.p`
  font-size: 0.86rem;
  color: #64748b;
  margin: 0 0 18px;
`;

const PriceRow = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const CurrentPrice = styled.span`
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
`;

const OriginalPrice = styled.span`
  font-size: 0.88rem;
  color: #94a3b8;
  text-decoration: line-through;
`;

const DiscountTag = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #16a34a;
  background: #dcfce7;
  padding: 2px 7px;
  border-radius: 6px;
`;

const BuyButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25);

  &:hover {
    background: linear-gradient(135deg, #4338ca, #3730a3);
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(79, 70, 229, 0.35);
  }
`;

const Product = ({ product }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const discountPercent = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  const handleBuyNow = () => {
    navigate('/payment', { state: { product } });
  };

  return (
    <ProductCard>
      <ImageWrapper>
        <CategoryBadge>{product.category}</CategoryBadge>
        <RatingBadge>★ {product.rating}</RatingBadge>
        {!imgError ? (
          <BookCover
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
          />
        ) : (
          <FallbackCover>
            <span style={{ fontSize: '2rem', marginBottom: '8px' }}>📖</span>
            {product.name}
          </FallbackCover>
        )}
      </ImageWrapper>

      <CardBody>
        <BookTitle>{product.name}</BookTitle>
        <AuthorName>by {product.author}</AuthorName>

        <PriceRow>
          <PriceGroup>
            <CurrentPrice>₹{product.price}</CurrentPrice>
            {product.mrp && <OriginalPrice>₹{product.mrp}</OriginalPrice>}
            {discountPercent && <DiscountTag>{discountPercent}% OFF</DiscountTag>}
          </PriceGroup>
          <BuyButton onClick={handleBuyNow}>Buy Now</BuyButton>
        </PriceRow>
      </CardBody>
    </ProductCard>
  );
};

export default Product;

