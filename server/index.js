const express = require('express');
const app = express();
const sequelize = require('./db');
const dotenv = require("dotenv");
const cors = require("cors");
const checkAuthorization = require('./middleware/checkAuthorization');
dotenv.config();

const corsOpts = {
  origin: '*',
};
app.use(cors(corsOpts));
/* middleware use */
app.use(checkAuthorization);
/* middleware use */

/* routes */
app.use(express.json({ limit: '2mb' }));

/* direct front end app link */
/* app.use(express.static('client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
}); */
/* direct front end app link */

app.get("/", function (req, res) {
    res.send("your IP is: " + req.ip);
});
app.use('/api', require('./routes/login'));
app.use('/api', require('./routes/home'));
app.use('/api', require('./routes/profile'));

const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server has started at port " + PORT))