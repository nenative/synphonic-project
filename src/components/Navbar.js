import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  Heading,
  Link,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { useNearWallet } from '../hooks/useNearWallet';

const Navbar = () => {
  const { accountId, signIn, signOut } = useNearWallet();

  return (
    <Box bg="white" px={4} py={4} shadow="sm">
      <Flex maxW="container.xl" mx="auto" align="center">
        <Link as={RouterLink} to="/">
          <Heading size="md">City of Solitude</Heading>
        </Link>
        
        <Flex ml={8}>
          <Link as={RouterLink} to="/" mx={4}>
            Marketplace
          </Link>
          <Link as={RouterLink} to="/mint" mx={4}>
            Mint NFT
          </Link>
        </Flex>

        <Spacer />

        {accountId ? (
          <Flex align="center">
            <Text mr={4} fontSize="sm" color="gray.600">
              {accountId}
            </Text>
            <Button
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={signOut}
            >
              Disconnect
            </Button>
          </Flex>
        ) : (
          <Button
            colorScheme="blue"
            onClick={signIn}
          >
            Connect NEAR Wallet
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar; 