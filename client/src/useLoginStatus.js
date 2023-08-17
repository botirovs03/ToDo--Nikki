// This is a custom hook that checks the loginStatus from localStorage
// and returns a boolean value indicating if the user has logged in before
function useLoginStatus() {
    const [loginStatus, setLoginStatus] = React.useState(false);
  
    React.useEffect(() => {
      // Get the loginStatus from localStorage
      const status = localStorage.getItem("loginStatus");
      // If the status is "true", set the loginStatus state to true
      if (status === "true") {
        setLoginStatus(true);
      }
    }, []);
  
    return loginStatus;
  }
  // This is a custom hook that checks the loginStatus from localStorage
// and returns a boolean value indicating if the user has logged in before
function useLoginStatus() {
  const [loginStatus, setLoginStatus] = React.useState(false);

  React.useEffect(() => {
    // Get the loginStatus from localStorage
    const status = localStorage.getItem("loginStatus");
    // If the status is "true", set the loginStatus state to true
    if (status === "true") {
      setLoginStatus(true);
    }
  }, []);

  return loginStatus;
}

// This is a component that renders the login page or redirects to another page
// depending on the loginStatus
function LoginPage(props) {
  // Get the loginStatus from the custom hook
  const loginStatus = useLoginStatus();

  // If the user has logged in before, redirect to another page
  if (loginStatus) {
    return <Redirect to="/another-page" />;
  }

  // Otherwise, render the login page
  return (
    <div className="login-page">
      <h1>Login</h1>
      {/* Add your login form here */}
    </div>
  );
}

  // This is a component that renders the login page or redirects to another page
  // depending on the loginStatus
  function LoginPage(props) {
    // Get the loginStatus from the custom hook
    const loginStatus = useLoginStatus();
  
    // If the user has logged in before, redirect to another page
    if (loginStatus) {
      return <Redirect to="/login" />;
    }
  
    // Otherwise, render the login page
    return (
      <div className="login-page">
        <h1>Login</h1>
        {/* Add your login form here */}
      </div>
    );
  }
  