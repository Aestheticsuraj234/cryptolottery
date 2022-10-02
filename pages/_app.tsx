import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import "../styles/globals.css";
import { Toaster } from 'react-hot-toast';

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp