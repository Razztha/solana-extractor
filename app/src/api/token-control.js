import {
    LAMPORTS_PER_SOL, 
} from '@solana/web3.js';
import { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
} from '@solana/spl-token';

    export const createNftAndMint = async (connection, fromWallet) => {
        const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        var t = await connection.confirmTransaction(fromAirdropSignature);
        console.log(t);
    
        // Create new NFT mint
        var mint = await createMint(
            connection, 
            fromWallet, 
            fromWallet.publicKey, 
            null, 
            0 // only allow whole tokens
        );
            
        console.log(`Create NFT: ${mint.toBase58()}`);
    
        // Get the NFT account of the fromWallet address, and if it does not exist, create it
        var fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );

        console.log(`Create NFT Account: ${fromTokenAccount.address.toBase58()}`);

        // const signature = await mintTo(
        //     connection,
        //     fromWallet,
        //     mint,
        //     fromTokenAccount.address,
        //     fromWallet.publicKey,
        //     1
        // );
        // console.log(`Mint signature: ${signature}`);
    }   