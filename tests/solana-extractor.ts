import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaExtractor } from "../target/types/solana_extractor";

describe("solana-extractor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.SolanaExtractor as Program<SolanaExtractor>;

  it('can save meta data', async () => {
    // Call the "SendTweet" instruction.
    const keyPair = anchor.web3.Keypair.generate();
    await program.rpc.saveMetadata('test', {
        accounts: {
            metadata: keyPair.publicKey,
            author: program.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [keyPair],
    });

    // Fetch the account details of the created tweet.
    const metadata = await program.account.metadata.fetch(keyPair.publicKey);
  	console.log(metadata);
  });

  it('cannot provide data more than 300', async () => {
    try {
        const keyPair = anchor.web3.Keypair.generate();
        const jsonWith300 = 'x'.repeat(350);
        await program.rpc.saveMetadata(jsonWith300, {
            accounts: {
                metadata: keyPair.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [keyPair],
        });
    } catch (error) {
        console.log("failed");
        // assert.equal(error.msg, 'The provided topic should be 50 characters long maximum.');
        return;
    }

    // assert.fail('The instruction should have failed with a 51-character topic.');
  });

  it('can fetch all data', async () => {
    const metadata = await program.account.metadata.all();
    console.log(metadata);
    // assert.equal(tweetAccounts.length, 3);
});
});
