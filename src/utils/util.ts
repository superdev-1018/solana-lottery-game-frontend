import axios from 'axios';
import { ServerUrl } from '@/anchor/constants';
import { io } from "socket.io-client";
import { SocketUrl } from '@/anchor/constants';

export const socket = io(SocketUrl);

export const formatTime = (hours: number): string => {
    if (hours ==1 ) {
      return `HOURLY`;
    } else if (hours != 1 && hours < 24) {
      return `${hours}-HOURLY`;
    } else if (hours == 24) {
      return `DAILY`;
    } else if (hours == 168) {
      return `WEEKLY`;
    } else if (hours == 720) {
      return `MONTHLY`;
    } else if (hours == 2160) {
      return `QUARTERLY`;
    } else if (hours == 4320) {
      return `HALF-YEARLY`;
    } else if (hours == 8640) {
      return `ANNUALLY`;
    }else {
      const years = Math.floor(hours / 8760);
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    }
  };

  export const getServerTime = async (timeFrame:number) => {
      try {
        const res = await axios.post(`${ServerUrl}/get_current_time`, { timeFrame });
        return res.data.rest_time;
      } catch (error) {
        console.log(error);
        return 5000;
      }
  }

  export const formatDate = (timestamp:number) => {
    const date = new Date(Number(timestamp));
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = date.getUTCDate();
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0'); 
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    const getOrdinalSuffix = (day:any) => {
        const suffixes = ["th", "st", "nd", "rd"];
        const value = day % 100;
        return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
    };
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year} ${hours}:${minutes} GMT`;
}