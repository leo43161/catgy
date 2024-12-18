import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ limit, offset }) => `users?limit=${limit}&offset=${offset}`,
    }),
    getUserLogin: builder.query({
      query: () => `users/login`, 
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
        body: JSON.stringify(credentials),
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
        credentials: 'include'
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useGetUsersQuery, useGetUserLoginQuery, useLogoutUserMutation } = userApi;
