import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Connection, Client } from '@temporalio/client';
import { updateProfileWorkflow } from './workflows';
import { connectDB } from './config/database';
import { User, IUser } from './models/User'; // Make sure IUser interface exists in your model

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(bodyParser.json());

// GET all users
app.get('/api/users', async (_req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET single user
app.get('/api/users/:id', async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST new user
app.post('/api/users', async (req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    
    const connection = await Connection.connect();
    const client = new Client({ connection });
    await client.workflow.start(updateProfileWorkflow, {
      args: [newUser.toObject()],
      taskQueue: 'profile-task-queue',
      workflowId: `create-user-${newUser._id}`
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PATCH update user
app.patch('/api/users/:id', async (req: any, res: any) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const connection = await Connection.connect();
    const client = new Client({ connection });
    await client.workflow.start(updateProfileWorkflow, {
      args: [updatedUser.toObject()],
      taskQueue: 'profile-task-queue',
      workflowId: `update-user-${updatedUser._id}`
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req: any, res: any) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
