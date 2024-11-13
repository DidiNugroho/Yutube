import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

const httpLink = createHttpLink({
  uri: 'https://yutube-1l95.onrender.com', 
});

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync("access_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", 
    }
  };
});

// Create the Apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink), 
  cache: new InMemoryCache(),
});

export default client;
