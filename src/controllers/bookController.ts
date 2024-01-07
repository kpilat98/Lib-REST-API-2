import { Request, Response } from 'express';
import { BookModel } from '../models/bookModel';

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books
 */
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewBook'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *            example:
 *             id: 1
 *             title: "The Great Gatsby"
 *             author: "F. Scott Fitzgerald"
 *             year: 1925
 *             tags: [{ id: 1, name: "Classic" }]
 *             category: "Fiction"
 *             status: "available"
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get a list of books with optional query parameters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Book title to filter by
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Book author to filter by
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Book category to filter by
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               - $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the book to get
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */

/**
 * @swagger
 * /books/{bookId}:
 *   put:
 *     summary: Update book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewBook:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         year:
 *           type: number
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               name:
 *                 type: string
 *         category:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, borrowed, in maintenance]
 * 
 *
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         year:
 *           type: number
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               name:
 *                 type: string
 *         category:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, borrowed, in maintenance]
 */

export const createBook = async (req: Request, res: Response) => {
  try {
    // Check if req.body exists and has the expected properties
    if (!req.body || !req.body.title || !req.body.author) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Generate a unique ID
    let newBookId = req.body.id;
    if (!newBookId || (await BookModel.findOne({ id: newBookId }))) {
      // If the provided ID is not unique or not provided, generate a new random ID with at least 5 digits
      newBookId = Math.floor(10000 + Math.random() * 90000);
      while (await BookModel.findOne({ id: newBookId })) {
        newBookId = Math.floor(10000 + Math.random() * 90000);
      }
    }
    const validStatuses = ['available', 'borrowed', 'in maintenance'];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid status, valid statuses: available, borrowed, in maintenance' });
    }
    const newBook = new BookModel({
      id: newBookId,
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
      category: req.body.category,
      status: req.body.status,
      tags: req.body.tags || [],
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { title, author, category } = req.query;
    const filter: any = {};

    if (title && typeof title === 'string') {
      filter.title = { $regex: new RegExp(title, 'i') };
    }

    if (author && typeof author === 'string') {
      filter.author = { $regex: new RegExp(author, 'i') };
    }

    if (category && typeof category === 'string') {
      filter.category = { $regex: new RegExp(category, 'i') };
    }

    const books = await BookModel.find(filter);
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
        // Check if req.body exists and has the expected properties
        if (!req.body || !req.body.title || !req.body.author || !req.body.id) {
          return res.status(400).json({ error: 'Invalid request body, provide all book capabilities' });
        }
    const bookId: string = String(req.params.bookId);
    const foundBook = await BookModel.findOne({ id: Number(bookId) });

    if (foundBook) {
      res.status(200).json(foundBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.title || !req.body.author) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    // Generate a unique ID
    let newBookId = req.body.id;
    if (!newBookId || (await BookModel.findOne({ id: newBookId }))) {
      // If the provided ID is not unique or not provided, generate a new random ID with at least 5 digits
      newBookId = Math.floor(10000 + Math.random() * 90000);
      while (await BookModel.findOne({ id: newBookId })) {
        newBookId = Math.floor(10000 + Math.random() * 90000);
      }
    }
    const bookId: string = String(req.params.bookId);
    req.body.id = newBookId;
    const updatedBook = await BookModel.findOneAndUpdate(
      { id: Number(bookId) },
      { $set: req.body },
      { new: true }
    );
    const validStatuses = ['available', 'borrowed', 'in maintenance'];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid status, valid statuses: available, borrowed, in maintenance' });
    }
    if (updatedBook) {
      res.status(200).json(updatedBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
