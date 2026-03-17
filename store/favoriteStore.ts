import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from './cartStore';

interface FavoriteState {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (product) => {
        set((state) => {
          const isFav = state.favorites.some((p) => p.id === product.id);
          if (isFav) {
            return {
              favorites: state.favorites.filter((p) => p.id !== product.id),
            };
          } else {
            return {
              favorites: [...state.favorites, product],
            };
          }
        });
      },

      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },
    }),
    {
      name: 'speedygo-favorites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
