/**
 * Gilbert B Hammer Photography — static server
 *
 * Plain static file server, same pattern as the HMG Preserve Media site.
 * Railway detects package.json and runs `npm install && npm start`.
 */

'use strict';

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Gilbert B Hammer Photography server running on port ${PORT}`);
});
