require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls
app.get("/image", async (req, res) => {
    console.dir(req.query);
    const curr_date = req.query.curr_date;
    const rover = req.query.rover;
    try {
        let data = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${curr_date}&api_key=${process.env.API_KEY}&sol=2000`
        ).then((res) => res.json());
        res.send({ data });
    } catch (err) {
        res.status(400).json({
            message: "There was an error!",
        });
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
