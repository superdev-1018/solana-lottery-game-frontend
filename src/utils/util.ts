import axios from 'axios';

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
        const res = await axios.post(`http://localhost:5005/get_current_time`, { timeFrame });
        return res.data.rest_time;
      } catch (error) {
        console.log(error);
        return 5000;
      }
  }