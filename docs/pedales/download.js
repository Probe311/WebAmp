const https = require('https');
const http = require('http');
const fs = require('fs');
const urlParse = require('url').parse;

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const parsed = urlParse(url);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = parsed.protocol + '//' + parsed.host + redirectUrl;
        }
        return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
      file.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });
    req.on('error', reject);
  });
}

const [,, url, dest] = process.argv;
if (url && dest) {
  downloadFile(url, dest)
    .then(p => console.log('Downloaded successfully to:', p))
    .catch(err => {
      console.error('Download error:', err.message);
      process.exit(1);
    });
}
