import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Ticket from './components/Ticket';
import './App.css';
import maskEmojy from './maskEmojy.png';

function App() {
  const [ticketsShown, setTicketsShown] = useState([]);

  const hideTicketByClick = (ticketId) => {
    const hideArray = ticketsShown.map((ticket) => {
      if (ticket.id === ticketId) {
        return { ...ticket, hide: true };
      }
      return ticket;
    });
    setTicketsShown(hideArray);
  };

  const showTickets = (ticketsArr) => {
    const newArr = ticketsArr.map((ticket) => (
      <Ticket
        key={ticket.id}
        ticket={ticket}
        handleClick={hideTicketByClick}
      />
    ));
    return newArr;
  };

  const visualTickets = ticketsShown.filter((ticket) => !ticket.hide);
  const hidedenTicketsCounter = ticketsShown.length - visualTickets.length;

  const showTicketsFromServer = async () => {
    const ticketsArray = await (await axios.get('/api/tickets')).data;
    setTicketsShown(ticketsArray);
  };

  const showTicketByTitle = async (title) => {
    const searchTicketsArray = await (await axios.get(`/api/tickets?searchText=${title}`)).data;
    setTicketsShown(searchTicketsArray);
  };

  const restoreHiddenTickets = () => {
    const restorArray = ticketsShown.map((ticket) => ({ ...ticket, hide: false }));
    setTicketsShown(restorArray);
  };

  useEffect(() => {
    showTicketsFromServer();
  }, []);

  return (
    <main>
      <div id="app-top">
        <div id="top-left">
          <img id="mask-image" src={maskEmojy} alt="mask emojy" />
          <h1>task maneger</h1>
        </div>
        <a
          id="link"
          href="https://github.com/meironY2008"
          target="_blank"
          rel="noopener noreferrer"
        >
          @meironY2008/github
        </a>
      </div>
      <div id="header">
        <input type="search" id="searchInput" placeholder="search" onChange={(e) => showTicketByTitle(e.target.value)} />
        <section id="hidden-section">
          <div id="hideTicketsCounter">{hidedenTicketsCounter}</div>
          {hidedenTicketsCounter ? <div>Hidden tickets:</div> : <div />}
          <div id="restoreHideTickets" onClick={() => restoreHiddenTickets()}>Restore</div>
        </section>
      </div>
      <section id="ticket-section">
        {showTickets(visualTickets)}
      </section>

    </main>
  );
}

export default App;
