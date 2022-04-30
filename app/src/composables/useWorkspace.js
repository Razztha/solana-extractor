import { computed } from 'vue'
// import { useAnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@project-serum/anchor'
// import idl from '../../../target/idl/solana_extractor.json'
import idl from '@/idl/solana_extractor.json'
// import {MyWallet} from './export.ts'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
const {Keypair} = require("@solana/web3.js");

const programID = new PublicKey(idl.metadata.address)
let workspace = null

const clusterUrl = process.env.VUE_APP_CLUSTER_URL
export const useWorkspace = () => workspace
const preflightCommitment = 'processed'
const commitment = 'processed'

export const initWorkspace = () => {
    // const wallet = useAnchorWallet()
    let secretKey = Uint8Array.from([192,109,125,45,89,42,45,118,106,97,238,234,188,25,173,180,194,187,77,246,220,167,10,212,229,2,33,102,61,112,237,225,114,125,195,41,58,244,207,18,191,200,130,47,60,72,8,212,218,249,157,207,52,65,45,10,186,117,216,216,233,205,132,216]);
    let payer = Keypair.fromSecretKey(secretKey);
    let wallet = new NodeWallet(payer);

    const connection = new Connection(clusterUrl, commitment)
    const provider = computed(() => new AnchorProvider(connection, wallet, { preflightCommitment, commitment }))
    const program = computed(() => new Program(idl, programID, provider.value))

    workspace = {
        wallet,
        connection,
        provider,
        program,
    }
}