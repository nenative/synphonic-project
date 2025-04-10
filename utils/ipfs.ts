import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { json } from '@helia/json';

// Configure Helia client to connect to Infura's IPFS gateway
const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_API_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

let helia: any;
let fs: any;
let jsonHandler: any;

async function initHelia() {
  if (!helia) {
    helia = await createHelia({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      },
    });
    fs = unixfs(helia);
    jsonHandler = json(helia);
  }
}

export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    await initHelia();
    const buffer = await file.arrayBuffer();
    const cid = await fs.add(new Uint8Array(buffer));
    const url = `https://ipfs.io/ipfs/${cid.toString()}`;
    return url;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};

export const uploadMetadataToIPFS = async (metadata: any): Promise<string> => {
  try {
    await initHelia();
    const cid = await jsonHandler.add(metadata);
    const url = `https://ipfs.io/ipfs/${cid.toString()}`;
    return url;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
}; 