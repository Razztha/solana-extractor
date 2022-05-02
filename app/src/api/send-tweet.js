import { web3 } from '@project-serum/anchor'
import { useWorkspace } from '@/composables'
import { Tweet } from '@/models'

// 1. Define the sendTweet endpoint.
export const sendTweet = async (topic, content) => {
    const { wallet, program } = useWorkspace()
  
  	// 2. Generate a new Keypair for our new tweet account.
    const keyPair = web3.Keypair.generate()

    // 3. Send a "SendTweet" instruction with the right data and the right accounts.
    try {
        await program.value.rpc.saveMetadata(content, {
            accounts: {
                // author: wallet.value.publicKey,
                author: wallet.publicKey,
                metadata: keyPair.publicKey,
                systemProgram: web3.SystemProgram.programId,
            },
            signers: [keyPair]
        })
    }
    catch(err) {
        alert(err.message);
    }

    // 4. Fetch the newly created account from the blockchain.
    const metadataAccount = await program.value.account.metadata.fetch(keyPair.publicKey)
    
    // 5. Wrap the fetched account in a Tweet model so our frontend can display it.
    return new Tweet(keyPair.publicKey, metadataAccount)
}