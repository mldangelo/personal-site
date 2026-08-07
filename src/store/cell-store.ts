import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CellStore {
  cells: Record<string, { isOpen: boolean }>;
  setIsOpen: (id: string, isOpen: boolean) => void;
}

const useCellStore = create<CellStore>()(
  persist(
    (set) => ({
      cells: {},
      setIsOpen: (id, isOpen) =>
        set((state) => ({ cells: { ...state.cells, [id]: { isOpen } } }))
    }),
    {
      name: 'cell-store',
      storage: createJSONStorage(() => localStorage),
      // Persisted state is only trusted after mount; see project-cell.tsx.
      skipHydration: true
    }
  )
);

export default useCellStore;
