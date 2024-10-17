// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    user: null,
  }, // Cambiado a 'null' para indicar que no hay usuario por defecto
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.value.user = action.payload; // Guardar el usuario completo
    },
    clearUser(state) {
      state.value.user = null; // Limpiar el usuario
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
