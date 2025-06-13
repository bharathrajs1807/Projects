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
app.post('/api/users', async (req: any, res: any) => {
  try {
    const { firstName, lastName, phone, city, pincode } = req.body;
    if (!firstName || !lastName || !phone || !city || !pincode) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide firstName, lastName, phone, city, and pincode.' 
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ 
        error: 'Invalid phone number format. Please provide a 10-digit number.' 
      });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ 
        error: 'Invalid pincode format. Please provide a 6-digit number.' 
      });
    }

    const newUser = new User(req.body);
    await newUser.save();
    
    try {
      const connection = await Connection.connect();
      const client = new Client({ connection });
      await client.workflow.start(updateProfileWorkflow, {
        args: [newUser.toObject()],
        taskQueue: 'profile-task-queue',
        workflowId: `create-user-${newUser._id}`
      });
    } catch (workflowError) {
      console.error('Temporal workflow error:', workflowError);
    }
    
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error: ' + Object.values(error.errors).map((e: any) => e.message).join(', ')
      });
    }
    res.status(500).json({ error: 'Failed to create user: ' + error.message });
  }
});

// PATCH update user
app.patch('/api/users/:id', async (req: any, res: any) => {
  try {
    const { firstName, lastName, phone, city, pincode } = req.body;
    if (!firstName || !lastName || !phone || !city || !pincode) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide firstName, lastName, phone, city, and pincode.' 
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ 
        error: 'Invalid phone number format. Please provide a 10-digit number.' 
      });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ 
        error: 'Invalid pincode format. Please provide a 6-digit number.' 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      const connection = await Connection.connect();
      const client = new Client({ connection });

      await client.workflow.signalWithStart(updateProfileWorkflow, {
        workflowId: `update-user-${updatedUser._id}`,
        taskQueue: 'update-profile',
        args: [updatedUser.toObject()],
        signal: 'updateProfileSignal',
        signalArgs: [updatedUser.toObject()],
      });
    } catch (workflowError) {
      console.error('Temporal workflow error:', workflowError);
    }

    res.json(updatedUser);
  } catch (error: any) {
    console.error('Update user error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error: ' + Object.values(error.errors).map((e: any) => e.message).join(', ')
      });
    }
    res.status(500).json({ error: 'Failed to update user: ' + error.message });
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
