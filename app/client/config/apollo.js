import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://bb9e-139-193-179-119.ngrok-free.app',
    cache: new InMemoryCache(),
  });

export default client;