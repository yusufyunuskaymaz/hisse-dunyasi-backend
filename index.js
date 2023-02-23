const express = require("express");
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

let stocks = []
const url = "https://bigpara.hurriyet.com.tr/borsa/canli-borsa/";

const getData = async () => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const booksa = $('div[class="tBody ui-unsortable"] > ul');
  booksa.each(function () {
    title = $(this).find('li[class="cell064 tal arrow"]').text().trim();
    son = $(this).find('li[class="cell048 node-c"]').text().trim();
    alis = $(this).find('li[class="cell048 node-f"]').text().trim();
    satis = $(this).find('li[class="cell048 node-g"]').text().trim();
    yuksek = $(this).find('li[class="cell048 node-h"]').text().trim();
    dusus = $(this).find('li[class="cell048 node-i"]').text().trim();
    aylik_ort = $(this).find('li[class="cell048 node-j"]').text().trim();
    yuzde = $(this).find('li[class="cell048 node-e"]').text().trim();
    hacim_lot = $(this).find('li[class="cell064 node-k"]').text().trim();
    hacim_tl = $(this).find('li[class="cell064 node-l"]').text().trim();
    son_islem = $(this).find('li[class="cell064 node-s"]').text().trim();


    stocks.push({title, son, alis,satis,yuksek,dusus,aylik_ort,yuzde,hacim_lot,hacim_tl,son_islem})

  });

// console.log(stocks)

};

getData();



const io = new Server(server, {
  cors: {
    origin: "https://hisse-dunyasi.netlify.app/stock",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);



  socket.on("send_message", (data) => {
    socket.emit("receive_message", stocks);
    console.log("merhaba")
  });


});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});


