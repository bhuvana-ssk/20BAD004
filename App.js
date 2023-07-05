import React, { useState } from 'react';
import Axios from 'axios';
const App = () => {
  const [trains, setTrains] = useState('All');

  const access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODg1NDI3NzgsImNvbXBhbnlOYW1lIjoiTXkgVHJhaW4gQVBJIiwiY2xpZW50SUQiOiIwNjE2ZGYxNy05NGI2LTQ3N2YtOTkyMi1mOGRhZWE4NzJhYjUiLCJvd25lck5hbWUiOiIiLCJvd25lckVtYWlsIjoiIiwicm9sbE5vIjoiMjBCQUQwMDQifQ.gK21QYR151K2TAc7OIDEgJm6ToprJunDfzYOcN41zaU'; 
  const headers = {
  Authorization: `Bearer ${access_token}`,
};
try {
  const url = 'http://104.211.219.98/train/trains';
  const response =  Axios.get(url, { headers });
  console.log(response.data);
  setTrains([...trains,response.data]);
}
catch(err){
  alert("Server Error!");
}
  return (
    <div style={{backgroundColor:'orchid', height:'100%'}}>
      <center>
      <h1>Train Schedule</h1>
      </center>
      {trains.map((i) => (
          <p>{i}</p>))}
    </div>
      )
};
export default App;