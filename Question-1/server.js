const express = require('express')
const axios = require('axios')

const app = express();

app.listen(4444, ()=>{
    console.log("Server Running on port (${http://http://localhost:4444})....");
});
const access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODg1NDE0NDksImNvbXBhbnlOYW1lIjoiTXkgVHJhaW4gQVBJIiwiY2xpZW50SUQiOiIwNjE2ZGYxNy05NGI2LTQ3N2YtOTkyMi1mOGRhZWE4NzJhYjUiLCJvd25lck5hbWUiOiIiLCJvd25lckVtYWlsIjoiIiwicm9sbE5vIjoiMjBCQUQwMDQifQ._NA-aZlMt6KvWNOm-pKHz8C3R7tO6abeQDwb5bLc7j4'; 
const headers = {
  Authorization: `Bearer ${access_token}`,
};

app.get('/', async (req, res) => {
    try {
      const trains = await getTrainSchedules();
      const filteredTrains = filterTrains(trains);
      const sortedTrains = sortTrains(filteredTrains);
      const trainDisp = DisplayTrains(sortedTrains);
      res.send(trainDisp);
      //res.send(trains);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  });
async function getTrainSchedules() {
    const url = 'http://104.211.219.98/train/trains';
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data;
}

function filterTrains(trains) {
    const currentTime = new Date();
    const allowedTimeWindow = 30 * 60 * 1000;
  
    return trains.filter((train) => {
      const departureTime = new Date();
      departureTime.setHours(train.departureTime.Hours);
      departureTime.setMinutes(train.departureTime.Minutes);
      departureTime.setSeconds(train.departureTime.Seconds);
      const timeDifference = departureTime.getTime() - currentTime.getTime();
  
      return timeDifference > allowedTimeWindow;
    });
  }
  
function sortTrains(trains) {
    return trains.sort((a, b) => {
      const priceA = a.price.sleeper;
      const priceB = b.price.sleeper;
      if (priceA !== priceB) {
        return priceA - priceB;
      }
  
      const ticketsA = a.seatsAvailable.sleeper;
      const ticketsB = b.seatsAvailable.sleeper;
      if (ticketsA !== ticketsB) {
        return ticketsB - ticketsA;
      }
  
      const departureTimeA = a.departureTime;
      const departureTimeB = b.departureTime;
      const delayA = a.delayedBy || 0;
      const delayB = b.delayedBy || 0;
  
      const timeA = new Date();
      timeA.setHours(departureTimeA.Hours);
      timeA.setMinutes(departureTimeA.Minutes);
      timeA.setSeconds(departureTimeA.Seconds);
      timeA.setMilliseconds(delayA * 1000);
  
      const timeB = new Date();
      timeB.setHours(departureTimeB.Hours);
      timeB.setMinutes(departureTimeB.Minutes);
      timeB.setSeconds(departureTimeB.Seconds);
      timeB.setMilliseconds(delayB * 1000);
  
      return timeB - timeA;
    });
  }

  function DisplayTrains(trains) {
    let detail = '<body><center><h1>List of Trains</h1></center><ul>';
    for (const train of trains) {
      const ntrain = `
        <li>
          <h3>${train.trainName}</h3>
          <p>Train Number: ${train.trainNumber}</p>
          <p>Departure Time: ${train.departureTime.Hours}:${train.departureTime.Minutes}:${train.departureTime.Seconds}</p>
          <p>Seats Available: Sleeper (${train.seatsAvailable.sleeper}), AC (${train.seatsAvailable.AC})</p>
          <p>Price: Sleeper (${train.price.sleeper}), AC (${train.price.AC})</p>
          <p>Delayed By: ${train.delayedBy || 0} seconds</p>
        </li>
      `;
  
      detail += ntrain;
    }
    detail += '</ul></body>';
    return detail;
  }