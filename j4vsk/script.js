// Real-time Clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // Date formatting
    const days = ['Svētdiena', 'Pirmdiena', 'Otrdiena', 'Trešdiena', 'Ceturtdiena', 'Piektdiena', 'Sestdiena'];
    const months = ['Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'];
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    document.getElementById('time').textContent = `${hours}:${minutes}`;
    document.getElementById('date').textContent = `${day}. ${month}, ${year}`;
}

setInterval(updateClock, 1000);
updateClock();

// Weather Fetching (Temperature with 1 Decimal)
async function fetchWeather() {
    try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Jelgava,lv&units=metric&appid=2b967cafa31b2b0a35abc83ee14680b1');
        const data = await response.json();
        const temperature = data.main.temp.toFixed(1);  // Display 1 decimal place
        document.getElementById('weather-data').textContent = `${temperature}°C`;
    } catch (error) {
        document.getElementById('weather-data').textContent = 'Weather data unavailable';
    }
}

fetchWeather();
