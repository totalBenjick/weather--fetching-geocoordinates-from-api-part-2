import React, { Component } from 'react';
import './App.css';
import request from "superagent";
import About from "./components/About"
import Home from "./components/Home"
import Terms from "./components/Terms"

class App extends Component {
  constructor(props){
  super()
    this.state={
      show:false,
      
      cities:[{id:1,
        name:"Canada",
      }
      ],
      timezone: "Timezone",
      summary: "Summary",
      time:"Date and Time",
      humidity: "Humidity",
      pressure: "Pressure",
      temperature: "Temperature",
      wind:"Wind Speed",
      weekly:[],

      timeBol:false,
    }
  }

  showInput = () =>{
    this.setState({
    show:true
    })
  }



  fetchWeather = (response)=> {

    const coords = response.body.results[0].geometry.location;
    const ENDPOINT2 = `https://api.darksky.net/forecast/d3ba8877bc3c07357140117763939bf8/${coords.lat},${coords.lng}`

    request
      .get(ENDPOINT2)
      .then (response =>{
      console.log(response.body.daily.data)
       
    
        this.setState({
          timezone:response.body.timezone,
          summary :response.body.currently.summary,
          time: response.body.currently.time,
          humidity: response.body.currently.humidity,
          pressure:response.body.currently.pressure,
          temperature: response.body.currently.temperature,
          wind: response.body.currently.windSpeed,
          weekly: response.body.daily.data,
          timeBol:true,

        });

      });
  }

  fetchLocation= (e) => {
    e.preventDefault();
    let country =e.target.textContent;
    let ENDPOINT =  `https://maps.googleapis.com/maps/api/geocode/json?address=${country}` ;
    
    this    
      .getCoords(ENDPOINT)
      .then(this.fetchWeather)
      .catch( error =>{
        console.log(error);

        this.setState({
          summary:"Sorry, I didn't find that City, please check your spelling or try again",
          timezone: "Not found"

        })
      })
  }

    /*ALGO DEBE DARLE AL ENTER UNA SUBIDA DE INFORMACION, CUANDO ESO PASE*/

  upInfo = (e) =>{
    e.preventDefault();
    if (e.keyCode ===13) { //cambiar a constante 
      this.setState({
         show : false,
        cities:[
          ...this.state.cities,
          {
            id: this.state.cities.length + 1 ,
            name: e.target.value,
          }
        ]
       
      });
      //CLEAN
      e.target.value=""
    }
  }

  getCoords = (ENDPOINT) => {
    return request.get(ENDPOINT);

  }

  renderIcon = () => 
  { return <img  id="imagen" src="https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/cloudy-day-1.svg" alt=""/>
}

  // fake authentication Promise
  authenticate(){
    return new Promise(resolve => setTimeout(resolve, 2000))
}
  componentDidMount(){
    this.authenticate().then(() => {
      const ele = document.getElementById('ipl-progress-indicator')
      if(ele){
        // fade out
        ele.classList.add('available')
        setTimeout(() => {
          // remove from DOM
          ele.outerHTML = ''
        }, 2000)
      }
    })
}

  render() {

    return (
      <div className='app'>
        <header className='app__header'>
          <button className='app__add' onClick={ this.showInput}>
              <i className="fa fa-plus-circle" aria-hidden="true"> New City / New Country</i>
          </button>
        </header>
        <div className='grid'>
          <aside className='app__aside'>
            <h1 className='app__title'>All countries</h1>
            {
              this.state.cities.map(city => {
                return <a 
                onClick={this.fetchLocation} 
                key={city.id} 
                href="#" 
                className="app__country"> 
                {city.name}
                </a>
              })}

            {this.state.show && <input onKeyUp={this.upInfo} autoFocus type='text' 
            placeholder='Location' className='app__input' />}
            
          </aside>
          <div className="main__holedisplay">
            <div className="main__display">
              <h3> {this.state.timezone}</h3>
              <p> {this.state.summary} </p>
              <h2> { this.state.timeBol ? (Date(this.state.time)) : ""} </h2>
              <p>  { this.state.timeBol ?  "7 day forecast" : "" } </p>
              

          </div>
          <div className="cuadro__clima">
          

          {this.state.weekly.map(day =>{
            return (
            <div className="cuadrito__clima" id={this.state.weekly.length + 1}>
              <div id="imagen">
               
               {this.renderIcon()}
               
              </div>
              
              <p> Set {   new Date(day.sunriseTime *1000).toLocaleString()} </p>
              <p> Dawn { new Date(day.sunriseTime *1000).toLocaleString()} </p>
              <p> {day.pressure} hpa </p>
              <p> {day.windSpeed} m/s </p> 
            </div>
              );
          })}

          
          </div>
            

{/*              <div className = "main__subdisplay">
                <p className="object__weather"> {this.state.timeBol ?  ("Humidity: "  + this.state.humidity) : ""} </p>
                <p className="object__weather"> {this.state.timeBol ? ("Pressure: " + this.state.pressure) : ""} </p>
                <p className="object__weather"> {this.state.timeBol ? ("Temperature: " + this.state.temperature) : ""} </p>
                <p className="object__weather"> {this.state.timeBol ? ("Wind: " + this.state.wind) : ""} </p>
              </div>*/}
            <div>
               <table className="tabla">
               <tbody>
                  <tr>
                    <th></th>
                    <th> { this.state.timeBol ? (new Date(this.state.time*1000).toLocaleString()) : ""}</th>                
                  </tr>
                  <tr>
                    <td>  {this.state.timeBol ? ("05:00 ") : ""}</td>
                    <td> {this.state.timeBol ? ("Temperature: " + this.state.temperature +"°F, ") : ""}  </td>       
                    <td> {this.state.timeBol ? ("Wind: " + this.state.wind +"m/s, ") : ""} </td>
                    <td>  {this.state.timeBol ? ("Pressure: " + this.state.pressure +"hPa, ") : ""} </td>
                  </tr>
              </tbody>
        
              </table> 
            </div>
          </div> 
        </div>

      </div>
    );
  }
}

export default App;
