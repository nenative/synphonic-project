import { create } from 'ipfs-http-client';

// Initialize IPFS client
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET}`
    ).toString('base64')}`,
  },
});

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    // Upload to IPFS
    const result = await ipfs.add(Buffer.from(buffer), {
      pin: true,
    });
    
    // Return IPFS URL
    return `https://ipfs.io/ipfs/${result.path}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
} 