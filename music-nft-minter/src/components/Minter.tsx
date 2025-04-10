"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./ui/input";
import { useState } from "react";
import { useBitteWallet } from "@mintbase-js/react";
import { uploadFile, uploadReference } from "@mintbase-js/storage";
import { BitteWalletSetup, proxyAddress } from "@/config/setup";
import { Wallet } from "@near-wallet-selector/core";
import { cbUrl } from "@/hooks/utils";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  media: z.string().optional(),
});

const Spinner = () => {
  return (
    <div className="lds-ellipsis">
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default function Minter() {
  const { selector, activeAccountId } = useBitteWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      media: "",
    },
  });

  const getWallet = async () => {
    try {
      return await selector.wallet();
    } catch (error) {
      console.error("Failed to retrieve the wallet:", error);
      throw new Error("Failed to retrieve the wallet");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview URL for the file
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!file || !activeAccountId) return;
    
    setIsLoading(true);
    try {
      const wallet = await getWallet();
      
      // Upload the file to Arweave
      const fileUpload = uploadFile(file);
      
      // Upload the reference metadata
      const reference = await uploadReference({
        title: data.title,
        description: data.description,
        media: file.name,
      });
      
      // Handle the minting process
      await handleMint(
        reference.id,
        fileUpload,
        activeAccountId,
        wallet,
        reference.media_url as string,
        data.title
      );
      
      // Reset form
      form.reset();
      setFile(null);
      setPreviewUrl(null);
      
    } catch (error) {
      console.error("Error minting NFT:", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function handleMint(
    reference: string,
    media: Promise<any>,
    activeAccountId: string,
    wallet: Wallet,
    mediaUrl: string,
    nftTitle: string
  ) {
    if (reference) {
      const finalMediaUrl = mediaUrl.replace("https://arweave.net/", "");

      const callbackArgs = {
        contractAddress: BitteWalletSetup.contractAddress.toString(),
        amount: 1,
        ref: `${reference}`,
        mediaUrl: finalMediaUrl,
        title: nftTitle,
      };

      await wallet.signAndSendTransaction({
        signerId: activeAccountId,
        receiverId: proxyAddress,
        callbackUrl: cbUrl(reference, callbackArgs),
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "mint",
              args: {
                metadata: JSON.stringify({
                  reference,
                  media: (await media).id,
                }),
                nft_contract_id: BitteWalletSetup.contractAddress,
              },
              gas: "200000000000000",
              deposit: "10000000000000000000000",
            },
          },
        ],
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Mint your Music NFT</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Song Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-2"></div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-2"></div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Music File</label>
              <Input 
                type="file" 
                accept="audio/*" 
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {previewUrl && (
                <div className="mt-2">
                  <audio controls className="w-full">
                    <source src={previewUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-center items-center gap-2">
            <Button
              type="submit"
              disabled={isLoading || !file}
            >
              {isLoading ? <Spinner /> : "Mint Music NFT"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
} 