import http from 'http'
import jwt from 'jsonwebtoken'


let cachedToken: any;
const server = http.createServer(async(req, res) => {

  // if (req.url === '/login') {
  //   console.log('>>> JWT Cached: ', cachedToken);
  //   const token = generateToken()
  
  //   process.env.token = token.access_token
  
  //   return res.writeHead(200).end(JSON.stringify({ token }))
  // }

  // const decode = JSON.parse(Buffer.from(process.env.token!.split('.')[1], 'base64').toString());
  // console.log(decode)

  //   if (decode.exp * 1000 < new Date().getTime()) {
  //     console.log('Time Expired');
  // }

  return res.writeHead(200).end(JSON.stringify({ 
    message: 'hello',
    // token: process.env.token
  }))
})

function generateToken() {
  if (cachedToken) {
    const decode = JSON.parse(Buffer.from(cachedToken.access_token?.split('.')[1], 'base64').toString())
    if (decode.exp * 1000 > new Date().getTime()) {
      console.log('>>> JWT Cached: ', cachedToken);
      return cachedToken
    }
    console.log('Token Expired');
  }
  const access_token = jwt.sign({}, 'secret', { expiresIn: 10 })

  cachedToken = {
    access_token,
  }
  console.log('>>> JWT Service: ', cachedToken);
  return cachedToken
}

server.listen(3001)

server.on('listening', () => console.log('Server is running!'))