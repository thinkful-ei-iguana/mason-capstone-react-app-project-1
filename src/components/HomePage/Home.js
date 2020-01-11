import React from 'react';
import './Home.css';
import AuthHelper from '../../services/auth-api-service';
import Logo from '../../Images/signal-tower-large.png'
const moment = require('moment');
let now = moment();

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      alerts: [],
    };
  }
  //gets all the users contact alerts on mount
  componentDidMount() {
    this.getUserAlerts();
  }
  //gets all the users contact alerts and sets state with them
  getUserAlerts = () => {
    AuthHelper.getMyContactAlerts()
      .then(res => res.json())
      .then(alerts => this.setState({ alerts }))
      .catch((error) => {
        this.setState({ error })
      })
  }
  //checks for geolocation availability and gets Latitude and Longitude coordinates
  sendAlert = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  //sends alert info in POST request to /alerts router, then fetches that alert and sets state
  showPosition = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const alert_active = true;
    const alert_time = now.format();
    AuthHelper.addAlert(alert_time, longitude, latitude, alert_active)
      .then(() => {
        this.getUserAlerts();
      })
      .catch((error) => {
        this.setState({ error })
      })
  }
  //renders contact alerts and returns them
  render() {
    const alerts = this.state.alerts.map((alert, idx) => (
      <p key={idx}>
        <span className='bold'>  User: </span>{alert.nick_name}
        <span className='bold'>  Alert Time: </span>{moment(alert.alert_time).format("dddd, MMMM Do YYYY, h:mm:ss a")}
        <span className='bold'>  Longitude: </span>{alert.longitude}
        <span className='bold'>  Latitude: </span>{alert.latitude}
        <span className='bold'>  Safeword: </span>{alert.safeword}
        <span className='bold'>  Emergency: </span>{alert.alert_active ? <span className='redAlert'>"Emergency"</span> : <span className='greenAlert'>"Safe"</span>}
      </p>
    ))
    return (
      <div>
        <img id="Landing-Logo" src={Logo} alt="Live Alert Logo" className="logo" />
        <button className="alertButton" onClick={this.sendAlert}>Send Alert!</button>

        <div className='alertsHome'>
          <h2>User Alerts</h2>
          <div className='userAlerts'>{alerts}</div>

        </div>
      </div >
    )
  }
}
