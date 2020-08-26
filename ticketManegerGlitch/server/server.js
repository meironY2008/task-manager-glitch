const express = require('express');
const fs = require('fs').promises;


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const path ='./data.json';

function checkHttps(request, response, next) {
    // Check the protocol — if http, redirect to https.
    if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
      return next();
    } else {
      response.redirect("https://" + request.hostname + request.url);
    }
  }
  
  app.all("*", checkHttps)


app.get('/api/tickets/', async (req, res) => {
  const ticketJson = await fs.readFile('./data.json');
  const ticketArray = JSON.parse(ticketJson);
  const { searchText } = req.query;
  if (searchText) {
    const filterTickectsArray = ticketArray.filter((ticket) => (
      ticket.title.toLowerCase().includes(searchText.toLowerCase())));
    res.send(filterTickectsArray);
  } else {
    res.send(ticketArray);
  }
});

app.post('/api/tickets/:ticketId/done', async (req, res) => {
  let ticketJson = await fs.readFile('./data.json');
  const ticketsArray = JSON.parse(ticketJson);
  const doneTicketIndex = ticketsArray.findIndex((ticket) => ticket.id === req.params.ticketId);
  if (doneTicketIndex >= 0) {
    ticketsArray[doneTicketIndex].done = true;
    ticketJson = JSON.stringify(ticketsArray, null, 2);
    await fs.writeFile('./data.json', ticketJson);
    res.send(ticketsArray[doneTicketIndex]);
  } else {
    res.send('No Matching Ticket Id... :(');
  }
});

app.post('/api/tickets/:ticketId/undone', async (req, res) => {
  let ticketJson = await fs.readFile('./data.json');
  const ticketsArray = JSON.parse(ticketJson);
  const doneTicketIndex = ticketsArray.findIndex((ticket) => ticket.id === req.params.ticketId);
  if (doneTicketIndex >= 0) {
    ticketsArray[doneTicketIndex].done = false;
    ticketJson = JSON.stringify(ticketsArray, null, 2);
    await fs.writeFile('./data.json', ticketJson);
    res.send(ticketsArray[doneTicketIndex]);
  } else {
    res.send('No Matching Ticket Id... :(');
  }
});

let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});

module.exports = app;
