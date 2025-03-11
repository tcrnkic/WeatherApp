import { useState, useEffect, useRef} from "react"


const api={
  key: "398b69060c59d8a342e3b3a636cd2edc",
  base: "https://api.openweathermap.org/data/2.5/",
}

function App() {
 const [search, setSearch]= useState("");
 const [weather, setWeather]= useState({});
 const [pollution, setPollution] = useState({});
 const [found, setFound] = useState(true);

 const [city, setCity] = useState("");
 const [currentTemp, setCurrentTemp] = useState();
const [weatherState, setWeatherState] = useState("");
const [description, setDescription] = useState("");
const [wind, setWind] = useState();
const [imgUrl, setImgUrl] = useState("");
const [rise, setRise] = useState();
const [set, setSet] = useState();
const [aqi, setAQI] = useState("");

const imgRef = useRef(null);


const searchPress = async () => {
  try {
    const weatherResponse = await fetch(
      `${api.base}weather?q=${search}&units=metric&APPID=${api.key}`
    );
    const weatherResult = await weatherResponse.json();

    if (weatherResult.cod === 200) {
    
      setWeather(weatherResult);
      console.log(weatherResult);
      // Call the function to fetch air pollution data
      fetchAirPollutionData(weatherResult.coord.lat, weatherResult.coord.lon);
    } else {
      setFound(false);
    }
  } catch (error) {
    setFound(false);
  }
};
const fetchAirPollutionData = async (lat, lon) => {
  try {
    const pollutionResponse = await fetch(
      `${api.base}air_pollution?lat=${lat}&lon=${lon}&APPID=${api.key}`
    );
    const pollutionResult = await pollutionResponse.json();
    setPollution(pollutionResult);
    console.log(pollutionResult);
    setFound(true);
  } catch (error) {
    // Handle error if air pollution data fetch fails
    console.error("Error fetching air pollution data", error);
    setFound(false);

  }
};

  useEffect(()=>{



    if (Object.keys(weather).length > 0) {
    setCity(weather.name);
    setCurrentTemp(Math.ceil(weather.main.temp));
    setWeatherState(weather.weather[0].main);
    setDescription(weather.weather[0].description);
    setWind(Math.ceil(weather.wind.speed * 3.6));
    if(weather.weather[0].main == "Clouds"){
      setImgUrl("./assets/sunnycloud.svg");
    }else if(weather.weather[0].main == "Clear"){
      setImgUrl("./assets/sun.svg");
    }else if(weather.weather[0].main == "Rain"){
      setImgUrl("./assets/rain.svg");
    }else if(weather.weather[0].main == "Drizzle"){
      setImgUrl("./assets/lightrain.svg");
    }else if(weather.weather[0].main == "Thunderstorm"){
      setImgUrl("./assets/thunder.svg");
    }else if(weather.weather[0].main == "Mist" ||weather.weather[0].main == "Fog"|| weather.weather[0].main == "Haze"||weather.weather[0].main == "Dust"){
      setImgUrl("./assets/fog.svg");
    }
  
    const millisecondsRise = (weather.sys.sunrise + weather.timezone) * 1000;
    const dateRise = new Date(millisecondsRise);
   
    let rhour = dateRise.getHours();
    let rmin = dateRise.getMinutes();
    if (rhour < 10){
      rhour = "0" + rhour ;
    }
    if (rmin < 10){
      rmin = "0" + rmin;
    }
    setRise(rhour+ ":" + rmin);

    const millisecondsSet = (weather.sys.sunset + weather.timezone) * 1000;
    const dateSet = new Date(millisecondsSet);
    
    let shour = dateSet.getHours();
    let smin = dateSet.getMinutes();
    if (shour < 10){
      shour = "0" + shour ;
    }
    if (smin < 10){
      smin = "0" + smin;
    }
   
    setSet(shour+ ":" + smin);
  
 
  }
  }, [weather ]);



  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.src = imgUrl;
    }
  }, [imgUrl]);
  function getAqiWord(aqiIndex) {
    switch (aqiIndex) {
      case 1:
        return "Good";
      case 2:
        return "Fair";
      case 3:
        return "Moderate";
      case 4:
        return "Poor";
      case 5:
        return "Very Poor";
      default:
        return "N/A";
    }
  }
  return (

    <div className="bg-gray-700 w-96 text-center rounded-md mx-auto items-center text-white py-5 mt-5">
      <p className="pb-4">Check the weather!</p>
      <div>
        <input className=" bg-gray-100 mx-3 text-black p-1 rounded-lg"
         type="text" placeholder="Enter city/town..." onChange={(e)=> setSearch(e.target.value)} />
        <button className="bg-blue-500 px-4 py-1 rounded-lg" onClick={searchPress}>Search</button>
      </div>
      <hr className="mt-5 w-[90%] mx-auto" />
      {typeof weather.main !="undefined" ?


       <div>
        { found  &&
        <div className="py-5">
         <p className="text-5xl pb-3">{city} <span className="text-sm">{weather.sys.country}</span> </p>
        <div className="flex pb-3 gap-4 justify-center">
           <p>{weatherState}</p>
            <p>{description}  </p> 
          
        </div>
         <div className="flex justify-center items-center gap-5 py-3">
          <div>
             <p className="text-3xl"> {currentTemp}°C </p>
             <p className="text-xs">Feels like {Math.floor(weather.main.feels_like)}°C </p>
          </div>
           <img ref={imgRef} className="max-w-[100px] max-h-[100px]" src="" alt="Weather Icon" />
         </div>
        <div  className="flex justify-center items-center gap-4 py-1">
           <p>Wind {wind} km/h</p> 
            <img src="./assets/wind.svg" alt="" />
        </div>

          <div className="flex justify-center items-center">
            <div className="w-1/3 mr-4 opacity-90">
              <p>Humidity: <br /> {weather.main.humidity}%</p>
            </div>
            <div>
              <p className="text-sm opacity-90">{rise}</p>
              <p className="text-sm opacity-90">{set}</p>
        
            </div>
              <img src="./assets/sunset.svg" alt="" />
           
          </div>
          <hr className="mt-5 w-[90%] mx-auto py-3" />
          <div className="flex flex-col px-16 text-start justify-center ">
                <p className="py-1 ">Pressure: {weather.main.pressure}/mBar </p>
                <p className="py-1 ">Visibility: {weather.visibility/1000}km</p>
                <p className="py-1 ">AQI: {pollution.list && pollution.list.length > 0 ? pollution.list[0].main.aqi : "N/A"} ({getAqiWord(pollution.list && pollution.list.length > 0 ? pollution.list[0].main.aqi : 0)}) </p>
          </div>
         </div>
        }
       {!found && 
       <p className="py-7">City not found</p>
       }
       </div>
        :  
        <div>
          <div role="status" className="w-60 py-5 mx-auto animate-pulse">
    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
    <span className="sr-only">Loading...</span>
</div>
          <p className="pb-5">Please search for a location</p>
        </div>
    }
    
    </div>

  )
}

export default App
