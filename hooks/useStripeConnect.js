import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";

export const useStripeConnect = (connectedAccountId) => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState();

  useEffect(() => {
    if (connectedAccountId) {
      const fetchClientSecret = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/create/connected/account/session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account: connectedAccountId,
          }),
        });

        if (!response.ok) {
          // Handle errors on the client side here
          const { error } = await response.json();
          throw ("An error occurred: ", error);
        } else {
          const { client_secret: clientSecret } = await response.json();
          return clientSecret;
        }
      };

      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey: "pk_test_51PMP4BLhsqLL49rZF55H8PhhtEaRVbtadTTHAMMuJ6inN6FfTk0ZOr7XPFrY8WeZOoJ6TWvuWartAroCkXur7QwL00sPp8tzfM",
          fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#070c27",
              colorBackground: "#fff",
            },
          },
        })
      );
    }
  }, [connectedAccountId]);

  return stripeConnectInstance;
};

export default useStripeConnect;