export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://knowledge-map.vercel.app'
    : 'http://localhost:3000'