// app.ts 
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import * as bookController from './controllers/bookController'; 
import * as userController from './controllers/userController';
import swaggerOptions from './swaggerOptions';
import mongoose from 'mongoose';


//Host url definition
const mongoDBPort = 27017;
const MONGODB_URI = `mongodb://localhost:${mongoDBPort}/bookstore`; 

//MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

const db = mongoose.connection;
//Error handling for MongoDB
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const app = express();
const port = 3000; //Swagger port setup

app.use(express.json());

//Swagger init
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Endpoints list
app.post('/books', bookController.createBook);
app.get('/books', bookController.getBooks);
app.get('/books/:bookId', bookController.getBookById);
app.put('/books/:bookId', bookController.updateBook);


app.post('/users', userController.createUser);
app.get('/users', userController.getUsers);
app.get('/users/:userId', userController.getUserById);
app.put('/users/:userId', userController.updateUser);
app.delete('/users/:userId', userController.deleteUser);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
