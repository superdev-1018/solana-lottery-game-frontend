import {
  Program,
  AnchorProvider
} from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { ADMIN_KEY, ADMIN_KEYPAIR, PROGRAM_ID, tokenOwner } from './constants';
import { IDL, Lottery } from './idl';

export const getProgram = (connection: Connection, wallet: any): Program<Lottery> => {
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  const program = new Program<Lottery>(IDL, PROGRAM_ID, provider);
  return program;
};

export const getPDA = (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey
): PublicKey => {
  const [pdaKey] = PublicKey.findProgramAddressSync(seeds, programId);
  return pdaKey;
};

// Define the PDAs
export const globalAccountPDA = getPDA([Buffer.from('GLOBAL_SETTING_SEED'), ADMIN_KEY.toBuffer()], PROGRAM_ID);




