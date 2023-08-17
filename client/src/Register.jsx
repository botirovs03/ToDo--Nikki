import React from 'react';
import './Register.css';

function Register() {
  return (
    <div className="container">
      <div className="logo"></div>

      <div className="form">
        <span className="title">Create your account</span>
        <span>organize your work</span>
        <form action="" method="">
          <label htmlFor="fname">first name</label>
          <input name="firstname" type="text" placeholder="Write your first name"/>

          <label htmlFor="lname">last name</label>
          <input name="lastname" type="text" placeholder="Write your last name"/>

          <label htmlFor="email">email address</label>
          <input name="email" type="mail" placeholder="Enter your email"/>

          <label htmlFor="password">password</label>
          <input name="password" type="password" placeholder="Create a secure password"/>

          <label htmlFor="rpassword">repeat password</label>
          <input name="rpassword" type="password" placeholder="Write password one more time"/>

          <button type="submit">Create account</button>
        </form>
        <span>Already have an account?<a href="[1]">Log in</a></span>
      </div>
    </div>
  );
}

export default Register;
