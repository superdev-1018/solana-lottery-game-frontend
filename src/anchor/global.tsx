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
  globalAccountPDA
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
import {toast} from 'react-toastify';

// Define a proper context type
interface GlobalContextType {
  getOpenedLottery: () => Promise<any | null>;
  buyTicket: (lotteryPubkeyStr: string, count: number, referralID: string) => Promise<void>;
  joinToLottery: (lotteryPDAStr: string, userSpotIndex: number) => Promise<void>;
  getUserData: () => Promise<any | null>; 
  getLotteryData: (lotteryPDAStr: string) => Promise<any | null>;
  getWinnerTicker: () => Promise<any | null>;
  getDepositeTicker: () => Promise<any | null>;
  getHistory: (timeFrame: number) => Promise<any | null>;
  setUserReferral: (link:string) => Promise<any | null>;
}

export const GlobalContext = createContext<GlobalContextType>({
  getOpenedLottery: async () => null,
  buyTicket: async (lotteryPubkeyStr: string, count: number, referralID: string) => {},
  joinToLottery: async (lotteryPDAStr: string, userSpotIndex: number) => {},
  getUserData: async () => null,
  getLotteryData: async (lotteryPDAStr: string) => null,
  getWinnerTicker: async () => null,
  getDepositeTicker: async () => null,
  getHistory: async (timeFrame: number) => null,
  setUserReferral: async (link:string) => null,
});

interface GlobalStateProps {
  children: ReactNode
}

export const GlobalStateContext = ({ children }: GlobalStateProps) => {
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



  const getOpenedLottery = async () => {
    const lotteryData = await program?.account.lottery.all();
  
    if (!lotteryData) return;
  
    const openedLottery = lotteryData
      .filter((lottery) => lottery.account.state == 0)
      .map((lottery) => ({
        account: {
          id: lottery.account.id,
          timeFrame: lottery.account.timeFrame,
          ticketPrice: lottery.account.ticketPrice,
          maxTicket: lottery.account.maxTicket,
          devFee: lottery.account.devFee,
          startTime: lottery.account.startTime,
          endTime: lottery.account.endTime,
          state: lottery.account.state,
          participants: lottery.account.participants.map((pubkey) =>
            pubkey.toString()
          ),
          winner: lottery.account.winner,
          prizePercent: lottery.account.prizePercent,
          winnerPrize: lottery.account.winnerPrize,
          realPoolAmount: lottery.account.realPoolAmount,
          realCount: lottery.account.realCount,
          round: lottery.account.round,
        },
        publicKey: lottery.publicKey,
      }))
      .sort((a, b) => Number(a.account.timeFrame) - Number(b.account.timeFrame));
  
    return openedLottery;
  };
  

  const buyTicket = async (lotteryPubkeyStr: string, count: number, referralID: string) => {
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

    const [depositeTickerPDA] = PublicKey.findProgramAddressSync([Buffer.from('DEPOSITE_TICKER_SEED')], PROGRAM_ID);

    let referrerPDA;
    if (referralID && referralID != ""){
      const userList = await program?.account.user.all();
      const referrerData = userList?.find(user => user.account.referralLink === referralID);
      referrerPDA = referrerData?.publicKey;
    }

    let txHash;
    if (referralID == "" || !referralID){
       txHash = await program?.methods.buyTicket(count)
      .accounts({
        buyer: wallet.publicKey,
        globalAccount: globalAccountPDA,
        poolTokenAccount: poolATA.address,
        buyerTokenAccount: userAssociatedTokenAddress,
        user: userAccountPDA,
        lottery: lotteryPDA,
        depositeTicker: depositeTickerPDA,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .rpc()
      .catch((error) => {
        console.log(error,"buy ticket error");
      })
    } else {
      txHash = await program?.methods.buyTicketWithReferral(count)
      .accounts({
        buyer: wallet.publicKey,
        globalAccount: globalAccountPDA,
        poolTokenAccount: poolATA.address,
        buyerTokenAccount: userAssociatedTokenAddress,
        user: userAccountPDA,
        referrer: referrerPDA,
        lottery: lotteryPDA,
        depositeTicker: depositeTickerPDA,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .rpc()
      .catch((error) => {
        console.log(error,"buy ticket error");
      })
    }
    

      let [userPDA, bump] = PublicKey.findProgramAddressSync([Buffer.from("USER_INFO_SEED"), wallet.publicKey.toBuffer()], PROGRAM_ID);
      let userdata = await program?.account.user.fetch(userPDA);
      if (txHash){ toast.success("Ticket Buy Success!",{position:'top-center', autoClose:7000})}
      console.log(txHash,"buyticket txHash");
  }


  const joinToLottery = async(lotteryPDAStr: string, userSpotIndex: number) => {
    if (!wallet.publicKey) return
    let [userPDA, bump] = PublicKey.findProgramAddressSync([Buffer.from("USER_INFO_SEED"), wallet.publicKey.toBuffer()], PROGRAM_ID);

    let lotteryPDA = new web3.PublicKey(lotteryPDAStr);

    const txHash = await program?.methods.joinLottery(userSpotIndex)
      .accounts({
        lottery: lotteryPDA,
        user: userPDA,
        systemProgram: web3.SystemProgram.programId
      })
      .rpc()
      .catch((error) => {
        const errorMessage = error.message || "";
        if (errorMessage.includes('Already participated')) {
          toast.error('You have already participated in this lottery!', {
            position: "top-center",
            autoClose: 5000,
          });
        } else {
          toast.error('An error occurred, please try again.', {
            position: "top-center",
          });
        }
        console.error(error);
      });
      if (typeof txHash == 'string'){ console.log(txHash,"txhash in join lottery")
        toast.success("Successfully Joined!", {position:'top-center', autoClose:7000});
      }
  }

  const getUserData = async() => {
    if (!wallet.publicKey) return
    let [userPDA, bump] = PublicKey.findProgramAddressSync([Buffer.from("USER_INFO_SEED"), wallet.publicKey.toBuffer()], PROGRAM_ID);
    const accountInfo = await connection.getAccountInfo(userPDA);
    
    if (!accountInfo){ return null;}
    let userdata = await program?.account.user.fetch(userPDA);

    return userdata;
  }

  const getLotteryData = async (lotteryPDAStr: string) => {
    let lotteryPDA = new web3.PublicKey(lotteryPDAStr);
    let lotteryData = await program?.account.lottery.fetch(lotteryPDA);
    return lotteryData;
  }

  const getWinnerTicker = async () => {
    let [winnerTickerPDA] = PublicKey.findProgramAddressSync([Buffer.from("WINNER_TICKER_SEED")], PROGRAM_ID);
    let winnerTickerData = await program?.account.winnerTicker.fetch(winnerTickerPDA);
    return winnerTickerData;
  }

  const getDepositeTicker = async () => {
    let [depositeTickerPDA] = PublicKey.findProgramAddressSync([Buffer.from("DEPOSITE_TICKER_SEED")], PROGRAM_ID);
    let depositeTickerData = await program?.account.depositeTicker.fetch(depositeTickerPDA);
    return depositeTickerData;
  }

  const getHistory = async (timeFrame: number) => {
    const systemProgramId = SystemProgram.programId.toString();
  
    const lotteryData = await program?.account.lottery.all();
    if (!lotteryData) return;
  
    const closedLottery = await lotteryData
      .filter((lottery) => 
        lottery.account.state == 1 && 
        Number(lottery.account.timeFrame) == timeFrame
      )
      .filter((lottery) => {
        const hasOnlyRealWallets = lottery.account.winner.every(
          (winnerPubkey) => winnerPubkey.toString() !== systemProgramId
        );
        return hasOnlyRealWallets;
      })
      .map((lottery) => ({
        account: {
          id: lottery.account.id,
          timeFrame: lottery.account.timeFrame,
          ticketPrice: lottery.account.ticketPrice,
          maxTicket: lottery.account.maxTicket,
          devFee: lottery.account.devFee,
          startTime: lottery.account.startTime,
          endTime: lottery.account.endTime,
          state: lottery.account.state,
          participants: lottery.account.participants.map((pubkey) =>
            pubkey.toString()
          ),
          winner: lottery.account.winner,
          prizePercent: lottery.account.prizePercent,
          winnerPrize: lottery.account.winnerPrize,
          realPoolAmount: lottery.account.realPoolAmount,
          realCount: lottery.account.realCount,
          round: lottery.account.round,
        },
        publicKey: lottery.publicKey,
      }))
      .sort((a, b) => Number(a.account.id) - Number(b.account.id));
  
    return closedLottery;
  };
  

  const setUserReferral = async (link: string) => {
    let userData = await getUserData();
    if (!userData){
      toast.warning("You should buy ticket for setting referral link",{position:'top-center', autoClose:7000});
    } else {
      if (!wallet.publicKey) return;
      let [userPDA, bump] = PublicKey.findProgramAddressSync([Buffer.from("USER_INFO_SEED"), wallet.publicKey.toBuffer()], PROGRAM_ID);
      const txHash = await program?.methods.setReferral(link)
      .accounts({
        signer: wallet.publicKey,
        user: userPDA
      })
      .rpc()
      .catch((error) => {
        console.log(error,"error in setreferral");
      });

      if (txHash){ 
        toast.success("Success Setting!", {position:'top-center', autoClose:7000})
      }
    }
    
  }


  return (
    <GlobalContext.Provider 
      value={{ 
        getOpenedLottery,
        buyTicket, 
        getUserData, 
        getLotteryData, 
        joinToLottery, 
        getWinnerTicker, 
        getDepositeTicker,
        getHistory,
        setUserReferral
      }}>
      {children}
    </GlobalContext.Provider>
  )
}
