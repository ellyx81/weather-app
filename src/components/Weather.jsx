import React, { useState, useEffect, useRef } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import video_1 from '../assets/bg1.mp4';
import video_2 from '../assets/bg2.mp4';
import video_3 from '../assets/bg3.mp4';
import video_4 from '../assets/bg4.mp4';
import video_5 from '../assets/bg5.mp4';

const Weather = () => {
    const [inputValue, setInputValue] = useState("");
    const [weatherData, setWeatherData] = useState(false);
    const [videoBg, setVideoBg] = useState("");
    const videoRef = useRef(null);

    const videoList = [video_1, video_2, video_3, video_4, video_5];

    useEffect(() => {
        const currentIndex = parseInt(localStorage.getItem('videoIndex'), 10) || 0;
        const nextIndex = (currentIndex + 1) % videoList.length;
        localStorage.setItem('videoIndex', nextIndex);
        setVideoBg(videoList[currentIndex]);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [videoBg]);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon
    };

    const search = async (city) => {
        if (city === "") {
            alert("Enter City Name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });
        } catch (error) {
            setWeatherData(false);
            console.error("Error in fetching weather data");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            search(inputValue);
        }
    };

    useEffect(() => {
        search("Manila");
    }, []);

    return (    
        <>
            <div className="weather">
                <div className="search-bar">
                    <input
                        type="text"
                        value={inputValue}
                        placeholder="Enter City Name"
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <img
                        src={search_icon}
                        alt="Search"
                        onClick={() => search(inputValue)}
                    />
                </div>
                {weatherData ? (
                    <>
                        <img src={weatherData.icon} alt="" className="weather-icon" />
                        <p className="temperature">{weatherData.temperature}°c</p>
                        <p className="location">{weatherData.location}</p>
                        <div className="weather-data">
                            <div className="col">
                                <img src={humidity_icon} alt="" />
                                <div>
                                    <p>{weatherData.humidity}%</p>
                                    <span>Humidity</span>
                                </div>
                            </div>
                            <div className="col">
                                <img src={wind_icon} alt="" />
                                <div>
                                    <p>{weatherData.windSpeed} Km/h</p>
                                    <span>Wind Speed</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
            <div className="video-container">
                <video
                    id="video"
                    ref={videoRef}
                    key={videoBg}
                    autoPlay
                    loop
                    muted
                >
                    <source src={videoBg} type="video/mp4" />
                </video>
            </div>
        </>
    );
};

export default Weather;
