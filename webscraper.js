const chrome = require('selenium-webdriver/chrome');
let webdriver = require('selenium-webdriver');
var https = require("https");

var request = require('request');

console.log("Rodando web scraping");

var ultimoCache = -123;
var doisCache = -123;
var tresCache = -123;

var numeroUltimo = -987;
var numeroDois = -987;
var numeroTres = -987;

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

    await driver.get('https://blaze.com/pt/games/double')
    await driver.manage().window().maximize()

    await driver.sleep(3000)

    while (true) {
        await driver.sleep(500)

        try {
            var isCompleted = await driver.findElement(webdriver.By.xpath('//*[@id="roulette"]')).getAttribute('class');
            var classUltimo = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[1]/div/div')).getAttribute('class');
            var classDois = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[2]/div/div')).getAttribute('class');
            var classTres = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[3]/div/div')).getAttribute('class');

            if (isCompleted.includes('complete')) {
                await driver.sleep(2000)

                if (classUltimo.includes('white') || classDois.includes('white') || classTres.includes('white')) {
                    classUltimo.includes('white') ? numeroUltimo = '0' : numeroUltimo = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[1]/div/div/div')).getText();
                    classDois.includes('white') ? numeroDois = '0' : numeroDois = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[2]/div/div/div')).getText();
                    classTres.includes('white') ? numeroTres = '0' : numeroTres = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[3]/div/div/div')).getText();

                } else {
                    numeroUltimo = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[1]/div/div/div')).getText();
                    numeroDois = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[2]/div/div/div')).getText();
                    numeroTres = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[3]/div/div/div')).getText();
                }

                (ultimoCache !== numeroUltimo
                    || doisCache !== numeroDois
                    || tresCache !== numeroTres) && console.log(`--------------------\n\nCache antigo: ${ultimoCache} - ${doisCache}- ${tresCache}\nCache atual: ${numeroUltimo} - ${numeroDois} - ${numeroTres}\n`);

            }
        } catch (e) {
            console.log("DEU RUIM");
        }

        if (ultimoCache === numeroUltimo &&
            doisCache === numeroDois &&
            tresCache === numeroTres) {

            await new Promise(resolve => setTimeout(resolve, 1000))

        } else {
            const now = new Date();

            if (numeroUltimo < 0) {
                var resultado = {
                    "resultado": numeroUltimo
                };

                request({
                    url: "http://localhost:3000/resultado",
                    method: "POST",
                    json: true,   // <--Very important!!!
                    body: resultado
                }, function (error, response, body) {
                    console.log(body);
                });

                console.log("Adicionando", numeroUltimo);
            }



            ultimoCache = numeroUltimo;
            doisCache = numeroDois;
            tresCache = numeroTres;
        }

        await new Promise(resolve => setTimeout(resolve, 1000))
    }
})()

setInterval(function () {
    https.get("https://webcrepe.herokuapp.com");
}, 20 * 60 * 1000); // every 20 minutes
