const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;
const GOOGLE_API_KEY = 'AIzaSyAxCJypuQ_H22NThqDeqIKmv4hdK3stzyY'; // ここを取得したAPIキーに置き換えます

app.use(cors());

app.get('/places', async (req, res) => {
  console.log('Received request'); // デバッグ用ログ
  const { latitude, longitude, minPrice, maxPrice, type } = req.query;
  console.log('Latitude:', latitude, 'Longitude:', longitude); // デバッグ用ログ
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${latitude},${longitude}`,
        radius: 500, // 半径を変更
        type: type || 'restaurant',
        minprice: minPrice,
        maxprice: maxPrice,
        key: GOOGLE_API_KEY
      }
    });

    console.log('Response data:', response.data); // レスポンスデータをログに表示

    const places = response.data.results;
    console.log('Filtered places:', places); // フィルタリングされた結果をログに表示

    if (places.length > 0) {
      const randomPlace = places[Math.floor(Math.random() * places.length)];
      res.json(randomPlace);
    } else {
      res.status(404).send('No places found');
    }
  } catch (error) {
    console.error('Error:', error.message); // エラーログを表示
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`); // サーバ起動ログを表示
});
