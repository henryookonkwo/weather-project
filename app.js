const express = require("express");
const { Http2ServerResponse } = require("http2");
const https = require("https");
const app = express();
const port = 3000;

//Necessary code to allow us to parse through the body of the data receieved
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req,res) => {
    
    res.sendFile(__dirname + "/index.html");
    // res.send("Server is up and running.")
});

app.post("/", (req,res) =>{
    console.log(req.body.cityName);
    // res.send("Post request received");



    const query = req.body.cityName;
    const apiKey = "3140f42e5dc1811a954f66407dc7d13a";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey +"&units=" + unit;
    
    //Use HTTPS to get data
    https.get(url,(response) =>{
        console.log(response.statusCode);


        //Getting the real data from openweathermap
        response.on("data", (data) => {
            console.log(data); // Shows data in Hexadecimal 
            const weatherData = JSON.parse(data); //Parse data through JSON.parse to make it a Javascript object
            console.log(weatherData);

            const temp = weatherData.main.temp;
            const feelsLike = weatherData.main.feels_like;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            console.log(temp);
            console.log(feelsLike);
            console.log(description);

            //SInce we can have multiple res.write and only one res.send
            res.write("<p> The weather is currently "+ description +". </p>");
            res.write("<h1>The temperature in "+ query +" is "+ temp +" degree celcius </h1>");
            res.write("<img src=" + imageURL + ">");
            res.send();
            // const object = {
            //     name: "Henry",
            //     favouriteFood: "Rice"
            // }

            // console.log(JSON.stringify(object));


        })
    } )

});





app.listen(port, () => {
    console.log("Server is running on port " + port);
});