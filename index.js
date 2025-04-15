// index.js
const express = require('express');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

const app = express();
const port = process.env.PORT || 3000;

// JSONのパースと静的ファイル(publicフォルダ)の配信
app.use(bodyParser.json());
app.use(express.static('public'));

// In-Memory での保存（本番ではデータベースの採用が望ましい）
let urlDatabase = {};

// POSTリクエスト: URLを短縮するエンドポイント
app.post('/shorten', (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }
  // 7文字のユニークな短縮コードを生成
  const shortCode = nanoid(7);
  urlDatabase[shortCode] = originalUrl;
  // ホスト情報から短縮URLを組み立てる
  const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
  res.json({ originalUrl, shortUrl });
});

// GETリクエスト: 短縮URLが来た場合、元のURLへリダイレクトするエンドポイント
app.get('/:code', (req, res) => {
  const originalUrl = urlDatabase[req.params.code];
  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.status(404).json({ error: 'Short URL not found' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
