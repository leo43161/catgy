// src/services/shopApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { realtime_database_url } from '@/dataBase/firebaseConfig';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({ baseUrl: realtime_database_url }),
  endpoints: (builder) => ({
    // Obtener todas las categorías
    getCategories: builder.query({
      query: () => 'categories.json',
    }),

    // Obtener todos los productos
    getProducts: builder.query({
      query: () => 'products.json',
    }),

    // Obtener todos los productos con las categorías completas
    getProductsWithCategories: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {

        // Consultar productos y categorías simultáneamente
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetchWithBQ('products.json'),
          fetchWithBQ('categories.json'),
        ]);

        // Verificar que ambas respuestas sean exitosas
        if (productsResponse.error) return { error: productsResponse.error };
        if (categoriesResponse.error) return { error: categoriesResponse.error };

        // Convertir respuestas a objetos utilizables
        const products = Object.values(productsResponse.data);
        const categories = Object.values(categoriesResponse.data);

        // Mapear productos con categorías
        const productsWithCategories = products.map((product) => {
          const productCategories = product.categoryIDs.map((categoryID) =>
            categories.find((category) => category.categoryID === categoryID)
          );
          return { ...product, categories: productCategories };
        });

        // Devolver los productos con las categorías completas
        return { data: productsWithCategories };
      },
    }),

    // Obtener productos por ID de categoría
    getProductsByCategory: builder.query({
      query: (categoryID) => `products.json?orderBy="categoryIDs"&equalTo="${categoryID}"`,
      transformResponse: (response) => {
        const productsTransformed = Object.values(response);
        return productsTransformed;
      },
    }),

    // Obtener producto por ID
    getProductById: builder.query({
      query: (productId) => `products.json?orderBy="productID"&equalTo="${productId}"`,
      transformResponse: (response) => {
        const productTransformed = Object.values(response).pop();
        return productTransformed;
      },
    }),

    // Obtener la configuración de vista según el userID
    getConfigView: builder.query({
      query: (userId) => `config_view.json?orderBy="idUser"&equalTo="${userId}"`,
      transformResponse: (response) => {
        const configTransformed = Object.values(response).pop();
        return configTransformed;
      },
    }),
  }),
});

// Exportar hooks para usar en los componentes
export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductByIdQuery,
  useGetConfigViewQuery,
  useGetProductsWithCategoriesQuery
} = shopApi;