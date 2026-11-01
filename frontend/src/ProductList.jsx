import React from 'react';
import styled from 'styled-components';
import Product from './Product.jsx';

const books = [
  {
    id: 1,
    name: 'Wings of Fire: An Autobiography',
    author: 'A.P.J. Abdul Kalam & Arun Tiwari',
    category: 'Biography',
    rating: '4.9',
    price: 299,
    mrp: 450,
    image: 'https://covers.openlibrary.org/b/isbn/9788173711466-L.jpg',
  },
  {
    id: 2,
    name: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Improvement',
    rating: '4.8',
    price: 449,
    mrp: 699,
    image: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
  },
  {
    id: 3,
    name: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance',
    rating: '4.8',
    price: 349,
    mrp: 499,
    image: 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg',
  },
  {
    id: 4,
    name: 'Ikigai: The Japanese Secret',
    author: 'Héctor García & Francesc Miralles',
    category: 'Lifestyle',
    rating: '4.7',
    price: 319,
    mrp: 550,
    image: 'https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg',
  },
  {
    id: 5,
    name: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    rating: '4.8',
    price: 249,
    mrp: 399,
    image: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
  },
  {
    id: 6,
    name: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    category: 'Personal Finance',
    rating: '4.7',
    price: 379,
    mrp: 599,
    image: 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg',
  },
  {
    id: 7,
    name: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    rating: '4.8',
    price: 499,
    mrp: 799,
    image: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
  },
  {
    id: 8,
    name: 'Zero to One',
    author: 'Peter Thiel & Blake Masters',
    category: 'Startups & Tech',
    rating: '4.6',
    price: 399,
    mrp: 650,
    image: 'https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg',
  },
  {
    id: 9,
    name: 'Deep Work: Rules for Focused Success',
    author: 'Cal Newport',
    category: 'Productivity',
    rating: '4.7',
    price: 359,
    mrp: 550,
    image: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
  },
];

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 16px;
  color: #64748b;
  font-size: 1.05rem;
`;

const ProductList = ({ searchQuery = '' }) => {
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredBooks.length === 0) {
    return <EmptyState>No books found matching "{searchQuery}".</EmptyState>;
  }

  return (
    <ProductGrid>
      {filteredBooks.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </ProductGrid>
  );
};

export default ProductList;

