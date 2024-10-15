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
  buyTicket: (lotteryPubkeyStr: string, count: number) => Promise<void>;
  joinToLottery: (lotteryPDAStr: string, userSpotIndex: number) => Promise<void>;
  getUserData: () => Promise<any | null>; 
  getLotteryData: (lotteryPDAStr: string) => Promise<any | null>;
}

export const GlobalContext = createContext<GlobalContextType>({
  buyTicket: async (lotteryPubkeyStr: string, count: number) => {},
  joinToLottery: async (lotteryPDAStr: string, userSpotIndex: number) => {},
  getUserData: async () => null,
  getLotteryData: async (lotteryPDAStr: string) => null,
});

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


  const buyTicket = async (lotteryPubkeyStr: string, count: number) => {
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
    const lotteryPDA = new web3.PublicKey(lotteryPubkeyStr)
    console.log(lotteryPDA,"Lottery PDA");
    const txHash = await program?.methods.buyTicket(count)
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

      let [userPDA, bump] = PublicKey.findProgramAddressSync([Buffer.from("USER_INFO_SEED"), wallet.publicKey.toBuffer()], PROGRAM_ID);
      let userdata = await program?.account.user.fetch(userPDA);
      console.log(userdata,"*********************")
      console.log(txHash,"buyticket txHash");
  }


  const joinToLottery = async(lotteryPDAStr: string, userSpotIndex: number) => {
    if (!wallet.publicKey) return
    let [userPDA, bump] = PublicKey.findProgramAddressSync([Buffer.from("USER_INFO_SEED"), wallet.publicKey.toBuffer()], PROGRAM_ID);
    console.log(lotteryPDAStr,"****************")
    let lotteryPDA = new web3.PublicKey(lotteryPDAStr);

    const txHash = await program?.methods.joinLottery(userSpotIndex)
      .accounts({
        lottery: lotteryPDA,
        user: userPDA,
        systemProgram: web3.SystemProgram.programId
      })
      .rpc()
      .catch((error) => {
        console.log(error, " in joinlottery");
      });

      console.log(txHash,"txHash");
  }

  const getUserData = async() => {
    if (!wallet.publicKey) return
    let [userPDA, bump] = PublicKey.findProgramAddressSync([Buffer.from("USER_INFO_SEED"), wallet.publicKey.toBuffer()], PROGRAM_ID);
    const accountInfo = await connection.getAccountInfo(userPDA);
    
    if (!accountInfo){ return null;}
    let userdata = await program?.account.user.fetch(userPDA);
    console.log(userdata,"*****")
    return userdata;
  }

  const getLotteryData = async (lotteryPDAStr: string) => {
    let lotteryPDA = new web3.PublicKey(lotteryPDAStr);
    let lotteryData = await program?.account.lottery.fetch(lotteryPDA);
    return lotteryData;
  }

  return (
    <GlobalContext.Provider value={{ buyTicket, getUserData, getLotteryData, joinToLottery}}>
      {children}
    </GlobalContext.Provider>
  )
}
