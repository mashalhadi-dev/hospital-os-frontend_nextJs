import { create } from 'zustand';
import axios from 'axios';
import { api, type BackendUser } from '@/services/api';
import type { User, UserRole } from '@/types/user';

export type { User, UserRole };

/**
 * Normalizes backend AuthUser response to frontend User type.
 * Backend uses `name` field, frontend uses `fullName` for clarity.
 */
export const normalizeBackendUser = (backendUser: BackendUser): User => ({
  id: backendUser.id,
  email: backendUser.email,
  fullName: backendUser.name,
  name: backendUser.name,
  role: backendUser.role,
  hospitalId: backendUser.hospitalId,
  hospitalName: backendUser.hospital.name,
  phone: backendUser.phone ?? undefined,
  createdAt: backendUser.createdAt ? String(backendUser.createdAt) : undefined,
  doctorProfileId: backendUser.doctorProfile?.id,
  nurseProfileId: backendUser.nurseProfile?.id,
  receptionistProfileId: backendUser.receptionistProfile?.id,
  patientProfileId: backendUser.patientProfile?.id,
});

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (userPartial: Partial<User>) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false,

  setAuth: (user: User, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('docnode_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, hydrated: true });
  },

  updateUser: (userPartial: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...userPartial };
      if (typeof window !== 'undefined') {
        localStorage.setItem('docnode_user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('docnode_user');
    }
    set({ user: null, token: null, isAuthenticated: false, hydrated: true });
  },

  initialize: async () => {
    if (typeof window === 'undefined') return;
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedUserRaw = localStorage.getItem('docnode_user');

      if (storedToken && storedUserRaw) {
        const storedUser = JSON.parse(storedUserRaw) as User;
        if (storedUser && isUserRole(storedUser.role)) {
          const { data } = await api.auth.current();
          const user = normalizeBackendUser(data);
          localStorage.setItem('docnode_user', JSON.stringify(user));
          set({ user, token: storedToken, isAuthenticated: true, hydrated: true });
          return;
        }
      }

      // If no valid stored token/user, reset state to unauthenticated
      localStorage.removeItem('accessToken');
      localStorage.removeItem('docnode_user');
      set({ user: null, token: null, isAuthenticated: false, hydrated: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        const storedToken = localStorage.getItem('accessToken');
        const storedUserRaw = localStorage.getItem('docnode_user');
        if (storedToken && storedUserRaw) {
          try {
            const storedUser = JSON.parse(storedUserRaw) as User;
            if (isUserRole(storedUser.role)) {
              set({
                user: storedUser,
                token: storedToken,
                isAuthenticated: true,
                hydrated: true,
              });
              return;
            }
          } catch {
            // Invalid persisted session is cleared below.
          }
        }
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('docnode_user');
      set({ user: null, token: null, isAuthenticated: false, hydrated: true });
    }
  },
}));

function isUserRole(value: unknown): value is UserRole {
  return (
    value === 'ADMIN' ||
    value === 'DOCTOR' ||
    value === 'NURSE' ||
    value === 'RECEPTIONIST' ||
    value === 'PATIENT'
  );
}
