import {
    LAMPORTS_PER_SOL,
    Transaction, 
    sendAndConfirmTransaction,  
    // Keypair
} from '@solana/web3.js';
import {
    // setAuthority,
    mintTo, 
    createMint, 
    getOrCreateAssociatedTokenAccount,
    createSetAuthorityInstruction, 
    AuthorityType 
} from '@solana/spl-token';
// import { web3 } from '@project-serum/anchor';

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

        const signature = await mintTo(
                connection,
                fromWallet,
                mint,
                fromTokenAccount.address,
                fromWallet.publicKey,
                1
            );
            
        console.log(`Mint signature: ${signature}`);

        // Create our transaction to change minting permissions
        let transaction = new Transaction().add(createSetAuthorityInstruction(
            mint,
            fromWallet.publicKey,
            AuthorityType.MintTokens,
            null
        ));
    
        // Send transaction
        const signatureLock = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
        console.log(`Lock signature: ${signatureLock}`);

        return {nft:mint.toBase58(), nft_account: fromTokenAccount.address.toBase58()}; 
    }   