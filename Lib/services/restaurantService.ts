import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../../store/cartStore';

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
}

const RESTAURANTS_COLLECTION = 'restaurants';
const PRODUCTS_COLLECTION = 'products';

export const restaurantService = {
  // Get all restaurants
  async getRestaurants(): Promise<Restaurant[]> {
    try {
      const q = query(collection(db, RESTAURANTS_COLLECTION));
      const querySnapshot = await getDocs(q);
      
      const restaurants: Restaurant[] = [];
      querySnapshot.forEach((doc) => {
        restaurants.push({ id: doc.id, ...doc.data() } as Restaurant);
      });
      
      return restaurants;
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      throw error;
    }
  },
  // Get all products
  async getProducts(): Promise<Product[]> {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION));
      const querySnapshot = await getDocs(q);
      
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      return products;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  },

  // Get a single restaurant by ID
  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const docRef = doc(db, RESTAURANTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Restaurant;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching restaurant ${id}:`, error);
      throw error;
    }
  },

  // Get all products for a specific restaurant
  async getProductsByRestaurant(restaurantId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION), 
        where("restaurantId", "==", restaurantId)
      );
      const querySnapshot = await getDocs(q);
      
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      return products;
    } catch (error) {
      console.error(`Error fetching products for restaurant ${restaurantId}:`, error);
      throw error;
    }
  },

  // Get a single product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Get all categories dynamically
  async getCategories() {
    try {
      const q = query(collection(db, "categories"));
      const querySnapshot = await getDocs(q);
      
      const categories: { id: string; label: string; image: string; order: number }[] = [];
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        categories.push({ 
          id: doc.id, 
          label: d.name, 
          image: d.icon || d.image || 'https://via.placeholder.com/150',
          order: d.order || 99
        });
      });
      return categories.sort((a,b) => a.order - b.order);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
};
