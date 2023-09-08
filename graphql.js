import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL,
    cache: new InMemoryCache(),
});
export default client;