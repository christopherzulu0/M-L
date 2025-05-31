import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

/**
 * Custom hook to manage property favorites
 * @returns Methods and state for managing favorites
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(storedFavorites);
    }
  }, []);

  /**
   * Check if a property is in favorites
   * @param propertyId - The ID of the property to check
   * @returns True if the property is in favorites
   */
  const isFavorite = (propertyId: string | number): boolean => {
    return favorites.includes(propertyId.toString());
  };

  /**
   * Add a property to favorites
   * @param propertyId - The ID of the property to add
   * @param propertyTitle - The title of the property for toast notification
   */
  const addToFavorites = (propertyId: string | number, propertyTitle: string): void => {
    const propertyIdStr = propertyId.toString();
    if (!favorites.includes(propertyIdStr)) {
      const updatedFavorites = [...favorites, propertyIdStr];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('favoritesUpdated'));

      toast({
        title: "Added to favorites",
        description: `${propertyTitle} has been added to your favorites`,
        duration: 3000,
      });
    }
  };

  /**
   * Remove a property from favorites
   * @param propertyId - The ID of the property to remove
   * @param propertyTitle - The title of the property for toast notification
   */
  const removeFromFavorites = (propertyId: string | number, propertyTitle: string): void => {
    const propertyIdStr = propertyId.toString();
    const updatedFavorites = favorites.filter(id => id !== propertyIdStr);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('favoritesUpdated'));

    toast({
      title: "Removed from favorites",
      description: `${propertyTitle} has been removed from your favorites`,
      duration: 3000,
    });
  };

  /**
   * Toggle favorite status of a property
   * @param propertyId - The ID of the property to toggle
   * @param propertyTitle - The title of the property for toast notification
   * @returns The new favorite status
   */
  const toggleFavorite = (propertyId: string | number, propertyTitle: string): boolean => {
    const propertyIdStr = propertyId.toString();
    const isCurrentlyFavorite = favorites.includes(propertyIdStr);

    if (isCurrentlyFavorite) {
      removeFromFavorites(propertyId, propertyTitle);
      return false;
    } else {
      addToFavorites(propertyId, propertyTitle);
      return true;
    }
  };

  return {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    favoritesCount: favorites.length
  };
}
