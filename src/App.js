import React, {useState, useEffect} from 'react';
import FullCalendar from '@fullcalendar/react';
import daygrid from '@fullcalendar/daygrid';
import interaction from '@fullcalendar/interaction';

const App = () =>{
  const [meetups, setMeetups]  = useState([]);

  const isEmpty = (obj) =>{
    return Object.keys(obj).length === 0;
  }

  useEffect(() =>{
    fetch('/wp-json/wp/v2/posts') //Using API Proxy for abstraction using Devserver module of Webpack
      .then(res => {
        console.log(res.headers.get('x-wp-totalpages'));
        return res.json();
      })
      .then(json =>{
        setMeetups(json.map(meeting => {
          return{
            title: renderSpecialChars(json[0].title.rendered),
            url: meeting.link,
            start: meeting.date,
            end: meeting.date
          }
        }))
      })
  }, [])


  const handleClick = event =>{
    console.log(event);
  }

  const renderSpecialChars = (str) =>{
    const elem = document.createElement('h1');
    elem.innerHTML = str;
    return elem.innerHTML;
  }

  const navigateToEvent = info =>{
    info.jsEvent.preventDefault();
    window.open(info.event.url);
  }
  return(
    <div>
      {
        isEmpty(meetups) ? <></>
        :<FullCalendar
        plugins = {[daygrid, interaction]}
        dateClick = {handleClick}
        events = {meetups}
        eventClick = {navigateToEvent}
        />
      }
    </div>
  )
}

export default App;
