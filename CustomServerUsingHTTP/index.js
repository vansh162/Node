const http = require('http');
const fs = require('fs');
const PORT = 8089;

const server = http.createServer((req, res) => {
    let filename = '';
    

    // Handle routing
    switch (req.url) {
        case '/':
            filename = 'home.html';
            break;
        case '/about':
            filename = 'about.html';
            break;
        case '/features':
            filename = 'features.html';
            break;
        case '/contacts':
            filename = 'contacts.html';
            break;
        default:
            filename = 'home.html';
            break;
    }

    // Read and serve the HTML file
    fs.readFile(filename, (err, data) => {
      if (err) {
        res.write("Server Error");
        res.end();
        return;
      }

      res.write(data);
      res.end();
    });
  })
  .listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
  });
