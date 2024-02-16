<div align="center">

  <br>
  <img alt="logo" src="https://img.freepik.com/free-vector/pizza-slice-melted-cartoon-vector-icon-illustration-food-object-icon-concept-isolated-premium_138676-4663.jpg?size=626&ext=jpg&ga=GA1.1.903053268.1700122916&semt=ais" width="150"/>
  <h2> Pizza Application </h2>
  
![Node.js](https://img.shields.io/badge/NODE_JS-none?style=for-the-badge&logo=nodedotjs)
![Express.js](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

This repository contains code and resources dedicated to the development and maintenance of the backend component of the Pizza application.

</div>

## Getting started

Below steps will guide you, how to set up your project locally. To get a local copy up and running open your favorite terminal and follow these simple example steps.

1. Clone repo locally
```
git clone https://github.com/MTouthang/Pizza-app.git
```

2. Install dependencies
```
npm i
```

3. Set up .env file 
Create a .env file inside the root folder and configure it by referencing the provided example.env file.

4. Run the project locally
```
npm run dev
```

## Database Design 
check out the database design

<!-- https://app.eraser.io/workspace/Ok1K1dDBN81DcOQ72KiQ?origin=share -->
<a href="https://app.eraser.io/workspace/Ok1K1dDBN81DcOQ72KiQ?elements=ZIAH7t8FmFRIq64_H-MC6A">View on Eraser<br /><img src="https://app.eraser.io/workspace/Ok1K1dDBN81DcOQ72KiQ/preview?elements=ZIAH7t8FmFRIq64_H-MC6A&type=embed" /></a>

## Project Structure

Code files
- `controllers/`: Defined controller functions.
- `models/`: Defined Schemes and Models.
- `routes/`: Defined API routes.
- `middlewares/`: Defined middleware functions.
- `config`: Defined API-related configs here (eg. DB configs).
- `utils/`: Reusable utility function/constants.

## Future possible work
- `payment`: integrate online payment gateway
- `slug`: integrate with slug for SEO friendly
- `test`: integrate with unit testing
- `docker`: containerize the service
