import  express, { request, response }  from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModels.js";
// import bookRoutes from './routes/bookRoutes.js'
import cors from 'cors'

const app = express();

// middleware for parsing request body
app.use(express.json())


// middleware for handling cors policy
// option-1: Allow all the origins with the default cors(*)
app.use(cors())

// option-2: Alllow custom origins
// app.use(
//     cors({
//         origin: 'http://localhost:5173',
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type']
//     })
//     )

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to the Book Store')
});


// app.use('books', bookRoutes)

// route for save a new book
app.post('/books', async (request, response) => {
    try {
        if (!request.body.title || !request.body.author || !request.body.publishYear) {
            return response.status(400).send({message: 'Send All the required fields title, author, publishYear',})
        }
        const newBook =  {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
        const book = await Book.create(newBook);
        return response.status(201).send(book)
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
});


// route for get all books from database
app.get('/books', async (request, response) => {
    try {
        const books = await Book.find({})
        return response.status(200).json({
            count: books.length,
            data: books,
        })
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
});


// route for get 1 book from database by id
app.get('books/:id', async (request, response) => {
    try {

        const {id} = request.params;

        const book = await Book.findById(id)
        return response.status(200).json(book)
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
});

// route for update a book
app.put('books/:id', async (request, response) => {
    try {
        if (!request.body.title || !request.body.author || !request.body.publishYear) {
            return response.status(400).send({message: 'Send all the required fields: title, author, publisYear'})
        }
        
        const {id} = request.params;

        const result = await Book.findByIdAndUpdate(id, request.body)
        if (!result) {
            return response.status(404).json({message: 'Book not found'})
        }
        return response.status(200).send({message: 'Book Updated Successfully'});
        

    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
});

// route for delete a book
app.delete('books/:id', async (request, response) => {
    try {
        const {id} = request.params;

        const result = await Book.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({message: 'Book not found'})
        }
            return response.status(200).send({message: 'Book Deleted Successfully'})
        
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})

mongoose.connect(mongoDBURL)
.then(() => {
    console.log('App is connected to database');
    app.listen(PORT, () => {
        console.log(`Every thing is okay on port: ${PORT}`);
    });
})
.catch((error) => {
    console.log(error)
})