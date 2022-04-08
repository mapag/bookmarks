export default () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt_secret: process.env.JWT_SECRET,
  env: process.env.env || 'dev',
});
