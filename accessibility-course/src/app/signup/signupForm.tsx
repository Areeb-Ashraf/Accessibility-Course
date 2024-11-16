import React from "react";
import '../styles/form.css'

export default function SignupForm() {
  return (
    <>
      <div className="form-container">
        <div className="form-title">Sign up</div>
        <form className="form-form">
          <label className="form-label">
            Name
            <input className="form-input" type="text" />
          </label>
          <label className="form-label">
            Email
            <input className="form-input" type="text" />
          </label>
          <div className="passwords-container">
            <label className="form-label">
                Password
                <input className="form-input" type="password" />
            </label>
            <label className="form-label">
                Confirm Password
                <input className="form-input" type="password" />
            </label>
          </div>
          <button className="form-submit" type="submit">Submit</button>
        </form>
        <div className="form-link-text">Have an account? <a href="/login">log in</a ></div>
      </div>
    </>
  );
}
