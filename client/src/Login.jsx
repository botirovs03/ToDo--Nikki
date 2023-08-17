import React from "react";
import "./Login.css"; 
function Login(props) {

  return (
    <div className="container">
      <div className="logo"></div>

      <div className="form">
        <span className="title">Login to Account</span>
        <span>organize your work</span>
        <form action="" method="">
          <label htmlFor="fname">Email</label>
          <input name="firstname" type="text" placeholder="Write your email here" />

          <label htmlFor="password">password</label>
          <input name="password" type="password" placeholder="Create a secure password" />

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
