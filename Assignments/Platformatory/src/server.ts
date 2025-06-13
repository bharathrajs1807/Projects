import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { Connection, Client } from '@temporalio/client';
import { updateProfileWorkflow } from './workflows';
import { connectDB } from './config/database';
import { User, IUser } from './models/User';

// Initialize express app
const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Validation helpers
const validatePhone = (phone: string): boolean => /^\d{10}$/.test(phone);
const validatePincode = (pincode: string): boolean => /^\d{6}$/.test(pincode);

// Auth Routes
app.post('/api/auth/signup', async (req: any, res: any) => {
  try {
    const { firstName, lastName, email, password, phone, city, pincode } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone || !city || !pincode) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Validate phone and pincode format
    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Phone must be a 10-digit number.' });
    }

    if (!validatePincode(pincode)) {
      return res.status(400).json({ error: 'Pincode must be a 6-digit number.' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();

    // Trigger Temporal workflow
    try {
      const connection = await Connection.connect();
      const client = new Client({ connection });
      const workflowId = `user-${newUser._id}`;
      
      await client.workflow.start(updateProfileWorkflow, {
        args: [newUser.toObject()],
        taskQueue: 'profile-task-queue',
        workflowId
      });
    } catch (workflowError) {
      console.error('Temporal workflow error:', workflowError);
      // Continue with user creation even if workflow fails
    }

    // Return user data (excluding password)
    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json(userData);
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user: ' + error.message });
  }
});

app.post('/api/auth/login', async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    // Return user data without password
    const { password: _, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Profile Routes
app.patch('/api/profile/:id', async (req: any, res: any) => {
  try {
    const { firstName, lastName, phone, city, pincode } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !city || !pincode) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Validate phone and pincode format
    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Phone must be a 10-digit number.' });
    }

    if (!validatePincode(pincode)) {
      return res.status(400).json({ error: 'Pincode must be a 6-digit number.' });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Trigger Temporal workflow
    try {
      const connection = await Connection.connect();
      const client = new Client({ connection });
      const workflowId = `user-${updatedUser._id}`;

      await client.workflow.signalWithStart(updateProfileWorkflow, {
        workflowId,
        taskQueue: 'profile-task-queue',
        args: [updatedUser.toObject()],
        signal: 'updateProfileSignal',
        signalArgs: [updatedUser.toObject()],
      });
    } catch (workflowError) {
      console.error('Temporal workflow error:', workflowError);
      // Continue with user update even if workflow fails
    }

    // Return updated user data without password
    const { password: _, ...userData } = updatedUser.toObject();
    res.json(userData);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user: ' + error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
