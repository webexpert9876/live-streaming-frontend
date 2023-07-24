import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';

export const client = new ApolloClient({
        uri: 'https://tattoo-live-streaming-api-server.onrender.com/graphql',
        cache: new InMemoryCache(),
    });
    // var results;
    // client.query({
    //     query: gql`
    //           ${gqlQuery}
    //       `,
    //   })
    //     .then((result) => {
    //     //   setChannelData(result.data.channels)
    //         // console.log(result);
    //         // const data = new Promise(resolve => {
    //         //     resolve(result.data)
    //         // })
    //     //   return result.data
    //       results = result.data
    //     });
    // return results