'use strict'

const chrome = require('selenium-webdriver/chrome');
let webdriver = require('selenium-webdriver');
let https = require("https");

let request = require('request');

// Import DB Connection
require("./config/db");

// require express and bodyParser
const express = require("express");
const bodyParser = require("body-parser");

// create express app
const app = express();

// define port to run express app
const port = process.env.PORT || 5000;

// use bodyParser middleware on express app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // Add endpoint
// app.get('/', (req, res) => {
//     res.send("Webscraping Blaze Double :D");
// });

// Listen to server
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Import API route
let routes = require('./routes/resultadoRoutes'); //importing route
routes(app);

console.log("Rodando web scraping");

(async function blazeBot() {

    let options = new chrome.Options();
    options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);
    let serviceBuilder = new chrome.ServiceBuilder(process.env.CHROME_DRIVER_PATH);

    //Don't forget to add these for heroku
    options.addArguments("--headless");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");


    let driver = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(serviceBuilder)
        .build();

    await driver.get('https://www.smashup.com/player_center/goto_common_game/5928/double')
    await driver.manage().window().maximize()

    await driver.sleep(2000)
    await driver.findElement(webdriver.By.xpath('//*[@id="username"]')).sendKeys(process.env.USER)
    await driver.findElement(webdriver.By.xpath('//*[@id="password"]')).sendKeys(process.env.PASS)
    await driver.findElement(webdriver.By.xpath('//*[@id="login_now_btn"]')).click()

    await driver.sleep(10000)

    let edicaoUltimo;
    let numeroUltimo;

    let lastOne = -1;
    let lastTwo = -1;
    let lastThree = -1;
    let lastFour = -1;
    let lastFive = -1;
    let lastSix = -1;
    let lastSeven = -1;
    let lastEight = -1;
    let lastNine = -1;
    let lastTen = -1;
    let lastEleven = -1;

    let ultimoCache = -1;
    let edicaoCache = -1;

    let array = [];

    while (true) {

        const now = new Date();
        now.setUTCMilliseconds(-3600 * 3 * 1000);

        if (now.toLocaleTimeString('pt-br') > '23:59:50') {
            process.exit(0);
        }

        await driver.sleep(1000)

        edicaoUltimo = await driver.findElement(webdriver.By.xpath('//*[@id="desktop"]/div[2]/div/div[2]/div[1]/div/span[2]')).getText();

        try {
            if (edicaoCache !== edicaoUltimo) {

                await driver.sleep(1000);

                numeroUltimo = await driver.findElement(webdriver.By.xpath('//*[@id="desktop"]/div[2]/div/div[3]/div[2]/div[1]/div[2]/div/div/div[1]/div/div/div')).getText();

                if (numeroUltimo !== '' || numeroUltimo !== -1) {

                    lastEleven = lastTen;
                    lastTen = lastNine;
                    lastNine = lastEight;
                    lastEight = lastSeven;
                    lastSeven = lastSix;
                    lastSix = lastFive;
                    lastFive = lastFour;
                    lastFour = lastThree;
                    lastThree = lastTwo;
                    lastTwo = lastOne;
                    lastOne = numeroUltimo;


                    if (parseInt(lastEleven) === 0) {
                        console.log("ZERO no terceiro");

                        request({
                            url: `http://localhost:${port}`,
                            method: "POST",
                            json: true,   // <--Very important!!!
                            body: {
                                "day": now.toLocaleDateString('pt-br').slice(0, 5),
                                "time": now.toLocaleTimeString('pt-br').slice(0, 5),
                                "result": [lastEleven, lastTen, lastNine, lastEight, lastSeven, lastSix, lastFive, lastFour, lastThree, lastTwo, lastOne]
                            }
                        }, function (error, response, body) {
                            console.log("Adicionando", [lastEleven, lastTen, lastNine, lastEight, lastSeven, lastSix, lastFive, lastFour, lastThree, lastTwo, lastOne], now.toLocaleTimeString('pt-br').slice(0, 5));
                        });
                    }

                    console.log(lastEleven, lastTen, lastNine, lastEight, lastSeven, lastSix, lastFive, lastFour, lastThree, lastTwo, lastOne);

                    ultimoCache = numeroUltimo;
                    edicaoCache = edicaoUltimo;
                }

                await driver.sleep(1000);
            }
        } catch (e) {
            console.log("Deu ruim");
        }
    }
})()

setInterval(function () {
    https.get("https://webcrepe-mongodb.herokuapp.com");
}, 20 * 60 * 1000); // every 20 minutes
