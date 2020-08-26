import React, { useState } from 'react';

function Ticket({ ticket, handleClick }) {
  const [showMoreFlag, setShowMoreFlag] = useState(false);

  const showFullDate = (ms) => {
    const createdAt = new Date(ms);
    return `${createdAt.getDate()}/${
      createdAt.getMonth() + 1
    }/${createdAt.getFullYear()} 
        ${createdAt.getHours()}:${createdAt.getMinutes()}:${createdAt.getSeconds()}`;
  };

  const showLabel = (tickets) => tickets.labels.map((label) => (
    <div className="label" key={label}>
      {label}
    </div>
  ));

  const showMore = () => {
    setShowMoreFlag(!showMoreFlag);
  };

  return (
    <div className="ticket">
      <div className="ticket-top">
        <h2>{ticket.title}</h2>
        <div className="hideTicketButton" onClick={() => handleClick(ticket.id)}>
          HIDE
        </div>
      </div>

      {showMoreFlag ? (
        <div className="content">
          {ticket.content}
          <div className="show-more" onClick={() => showMore()}>
            show less
          </div>
          {' '}
        </div>
      ) : (
        <div className="content">
          <div>
            {' '}
            {ticket.content.substring(0, 100)}
            {' '}
          </div>
          {' '}
          <div className="show-more" onClick={() => showMore()}>
            show more...
          </div>
        </div>
      )}
      <div className="ticket-bottom">
        <div className="writer-details">
          {showFullDate(ticket.creationTime)}
          {' '}
          |
          {' '}
          {ticket.userEmail}
        </div>
        <div className="label-container">
          {ticket.labels && showLabel(ticket)}
        </div>
      </div>
    </div>
  );
}

export default Ticket;
