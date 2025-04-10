import React from 'react';
import { Box, Container, ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MintPage from './pages/MintPage';
import Navbar from './components/Navbar';
import MarketplacePage from './pages/MarketplacePage';

// Create a custom theme with some defaults
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.100',
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg="gray.100">
          <Navbar />
          <Container maxW="container.xl" py={8}>
            <Routes>
              <Route path="/" element={<MarketplacePage />} />
              <Route path="/mint" element={<MintPage />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App; 