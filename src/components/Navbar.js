import React from 'react';
import { Box, Flex, Button, Heading } from '@chakra-ui/react';
import { useNearWallet } from '../hooks/useNearWallet';

const Navbar = () => {
  const { accountId, signIn, signOut } = useNearWallet();

  return (
    <Box bg="white" px={4} py={4} shadow="sm">
      <Flex maxW="container.xl" mx="auto" align="center" justify="space-between">
        <Heading size="md">Synphonic</Heading>
        <Button
          colorScheme={accountId ? "red" : "blue"}
          onClick={accountId ? signOut : signIn}
        >
          {accountId ? `Disconnect ${accountId}` : 'Connect NEAR Wallet'}
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar; 