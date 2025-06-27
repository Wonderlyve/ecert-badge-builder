
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'establishment' | 'student' | 'employer' | 'citizen' | 'ministry_education' | 'ministry_land';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institution?: string;
  ministry?: 'education' | 'land';
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  institution?: string;
  ministry?: 'education' | 'land';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler la vérification du token au démarrage
    const token = localStorage.getItem('ecert_token');
    const userData = localStorage.getItem('ecert_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('ecert_token');
        localStorage.removeItem('ecert_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulation d'authentification (à remplacer par vraie API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let mockUser: User;
    
    if (email === 'admin@ecert.cd') {
      mockUser = {
        id: '1',
        email,
        name: 'Administrateur',
        role: 'admin',
        verified: true
      };
    } else if (email === 'education@minepsp.cd') {
      mockUser = {
        id: '2',
        email,
        name: 'Ministère de l\'Éducation',
        role: 'ministry_education',
        ministry: 'education',
        institution: 'Ministère de l\'Enseignement Primaire, Secondaire et Professionnel',
        verified: true
      };
    } else if (email === 'foncier@ministere.cd') {
      mockUser = {
        id: '3',
        email,
        name: 'Ministère des Affaires Foncières',
        role: 'ministry_land',
        ministry: 'land',
        institution: 'Ministère des Affaires Foncières',
        verified: true
      };
    } else {
      mockUser = {
        id: '4',
        email,
        name: 'Utilisateur Test',
        role: 'student',
        institution: 'Université de Kinshasa',
        verified: true
      };
    }
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    localStorage.setItem('ecert_token', mockToken);
    localStorage.setItem('ecert_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    
    // Simulation d'inscription
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      institution: userData.institution,
      ministry: userData.ministry,
      verified: ['ministry_education', 'ministry_land'].includes(userData.role) ? true : userData.role !== 'establishment'
    };
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    localStorage.setItem('ecert_token', mockToken);
    localStorage.setItem('ecert_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('ecert_token');
    localStorage.removeItem('ecert_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
