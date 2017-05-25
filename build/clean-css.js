const fs = require('fs');
const cleanCSS = require('clean-css');
const path = 'static/styles/inline.css';

fs.writeFileSync(path, new cleanCSS().minify([path]).styles);

