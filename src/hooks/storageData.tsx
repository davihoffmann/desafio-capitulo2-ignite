import React, { createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LoginDataProps, LoginListDataProps } from '../screens/Home/types';

interface StorageDataProviderProps {
  children: ReactNode;
}

interface StorageDataContextData {
  saveItem(newLoginData: LoginDataProps): Promise<void>;
  getItem(): Promise<LoginListDataProps>;
}

const StorageDataContext = createContext({} as StorageDataContextData);

function StorageDataProvider({ children }: StorageDataProviderProps) {
  const storageLoginKey = '@passmanager:logins';

  async function saveItem(newLoginData: LoginDataProps) {
    try {
      const data = await AsyncStorage.getItem(storageLoginKey);
      const currentData = data ? JSON.parse(data) : [];
      const dataFormatted = [...currentData, newLoginData];

      await AsyncStorage.setItem(storageLoginKey, JSON.stringify(dataFormatted));
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getItem() {
    try {
      const data = await AsyncStorage.getItem(storageLoginKey);
      const currentData: LoginListDataProps = data ? JSON.parse(data) : [];

      return currentData;
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <StorageDataContext.Provider value={{ saveItem, getItem }}>
      {children}
    </StorageDataContext.Provider>
  )
}

function useStorageData() {
  const context = useContext(StorageDataContext);

  return context;
}

export { StorageDataProvider, useStorageData };