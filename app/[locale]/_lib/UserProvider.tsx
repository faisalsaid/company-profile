'use client';

import { createContext, useContext } from 'react';

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
} | null;

const UserContext = createContext<CurrentUser>(null);

export const useCurrentUser = () => useContext(UserContext);

export function UserProvider({
  user,
  children,
}: {
  user: CurrentUser;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
