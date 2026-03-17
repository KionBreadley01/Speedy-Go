import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { deleteUser, User } from 'firebase/auth';
import { AddressItem } from '@/store/addressStore';
import { db } from '../firebase';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string; // usually read-only, from auth
  phone: string;
  dob: string; // ISO string or simple YYYY-MM-DD
  gender: 'Hombre' | 'Mujer' | 'Sin definir' | '35 tipo de Gey' | '';
}

const USERS_COLLECTION = 'users';

export const userService = {
  // Get user profile data
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching user profile ${userId}:`, error);
      throw error;
    }
  },

  // Save or Update user profile
  async saveUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      // Merge true allows updating only the provided fields without overwriting the whole document if it exists
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error("Error saving user profile:", error);
      throw error;
    }
  },

  // Get all addresses for a user
  async getAddresses(userId: string): Promise<AddressItem[]> {
    try {
      const colRef = collection(db, USERS_COLLECTION, userId, 'addresses');
      const querySnap = await getDocs(colRef);
      return querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AddressItem));
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  },

  // Add a new address
  async addAddress(userId: string, address: AddressItem): Promise<string> {
    try {
      const colRef = collection(db, USERS_COLLECTION, userId, 'addresses');
      const docRef = await addDoc(colRef, address);
      return docRef.id;
    } catch (error) {
      console.error("Error adding address:", error);
      throw error;
    }
  },

  // Delete an address
  async deleteAddress(userId: string, addressId: string): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId, 'addresses', addressId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  },

  // Update an address
  async updateAddress(userId: string, addressId: string, data: Partial<AddressItem>): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId, 'addresses', addressId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  },

  // Delete user account from Firestore and Firebase Auth
  async deleteUserAccount(user: User): Promise<void> {
    try {
      const userId = user.uid;
      
      // 1. Delete from Firestore
      const docRef = doc(db, USERS_COLLECTION, userId);
      await deleteDoc(docRef);

      // 2. Delete from Auth (According to user instructions, do not handle re-auth here)
      await deleteUser(user);
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
    }
  }
};
