import { create } from "zustand";
import { persist } from "zustand/middleware";

// интерфейс всех данных в сторе
interface IExtractStoreData {
	urls: string[];
};

// интерфейс всех экшенов в сторе
interface IExtractStoreActions {
	setUrls: (urls: string[]) => void;
};

// интерфейс только тех данных, которые надо записывать в localStorage
interface IPersistedExctractStoreData {
	urls: string[];
};

export const useExtractStore = create<IExtractStoreData & IExtractStoreActions>()(
	persist(
		(set) => ({
			urls: [],

			setUrls: (urls) => set({ urls, }),
		}),
		{
			name: 'extract-storage',
			partialize: (state): IPersistedExctractStoreData => (state),
		},
	),
);