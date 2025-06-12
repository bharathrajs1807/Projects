import axios from 'axios';
import { User } from './models/User';

// In-memory storage for users
let users: { [key: string]: any } = {};

export async function saveToLocalDB(user: any) {
  try {
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      user,
      { new: true, runValidators: true }
    );
    console.log('Saved to MongoDB:', savedUser);
    return savedUser;
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    throw error;
  }
}

export async function syncToCrudCrud(user: any) {
  try {
    const endpoint = 'https://crudcrud.com/api/94cf328e3f0d469ab2c0fb19fda8ca05';
    const res = await axios.post(endpoint, user);
    console.log('Synced to CrudCrud:', res.data);
    return res.data;
  } catch (error) {
    console.error('Failed to sync to CrudCrud:', error);
    throw error;
  }
}
