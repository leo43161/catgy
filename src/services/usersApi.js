// src/services/usersApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ limit, offset }) => `users?limit=${limit}&offset=${offset}`, // Agregamos limit y offset a la query string
    }),
  }),
});

// Exportar hooks para usar en los componentes
export const {
  useGetUsersQuery,
} = usersApi;