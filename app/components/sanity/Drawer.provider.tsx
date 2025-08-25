'use client';

import {
  ReactNode,
  useState,
  useContext,
  createContext,
} from 'react';

interface DrawerContextType {
  isOpen: boolean;
  openDrawer: (children: ReactNode) => void;
  closeDrawer: () => void;
  drawerContent: ReactNode;
}

const DrawerContext = createContext<
  DrawerContextType | undefined
>(undefined);

export const DrawerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerContent, setDrawerContent] =
    useState<ReactNode>(null);

  const openDrawer = (content: ReactNode) => {
    setDrawerContent(content);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setDrawerContent(null);
  };

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
        drawerContent,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error(
      'useDrawer must be used within a DrawerProvider'
    );
  }
  return context;
};
