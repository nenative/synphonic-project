import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Textarea,
} from '@chakra-ui/react';
import { useNearWallet } from '../hooks/useNearWallet';

const MintPage = () => {
  const { accountId, mintNFT } = useNearWallet();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'audio/mpeg') {
      setFile(selectedFile);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an MP3 file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMint = async () => {
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

    if (!file || !title || !description) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields and upload an MP3 file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await mintNFT(title, description, file);
      toast({
        title: 'NFT Minted Successfully',
        description: 'Your MP3 has been minted as an NFT',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
    } catch (error) {
      toast({
        title: 'Error minting NFT',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="container.md" mx="auto" p={6}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Mint Your Music NFT</Heading>
        
        <FormControl isRequired>
          <FormLabel>MP3 File</FormLabel>
          <Input
            type="file"
            accept=".mp3"
            onChange={handleFileChange}
            p={1}
          />
          {file && (
            <Text mt={2} fontSize="sm" color="green.500">
              Selected file: {file.name}
            </Text>
          )}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your song title"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your music"
          />
        </FormControl>

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleMint}
          isLoading={isLoading}
          loadingText="Minting..."
          isDisabled={!accountId}
        >
          Mint NFT
        </Button>

        {!accountId && (
          <Text textAlign="center" color="red.500">
            Please connect your NEAR wallet to mint NFTs
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default MintPage; 