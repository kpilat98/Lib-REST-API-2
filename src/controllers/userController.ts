// userController.ts
import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               firstName: "John"
 *               lastName: "Doe"
 *               address: "123 Main St"
 *               borrowedBooks: [{ id: 1, title: "The Great Gatsby" }]
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               - $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to get
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         address:
 *           type: string
 *         borrowedBooks:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               title:
 *                 type: string
 */

export const createUser = async (req: Request, res: Response) => {
  try {
    // Check if req.body exists and has the expected properties
    if (!req.body || !req.body.firstName || !req.body.lastName || !req.body.address) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    let newUserId = req.body.id;
    if (!newUserId || (await UserModel.findOne({ id: newUserId }))) {
      // If the provided ID is not unique or not provided, generate a new random ID with at least 5 digits
      newUserId = Math.floor(10000 + Math.random() * 90000);
      while (await UserModel.findOne({ id: newUserId })) {
        newUserId = Math.floor(10000 + Math.random() * 90000);
      }
    }

    const newUser = new UserModel({
      id: newUserId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      borrowedBooks: req.body.borrowedBooks || [],
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId: string = String(req.params.userId);
    const foundUser = await UserModel.findOne({ id: Number(userId) });

    if (foundUser) {
      res.status(200).json(foundUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.firstName || !req.body.lastName || !req.body.address) {
      return res.status(400).json({ error: 'Invalid request body, provide all user data' });
    }
      // Generate a unique ID
    let newUserId = req.body.id;
    if (!newUserId || (await UserModel.findOne({ id: newUserId }))) {
      // If the provided ID is not unique or not provided, generate a new random ID with at least 5 digits
      newUserId = Math.floor(10000 + Math.random() * 90000);
      while (await UserModel.findOne({ id: newUserId })) {
        newUserId = Math.floor(10000 + Math.random() * 90000);
      }
    }
    const userId: string = String(req.body.id);
    req.body.id = newUserId;
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: Number(userId) },
      { $set: req.body },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId: string = String(req.params.userId);
    const deletedUser = await UserModel.findOneAndDelete({ id: Number(userId) });

    if (deletedUser) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};