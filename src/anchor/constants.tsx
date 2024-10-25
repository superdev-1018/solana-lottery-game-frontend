import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from 'bs58';
export const RPC_ENDPOINT = "https://api.devnet.solana.com";
export const PROGRAM_ID = new PublicKey("57KXktzp1TaWRYq1k2Qx41rSwRcHQDKpLnxxEYmwv9JX");
export const ADMIN_KEY = new PublicKey("85Rm7Up3AfqiSZVrugBaPxwuTaijUFxPCzpd8JScGibr");
export const ADMIN_KEYPAIR = Keypair.fromSecretKey(bs58.decode("4ugXSRFqMvHRnapAirCPkSGrNbqokLNAzLe9ARNhNSMV8Cei9UxL5StRB3sDrPPmxdurqVkWvMERrz2XxApFB5GC"));
export const USDT_MINT_ADDRESS = new PublicKey("HYrpV9vBvTzYRMoGfBkzjsxNQcJjWLqNUKwf5C7oy8uf");
export const POOL_KEYPAIR = Keypair.fromSecretKey(bs58.decode("4ugXSRFqMvHRnapAirCPkSGrNbqokLNAzLe9ARNhNSMV8Cei9UxL5StRB3sDrPPmxdurqVkWvMERrz2XxApFB5GC"));
export const TAX_KEYPAIR = Keypair.fromSecretKey(bs58.decode("3qCAbFbjxELZWBrGSFHjYnSq38CeqqKymLXuBS7qfUypkq4QzxXdb4cRp7PtFJjbfcKDRkBxUuAfqbbC4MVrKpnK"));

export const tokenOwner = Keypair.fromSecretKey(bs58.decode("3oN8nVDmFRxxKMhkt1D3JvF5oQBcLDPKaw7CV1RpWCpwmJUGTkqbEUhxi3vNH2AeoXxgeWnGHmeV6uGZPBfL6GVK"));

export const TimeFrame = [1,3,6,12,24,168,720,2160,4320,8640];
export const TicketPrice = [1,2,3,4,5,6,7,8,9,10];
export const MaxTickets = [56,56,56,56,56,56,56,56,56,56];
export const DevFee = [10,9,8,7,6,5,4,3,2,1];

export const ServerUrl = "http://localhost:5000";
export const SiteUrl = "http://localhost:8000";
export const SocketUrl = "http://localhost:4000";
