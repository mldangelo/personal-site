import { create } from 'zustand';
import { type PersistStorage, persist } from 'zustand/middleware';

interface CellState {
  isOpen: boolean;
}

interface CellStore {
  cells: { [id: string]: CellState };
  setIsOpen: (id: string, isOpen: boolean) => void;
}

const zustandStorage: PersistStorage<CellStore> = {
  getItem: (name: string) => {
    const storedValue = localStorage.getItem(name);
    if (storedValue) {
      return JSON.parse(storedValue); // Parse stored JSON value
    }
    return null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value)); // Store as JSON
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  }
};

const useCellStore = create<CellStore>()(
  persist(
    (set) => ({
      cells: {},
      setIsOpen: (id: string, isOpen: boolean) =>
        set((state) => {
          // Spread the state to ensure immutability
          return {
            cells: {
              ...state.cells,
              [id]: { isOpen } // Safely update the isOpen state for this id
            }
          };
        })
    }),
    {
      name: 'cell-store',
      storage: zustandStorage,
      skipHydration: true // Skipping hydration is ok if your logic doesn't require it
    }
  )
);

export default useCellStore;
