export default {
   BASE_URL: process.env.NODE_ENV === 'production' ? 'http://185.229.227.69:3001' : 'http://localhost:3000'
}

console.log(process.env.NODE_ENV)