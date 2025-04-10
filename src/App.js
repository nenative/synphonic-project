import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MintPage from './pages/MintPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="gray.100">
        <Navbar />
        <Container maxW="container.xl" py={8}>
          <Routes>
            <Route path="/" element={<MintPage />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
