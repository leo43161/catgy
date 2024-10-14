import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ limit, offset }) => `users?limit=${limit}&offset=${offset}`, // Agregamos limit y offset a la query string
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useGetUsersQuery } = userApi;
