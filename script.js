const weatherApp = {
    apiKey: "a4e31338010bbf602c56781bcc64f62a",
    apiUrl: "https://api.openweathermap.org/data/2.5/",
    locationInput: $("#location-input"),
    currentWeather: $("#current-weather"),
    forecastTable: $("#forecast-table tbody"),
    searchHistory: $("#search-history"),
    weatherForm: $("#weather-form")
  };
  
  weatherApp.weatherForm.submit(function(event) {
    event.preventDefault();
    const city = weatherApp.locationInput.val();
    if (city) {
      getCurrentWeather(city);
      getForecast(city);
    }
  });
  
  weatherApp.searchHistory.on("click", "a", function(event) {
    event.preventDefault();
    const city = $(this).text();
    getCurrentWeather(city);
    getForecast(city);
  });
  
  function getCurrentWeather(city) {
    $.getJSON(weatherApp.apiUrl + "weather?q=" + city + "&units=imperial&appid=" + weatherApp.apiKey, function(data) {
      const cityName = data.name;
      const date = new Date(data.dt * 1000).toDateString();
      const icon = data.weather[0].icon;
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
  
      updateSearchHistory(cityName);
  
      weatherApp.currentWeather.html(`
        <h2>${cityName}</h2>
        <h3>${date}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
        <p>Temperature: ${temperature}°F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed}mph</p>
        `);
      });
    }
    
    function getForecast(city) {
      weatherApp.forecastTable.empty();
    
      $.getJSON(weatherApp.apiUrl + "forecast?q=" + city + "&units=imperial&appid=" + weatherApp.apiKey, function(data) {
        const forecastData = data.list;
    
        let currentDate;
        $.each(forecastData, function(index, item) {
          const date = new Date(item.dt * 1000).toDateString();
          if (date !== currentDate) {
            currentDate = date;
            const icon = item.weather[0].icon;
            const temperature = item.main.temp;
            const humidity = item.main.humidity;
            const windSpeed = item.wind.speed;
    
            weatherApp.forecastTable.append(`
              <tr>
                <td>${date}</td>
                <td>${temperature}°F</td>
                <td>${windSpeed}mph</td>
                <td>${humidity}%</td>
                <td><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon"></td>
              </tr>
            `);
          }
        });
    
        // Generate chart data from forecast data
        const chartLabels = [];
        const chartData = [];
        for (let i = 0; i < forecastData.length; i++) {
          chartLabels.push(new Date(forecastData[i].dt * 1000).toDateString());
          chartData.push(forecastData[i].main.temp);
        }
    
        // Draw chart
        const ctx = $("#forecast-chart");
        const chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: chartLabels,
            datasets: [
              {
                label: "Temperature (°F)",
                data: chartData,            
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });
      });
    }
    
    function updateSearchHistory(city) {
      weatherApp.searchHistory.append(`
        <a href="#" class="list-group-item list-group-item-action">${city}</a>
      `);
    }
    
    
  