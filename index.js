const http = require('http');
const fs = require('fs');
const Handlebars = require('handlebars');

const PORT = process.env.PORT || 8080
const HOST = process.env.HOST || 'localhost'

function render() {
  const data = fs.readFileSync(__dirname + '/data.json', 'utf-8')
  const css = fs.readFileSync(__dirname + '/style.css', 'utf-8')
  const tpl = fs.readFileSync(__dirname + '/index.hbs', 'utf-8')
  return Handlebars.compile(tpl)({
    css,
    data: JSON.parse(data),
  });
}

const server = http.createServer(async (req, res) => {
  const headers = {}
  try {
    const body = render()
    headers['Content-Type'] = 'text/html; charset=utf-8'
    headers['Content-length'] = Buffer.byteLength(body)
    res.writeHead(200, headers)
    res.write(body)
  } catch (e) {
    const body = e.toString()
    headers['Content-Type'] = 'text/plain; charset=utf-8'
    headers['Content-length'] = Buffer.byteLength(body)
    res.writeHead(500, headers)
    res.write(body)
  }
  res.end()
})


server.listen({
  port: PORT,
  host: HOST
}, () => {
  console.log('Server listening on http://' + HOST + ':' + PORT)
})
