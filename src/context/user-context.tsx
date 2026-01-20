'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type User = {
  name: string;
  email: string;
  avatar: string;
};

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

const defaultUser: User = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatar: userAvatar?.imageUrl || '',
};

export const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(defaultUser);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    try {
      const item = window.localStorage.getItem('user-profile');
      if (item) {
        setUserState(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to load user from localStorage', error);
      setUserState(defaultUser);
    }
  }, []);

  useEffect(() => {
    // This effect runs whenever the user state changes, but not on initial render if user is default.
    try {
      // Avoid writing default user to localStorage on first load
      if (JSON.stringify(user) !== JSON.stringify(defaultUser)) {
        window.localStorage.setItem('user-profile', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Failed to save user to localStorage', error);
    }
  }, [user]);
  
  const setUser = (newUser: User) => {
    setUserState(newUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
