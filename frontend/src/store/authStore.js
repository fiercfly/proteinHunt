import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user:    null,
  token:   localStorage.getItem('dp_token') || null,
  ready:   false,

  setAuth: ({ user, token }) => {
    localStorage.setItem('dp_token', token);
    set({ user, token });
  },
  setUser:  (user)  => set({ user }),
  setReady: ()      => set({ ready: true }),
  logout:   ()      => {
    localStorage.removeItem('dp_token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;