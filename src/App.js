import React, {useState, useEffect} from 'react';
import FullCalendar from '@fullcalendar/react';
import daygrid from '@fullcalendar/daygrid';
import interaction from '@fullcalendar/interaction';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

const App = () =>{
  const [meetups, setMeetups]  = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const isEmpty = (obj) =>{
    return Boolean(Object.keys(obj).length);
  }


  const renderSpecialChars = (str) =>{
    const elem = document.createElement('h1');
    elem.innerHTML = str;
    return elem.innerHTML;
  }

  const transformMeeting = (meeting) =>{
    return{
      title: renderSpecialChars(meeting.title.rendered),
      start: meeting.date,
      url: meeting.link
    }
  }

  const getMeetings = async (json, totalPages) =>{
    let meetings = [];
    meetings.push(...json.map(meeting =>{
      return transformMeeting(meeting);
    }))
    for(let page = 2; page<totalPages; page++){
      const res = await fetch(`/wp-json/wp/v2/posts?page=${page}`);
      const json = await res.json();
      meetings.push(...json.map(meeting =>{
        return transformMeeting(meeting);
      }))
    }
    return meetings;
  }

  useEffect(() =>{
    const fetchData = async () =>{
      const res = await fetch('/wp-json/wp/v2/posts');
      const json = await res.json() ;
      const totalPages = res.headers.get('x-wp-totalpages');
      const meetings = await getMeetings(json, totalPages);
      setMeetups(meetings);
    }
    fetchData();
  }, [])

  const navigateToEvent = info =>{
    info.jsEvent.preventDefault();
    window.open(info.event.url);
  }
  return(
    <div>
      {
        meetups.length ?
        <FullCalendar
        plugins = {[daygrid, interaction]}
        events = {meetups}
        eventClick = {navigateToEvent}
        />
        :
          <Loader type="Oval" color="#00BFFF" height={80} width={80} />
      }

    </div>
  )
}

export default App;
