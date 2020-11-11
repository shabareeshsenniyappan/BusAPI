const { details, bookTicket, ticketStatus, open, close, reset } = require('../controllers/APIs');

module.exports = app => {
    app.post('/bookticket', bookTicket);

    app.post("/ticketstatus" , ticketStatus);

    app.post("/details", details);

    app.get("/open", open);

    app.get("/close", close);

    app.get('/reset', reset);

};