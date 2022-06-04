import express from 'express';
import path from 'path'
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, "/../../build/frontend/")))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/../../build/frontend/index.html"));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})