import { IdlAccounts, Program, AnchorProvider, web3 } from '@coral-xyz/anchor'
import { Lottery } from './idl'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from '@solana/web3.js'
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react'
import { createContext, useEffect, useState, ReactNode } from 'react'
import {
  getProgram,
  globalAccountPDA,
  lotteryKeyInfoPDA,
} from './program'
import { BN } from 'bn.js'
import {
  ADMIN_KEY,
  ADMIN_KEYPAIR,
  DevFee,
  MaxTickets,
  POOL_KEYPAIR,
  PROGRAM_ID,
  TAX_KEYPAIR,
  TicketPrice,
  TimeFrame,
  USDT_MINT_ADDRESS,
  tokenOwner,
} from './constants'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAccount,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  createMint,
  getAccount,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from '@solana/spl-token'
import { token } from '@coral-xyz/anchor/dist/cjs/utils'

// Define a proper context type
interface GlobalContextType {
  buyTicket: (lotteryType: number) => Promise<void>
}

export const GlobalContext = createContext<GlobalContextType>({
  buyTicket: async () => {},
})

interface GlobalStateProps {
  children: ReactNode
}

export const GlobalState = ({ children }: GlobalStateProps) => {
  const [program, setProgram] = useState<Program<Lottery> | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null)
  const [globalAccount, setGlobalAccount] = useState<any | null>(null)
  const [isAdmin, setAdmin] = useState(false)
  const [poolATA, setPoolATA] = useState<any | null>(null);
  const [withdrawATA, setWithdrawATA] = useState<any | null>(null);
  

  const { connection } = useConnection()
  const wallet = useWallet()

  /***********For Development ************/

  useEffect(() => {
    const tokenMint = async () => {
      let poolATA =  await getOrCreateAssociatedTokenAccount(connection, POOL_KEYPAIR, USDT_MINT_ADDRESS, POOL_KEYPAIR.publicKey);
      let withdrawATA = await getOrCreateAssociatedTokenAccount(connection, TAX_KEYPAIR, USDT_MINT_ADDRESS, TAX_KEYPAIR.publicKey);
      setPoolATA(poolATA);
      setWithdrawATA(withdrawATA);
    }
    tokenMint();
  }, [wallet]);


  //*************************************/


  useEffect(() => {
    if (!wallet) return
    if (connection) {
      setProgram(getProgram(connection, wallet ?? {}))
    } else {
      setProgram(null)
    }
  }, [connection, wallet])

//   useEffect(() => {
//     const fetchData = async () => {
//         if (!wallet?.publicKey || !program) return;

//         const globalAccount = await program.account.globalAccount.all();

//         if (!globalAccount || globalAccount.length === 0) {
//             console.log('App is not initialized');
//             if (wallet.publicKey.toString() === ADMIN_KEY.toString()) {
//                 console.log("here");
//                 await initialize();

//                 const globalAccountData = await program?.account.globalAccount.fetch(globalAccountPDA);
//                 setGlobalAccount(globalAccountData);
//                 setIsInitialized(true);
//                 setAdmin(true);

//               }
//             } else {
//           await setInitialLottery(1);
//             setGlobalAccount(globalAccount);
//         }
//     };

//     fetchData();
// }, [wallet, program]);


  // const initialize = async () => {
  //   console.log('Initializing...');
  //   if (!wallet.publicKey) return;
  //   try {

  //     let poolATA =  await getOrCreateAssociatedTokenAccount(connection, POOL_KEYPAIR, USDT_MINT_ADDRESS, POOL_KEYPAIR.publicKey);
  //     let withdrawATA = await getOrCreateAssociatedTokenAccount(connection, TAX_KEYPAIR, USDT_MINT_ADDRESS, TAX_KEYPAIR.publicKey);
  //     const transaction = await program?.methods.initialize()
  //     .accounts({
  //         initializer: ADMIN_KEYPAIR.publicKey,
  //         globalAccount: globalAccountPDA,
  //         poolTokenAccount: poolATA.address,
  //         lotteryPdakeyInfo: lotteryKeyInfoPDA,
  //         withdrawTokenAccount: withdrawATA.address,
  //         systemProgram: SystemProgram.programId,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //     })
  //     .signers([ADMIN_KEYPAIR])
  //     .transaction(); 
  
  //   if(!transaction) return;
  //   transaction.feePayer = ADMIN_KEYPAIR.publicKey;
  // console.log(transaction,"transaction")
  //   const txHash = await connection.sendTransaction(transaction, [ADMIN_KEYPAIR]);
    
  //   await connection.confirmTransaction(txHash,"finalized");
  //     console.log(txHash, 'Transaction signature');
  //   } catch (error) {
  //     console.error('Transaction failed:', error);
  //   }
  // };

 

  const buyTicket = async (id: number) => {
    console.log('Buy Ticket Function')
    if (!wallet.publicKey) return

    const associatedTokenAddress = await getAssociatedTokenAddress(USDT_MINT_ADDRESS, wallet.publicKey,false)

    let userAssociatedTokenAddress;
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress)

    if (accountInfo) {
      console.log("auccount exist");
      userAssociatedTokenAddress = associatedTokenAddress
    } else {
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedTokenAddress,
          wallet.publicKey,
          USDT_MINT_ADDRESS,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      )

      transaction.feePayer = wallet.publicKey
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      const signedTransaction = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signedTransaction);

      userAssociatedTokenAddress = associatedTokenAddress
    }

    if ( !wallet.publicKey || !userAssociatedTokenAddress || !poolATA.address) return;

    const [userAccountPDA] = PublicKey.findProgramAddressSync([Buffer.from('USER_INFO_SEED'), wallet.publicKey.toBuffer()], PROGRAM_ID);
    const [lotteryPDA] = PublicKey.findProgramAddressSync([Buffer.from('LOTTERY_INFO_SEED'), ADMIN_KEY.toBuffer(), new Uint8Array([id])], PROGRAM_ID);
    console.log(lotteryPDA,"Lottery PDA");
    const txHash = await program?.methods.buyTicket()
      .accounts({
        buyer: wallet.publicKey,
        globalAccount: globalAccountPDA,
        poolTokenAccount: poolATA.address,
        buyerTokenAccount: userAssociatedTokenAddress,
        user: userAccountPDA,
        lottery: lotteryPDA,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .rpc()
      .catch((error) => {
        console.log(error,"buy ticket error");
      })
  }

  // const endLottery = async (id: number) => {
  //   if (!wallet.publicKey) return

  //   const [lotteryPDA] = PublicKey.findProgramAddressSync([Buffer.from('LOTTERY_INFO_SEED'), ADMIN_KEY.toBuffer(), new Uint8Array([id])], PROGRAM_ID);

  //   const txHash = await program?.methods
  //     .endLottery()
  //     .accounts({
  //       admin: ADMIN_KEY,
  //       lottery: lotteryPDA,
  //       poolTokenAccount: poolATA?.address,
  //       taxTokenAccount: withdrawATA?.address,
  //     })
  //     .rpc()
  // }


  return (
    <GlobalContext.Provider value={{ buyTicket}}>
      {children}
    </GlobalContext.Provider>
  )
}
