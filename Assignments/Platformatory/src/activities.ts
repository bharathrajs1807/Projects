import axios from 'axios';
import { User } from './models/User';

// Get CrudCrud API endpoint from environment variable
const CRUDCRUD_API = process.env.CRUDCRUD_API || 'https://crudcrud.com/api/94cf328e3f0d469ab2c0fb19fda8ca05';

// In-memory storage for users
let users: { [key: string]: any } = {};

export async function saveToLocalDB(user: any) {
  try {
    // This is now just a backup save to ensure data consistency
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      user,
      { new: true, runValidators: true }
    );
    console.log('Backup save to MongoDB:', savedUser);
    return savedUser;
  } catch (error) {
    console.error('Error in backup save to MongoDB:', error);
    throw error;
  }
}

export async function syncToCrudCrud(user: any) {
  try {
    // Remove sensitive data before syncing
    const { password, ...safeUserData } = user;
    
    const res = await axios.post(CRUDCRUD_API, safeUserData);
    console.log('Synced to CrudCrud:', res.data);
    return res.data;
  } catch (error) {
    console.error('Failed to sync to CrudCrud:', error);
    throw error;
  }
}
