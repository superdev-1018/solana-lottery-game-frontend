// import { Connection, PublicKey, Keypair, Transaction, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from '@solana/web3.js';
// import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, mintTo} from '@solana/spl-token';
// import { Wallet } from '@coral-xyz/anchor';
// import { useWallet } from '@solana/wallet-adapter-react';

// export const createAssociatedToken = async (connection:Connection, wallet:any, mintPubKey: PublicKey) => {
//     // const { publicKey, sendTransaction} = useWallet();
//     if (!wallet.publicKey){
//         console.error("Wallet is not connected");
//         return;
//     }
//     try {

//         const associatedTokenAddress = await getOrCreateAssociatedTokenAccount(
//             connection,
//             wallet,
//             mintPubKey,
//             wallet.publicKey,
//             false,
//             TOKEN_PROGRAM_ID,
//             ASSOCIATED_TOKEN_PROGRAM_ID
//         );
//         console.log(associatedTokenAddress,"*****")
//         const accountInfo = await connection.getAccountInfo(associatedTokenAddress.address);

//         if(accountInfo) {
//             console.log("Associated Token Account already Exist.", associatedTokenAddress.address.toBase58());
//             return associatedTokenAddress;
//         }

//         const transaction = new Transaction().add(
//             createAssociatedTokenAccountInstruction(
//                 wallet.publicKey,
//                 associatedTokenAddress.address,
//                 wallet.publicKey,
//                 mintPubKey,
//                 TOKEN_PROGRAM_ID,
//             )
//         );

//         try {
//             const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);
//             console.log("Transaction successful with signature:", signature);
//         } catch (e){
//             console.error("Error creating associated token account:", e);
//         }

//         return associatedTokenAddress;

//     } catch (e) {
//         console.log("Error:", e);
//     }

// }