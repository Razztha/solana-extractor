import { computed } from 'vue'
import { useAnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@project-serum/anchor'
// import idl from '../../../target/idl/solana_extractor.json'
import idl from '@/idl/solana_twitter.json'

const programID = new PublicKey(idl.metadata.address)
let workspace = null

const clusterUrl = process.env.VUE_APP_CLUSTER_URL
export const useWorkspace = () => workspace
const preflightCommitment = 'processed'
const commitment = 'processed'

export const initWorkspace = () => {
    const wallet = useAnchorWallet()
    const connection = new Connection(clusterUrl, commitment)
    const provider = computed(() => new AnchorProvider(connection, wallet.value, { preflightCommitment, commitment }))
    const program = computed(() => new Program(idl, programID, provider.value))

    workspace = {
        wallet,
        connection,
        provider,
        program,
    }
}