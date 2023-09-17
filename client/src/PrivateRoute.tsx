import React, { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
// import { getToken } from '../public/user.js'

type PrivateRouteProps = {
    // your own props here
};

// A custom hook that gets the user from localStorage
const useAuth = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Get the user from localStorage
    const user = localStorage.getItem("token");
    // Parse the user object
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return user;
};

// A component that renders its children if the user is logged in
// or redirects to the /login page otherwise
export const PrivateRoute = ({ children }: PropsWithChildren<PrivateRouteProps>) => {
  const user = useAuth();
  const location = useLocation();

  // If the user is not logged in, redirect to the /login page
  // and preserve the current location in the state
  if (!user) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // If the user is logged in and localStorage has "user" as a key, redirect to the "/" (root) component
  if (localStorage.getItem("user") !== null) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the children components
  return children;
};
