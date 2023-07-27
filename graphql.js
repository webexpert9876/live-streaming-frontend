import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://tattoo-live-streaming-api-server.onrender.com/graphql',
    cache: new InMemoryCache(),
});
export default client;