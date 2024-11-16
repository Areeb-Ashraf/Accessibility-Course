import React from "react";
import '../styles/form.css'

export default function LoginForm() {
  return (
    <>
      <div className="form-container">
        <div className="form-title">Log in</div>
        <form className="form-form">
          <label className="form-label">
            Email
            <input className="form-input" type="text" />
          </label>
          <label className="form-label">
            Password
            <input className="form-input" type="password" />
          </label>
          <button className="form-submit" type="submit">Submit</button>
        </form>
        <div className="form-link-text">Need an account? <a href="/signup">Sign up</a ></div>
      </div>
    </>
  );
}
