const {struct, u32, ns64} = require("@solana/buffer-layout");
const {Buffer} = require('buffer');
const {Keypair} = require("@solana/web3.js");
const web3 = require("@solana/web3.js");

export const sendTweetDefault = async (topic, content) => {
  console.log(content);
    let keypair = web3.Keypair.generate();
    let secretKey = Uint8Array.from([192,109,125,45,89,42,45,118,106,97,238,234,188,25,173,180,194,187,77,246,220,167,10,212,229,2,33,102,61,112,237,225,114,125,195,41,58,244,207,18,191,200,130,47,60,72,8,212,218,249,157,207,52,65,45,10,186,117,216,216,233,205,132,216]);
    let payer = Keypair.fromSecretKey(secretKey);
    
    let connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    
    // let airdropSignature = await connection.requestAirdrop(
    //   payer.publicKey,
    //   web3.LAMPORTS_PER_SOL,
    // );
    
    // await connection.confirmTransaction(airdropSignature);
    
    let allocateTransaction = new web3.Transaction({
      feePayer: payer.publicKey
    });
    let keys = [{pubkey: keypair.publicKey, isSigner: true, isWritable: true}];
    let params = { author: payer.publicKey, timestamp:  Math.floor(new Date().getTime() / 1000), data: content};
    // let params = {space: "100"};
    
    let allocateStruct = {
      index: 0,
      layout: struct([
        u32('instruction'),
        // ns64('space')
        ns64('author'),
        ns64('timestamp'),
        String('data')
      ])
    };
    
    console.log("after buffer");
    let data = Buffer.alloc(allocateStruct.layout.span);
    let layoutFields = Object.assign({instruction: allocateStruct.index}, params);
    allocateStruct.layout.encode(layoutFields, data);
    
    allocateTransaction.add(new web3.TransactionInstruction({
      keys,
      programId: web3.SystemProgram.programId,
      data,
    }));
    console.log("after transaction")
    var t = await web3.sendAndConfirmTransaction(connection, allocateTransaction, [payer, keypair]);
    console.log(t);  
}