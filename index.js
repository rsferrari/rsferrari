const express = require('express');
const cors = require('cors');

const app = express();

app.listen(5500, () => console.log('http://localhost:5500/api/items'));

app.use(cors());
app.use(express.json());

let items = [];

app.route('/api/items')
  .get((req, res) => {
    const simplifiedItems = items.map(item => ({
      id: item.id,
      item: item.item,
      description: item.description,
      state: item.state
    }));
    res.json(simplifiedItems);
  })
  .post((req, res) => {
    const lastId = items.length > 0 ? items[items.length - 1].id : 0;
    const newItem = {
      id: lastId + 1,
      item: req.body.item,
      description: req.body.description,
      state: "A Comprar"
    };

    items.push(newItem);
    res.json(newItem);
  });

app.route('/api/items/:id')
  .get((req, res) => {
    const itemId = req.params.id;
    const item = items.find(item => item.id === Number(itemId));

    if (!item) {
      return res.json('Item not found!');
    }

    res.json(item);
  })
  .put((req, res) => {
    const itemId = req.params.id;
    const itemIndex = items.findIndex(item => item.id === Number(itemId));

    if (itemIndex === -1) {
      return res.json('Item not found!');
    }

    const updatedItem = {
      ...items[itemIndex],
      item: req.body.item || items[itemIndex].item,
      description: req.body.description || items[itemIndex].description,
      state: req.body.state || items[itemIndex].state
    };

    items[itemIndex] = updatedItem;
    res.json('Updated item');
  })
  .delete((req, res) => {
    const itemId = req.params.id;
    const itemIndex = items.findIndex(item => item.id === Number(itemId));

    if (itemIndex === -1) {
      return res.json('Item not found!');
    }

    items.splice(itemIndex, 1);
    res.json('Deleted item');
  });

