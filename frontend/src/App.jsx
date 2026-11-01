import React, { useState } from 'react';
import styled from 'styled-components';
import ProductList from './ProductList.jsx';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f4f6fb;
  display: flex;
  flex-direction: column;
`;

const Navbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  padding: 14px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
`;

const BrandTitle = styled.div`
  h1 {
    font-size: 1.25rem;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
    letter-spacing: -0.02em;
  }
  span {
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 500;
  }
`;

const SearchAndBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 0.9rem;
  width: 240px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #4f46e5;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }
`;

const SecurityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const HeroBanner = styled.section`
  max-width: 1200px;
  width: calc(100% - 48px);
  margin: 28px auto 12px;
  border-radius: 20px;
  background: linear-gradient(125deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
  color: #fff;
  padding: 36px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  box-shadow: 0 12px 30px rgba(49, 46, 129, 0.2);
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 28px 24px;
  }
`;

const HeroContent = styled.div`
  max-width: 640px;
  h2 {
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 10px;
    letter-spacing: -0.02em;
  }
  p {
    margin: 0;
    font-size: 1rem;
    color: #c7d2fe;
    line-height: 1.6;
  }
`;

const HeroStats = styled.div`
  display: flex;
  gap: 20px;

  div {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 14px 20px;
    border-radius: 14px;
    text-align: center;
  }
  strong {
    display: block;
    font-size: 1.3rem;
    color: #38bdf8;
  }
  span {
    font-size: 0.78rem;
    color: #e0e7ff;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 24px 60px;
  box-sizing: border-box;
  flex: 1;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 16px 0 20px;

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }
  span {
    font-size: 0.9rem;
    color: #64748b;
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 20px;
  font-size: 0.85rem;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
  background: #fff;
`;

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PageWrapper>
      <Navbar>
        <Brand>
          <LogoIcon>📚</LogoIcon>
          <BrandTitle>
            <h1>BookVault India</h1>
            <span>Curated Bestsellers & Academic Store</span>
          </BrandTitle>
        </Brand>

        <SearchAndBadge>
          <SearchInput
            type="text"
            placeholder="Search books or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SecurityBadge>🛡️ Geo-OTP Fraud Protected</SecurityBadge>
        </SearchAndBadge>
      </Navbar>

      <HeroBanner>
        <HeroContent>
          <h2>Bestselling Books at Indian Prices</h2>
          <p>
            Explore handpicked biographies, finance, self-improvement, and timeless classics delivered across India.
          </p>
        </HeroContent>
      </HeroBanner>

      <MainContent>
        <SectionHeader>
          <h3>Featured Books</h3>
          <span>Prices inclusive of all taxes (₹ INR)</span>
        </SectionHeader>
        <ProductList searchQuery={searchQuery} />
      </MainContent>

      <Footer>
        BookVault India Protected by Two-Factor & Geolocation
      </Footer>
    </PageWrapper>
  );
};

export default App;

