import axios from 'axios';

export interface CountryData {
  country_nm: string;
  country_eng_nm: string;
  country_iso_alp2: string;
  alarm_lvl: number;
  // 필요한 다른 속성들 추가
}

const apiKey = import.meta.env.VITE_ALERT_API_KEY;
const COUNTRY_URL = `http://apis.data.go.kr/1262000/TravelAlarmService2/getTravelAlarmList2?serviceKey=${apiKey}`;

export const fetchData = async () => {
  const numOfRows = 100;
  const maxPageNo = 4;
  let allData:CountryData[] = [];
  
  for (let pageNo = 1; pageNo <= maxPageNo; pageNo++) {

    const response = await axios.get(`${COUNTRY_URL}&numOfRows=${numOfRows}&pageNo=${pageNo}`);
    const pageData = response.data;
    if (pageData && pageData.data) {
      allData = allData.concat(pageData.data);
    }
  }
    // console.log(allData);
    return allData;
};

