import React from "react";
import "./Login.css"; 

function Login(props) {
  const [remember, setRemember] = React.useState(false);
  const handleRememberChange = (event) => {
    setRemember(event.target.checked);
  };
  const handleSubmit = (event) => {
    // Prevent the default behavior of the form
    event.preventDefault();
    // Get the username and password from the form elements
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    // Call your login API with the username and password
    // If the login is successful, store the JWT token in localStorage or sessionStorage
    // depending on the value of the remember state variable
    // If the login fails, show an error message
  };
  

  return (
    <div className="container">
      <div className="logo"></div>

      <div className="form">
        <span className="title">Login to Account</span>
        <span>organize your work</span>
        <form action="" method="">
          <label htmlFor="fname">Email</label>
          <input name="firstname" type="text" placeholder="Write your email here" required />

          <label htmlFor="password">password</label>
          <input name="password" type="password" placeholder="Create a secure password" required />

          <div className="form-group">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={remember}
              onChange={handleRememberChange}
            />
            <label htmlFor="remember">Remember Me</label>
          </div>

          <button type="submit">Log In</button>
        </form>
        <span>
          Don't have an account?<a href="https://www.google.com">Create one</a>
        </span>
      </div>
    </div>
  );
}

export default Login;