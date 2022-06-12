const express = require('express');
const app = express();
const path = require('path');

app.set('view enging', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log('on port 3000');
})
