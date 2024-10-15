interface LotteryData {
    account: LotteryCtx
    publicKey: PublicKey
  }
  
interface LotteryCtx {
    id: number;                           
    timeFrame: BN;                       
    ticketPrice: number;             
    maxTicket: BN;              
    devFee: number;                 
    startTime: BN;              
    endTime: BN;          
    state: number;      
    participants: string[];      
    winner: PublicKey[];             
    prizePercent: number[];         
    winnerPrize: BN[];         
    realPoolAmount: BN;            
    realCount: number;          
    round: number;  
}

interface GameCardProp {
    // lottery: LotteryCtx;
    lottery: string
    source: any
}