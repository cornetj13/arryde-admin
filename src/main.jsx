import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx';
import { useApollo } from './hooks';
import './index.css';

function Root() {
  const client = useApollo();

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </ApolloProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
