import jwt from 'jsonwebtoken'

export default function generateToken(cachedToken: any) {
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
}