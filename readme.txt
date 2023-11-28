to create prisma db type in terminal - npx prisma generate
to load prisma db (which is MySQL DB) - npx prisma db push - to push the generated db 

if we have changes in schema.prisma we need to type in terminal -  npx prisma generate - and than push in to PlanetScale by using - npx prisma db push

////////////////
prettier.config.js

module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
}
//////////////////