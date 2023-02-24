const express = require("express");
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

let companyCode = ""
var companyLink = ""

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.emit("receive_message", news);
    var companyCode = data.itemTitle
    var companyLink = data.itemLink
  });

});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});

const url2 =
` https://bigpara.hurriyet.com.tr/borsa/hisse-fiyatlari/${companyLink}`
let news = [];

const getNews = async () => {
  const response = await axios.get(url2);
  const $ = cheerio.load(response.data);
  const booksa = $('div[class="tBody"] > ul');
  booksa.each(function () {
    date = $(this).find('li[class="cell031 fsn"]').text().trim();
    title = $(this).find('li[class="cell029"]').text().trim();
    link = $(this).find('li[class="cell029"]').find("a").attr("href");

    news.push({ date, title, link });


  });

  console.log(news);
};

getNews();

