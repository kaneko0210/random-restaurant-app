
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS設定を強化
app.use(cors({
  origin: '*', // 必要に応じて特定のオリジンを指定
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.get('/places', async (req, res) => {
    const { latitude, longitude, minPrice, maxPrice, type } = req.query;
    const GOOGLE_API_KEY = 'AIzaSyAxCJypuQ_H22NThqDeqIKmv4hdK3stzyY'; // ここにGoogle APIキーを設定
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=100&type=${type}&minprice=${minPrice}&maxprice=${maxPrice}&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get(url);
        const places = response.data.results.filter(place => place.rating >= 4);
        res.json(places);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching places' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
