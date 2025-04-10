import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  useToast,
  Container,
  Badge,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useNearWallet } from '../hooks/useNearWallet';

const MarketplacePage = () => {
  const { accountId, purchaseNFT } = useNearWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Placeholder data - replace with actual contract calls
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        // TODO: Replace with actual contract call
        const mockNFTs = [
          {
            id: '1',
            title: 'City of Solitude - Chapter 1',
            description: 'The opening chapter of our epic journey',
            image: '/placeholder-album-art.jpg',
            price: '5',
            artist: 'City of Solitude',
            available: true
          },
          // Add more mock NFTs here
        ];
        setNfts(mockNFTs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const handlePurchase = async (nftId, price) => {
    if (!accountId) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your NEAR wallet first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await purchaseNFT(nftId, price);
      toast({
        title: 'Purchase Successful',
        description: 'You have successfully purchased this NFT',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error purchasing NFT',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Loading NFTs...</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={2}>City of Solitude</Heading>
          <Text fontSize="xl" color="gray.600">
            Collect unique musical pieces from our epic journey
          </Text>
        </Box>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={8}
        >
          {nfts.map((nft) => (
            <Box
              key={nft.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              shadow="md"
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.02)' }}
            >
              <Image
                src={nft.image}
                alt={nft.title}
                height="200px"
                width="100%"
                objectFit="cover"
              />
              
              <Box p={6}>
                <Flex align="center" mb={2}>
                  <Heading size="md">{nft.title}</Heading>
                  <Spacer />
                  <Badge colorScheme={nft.available ? 'green' : 'red'}>
                    {nft.available ? 'Available' : 'Sold'}
                  </Badge>
                </Flex>
                
                <Text color="gray.600" mb={4}>
                  {nft.description}
                </Text>
                
                <Flex align="center" mb={4}>
                  <Text fontWeight="bold">Artist:</Text>
                  <Text ml={2}>{nft.artist}</Text>
                </Flex>
                
                <Flex align="center" justify="space-between">
                  <Text fontSize="xl" fontWeight="bold">
                    {nft.price} NEAR
                  </Text>
                  <Button
                    colorScheme="blue"
                    onClick={() => handlePurchase(nft.id, nft.price)}
                    isDisabled={!nft.available || !accountId}
                  >
                    {accountId ? 'Purchase' : 'Connect Wallet'}
                  </Button>
                </Flex>
              </Box>
            </Box>
          ))}
        </Grid>
      </VStack>
    </Container>
  );
};

export default MarketplacePage; 