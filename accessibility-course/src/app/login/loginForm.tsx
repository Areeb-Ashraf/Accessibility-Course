"use client";
import React from "react";
import '../styles/form.css'
import { useForm } from "react-hook-form"
import { LoginSchema, loginSchema } from "@/lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
    const { register, handleSubmit, formState: {isValid, errors} } = useForm<LoginSchema>( {
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
      });
    const onSubmit = (data: LoginSchema) => console.log(data);
  return (
    <>
      <div className="form-container">
        <div className="form-title">Log in</div>
        <form className="form-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-label">
            Email
            <input className="form-input" type="text" {...register("email")}  aria-invalid={!!errors.email}/>
            {errors.email && <p className="form-error">{String(errors.email.message)}</p>}
          </label>
          <label className="form-label">
            Password
            <input className="form-input" type="password" {...register("password")} aria-invalid={!!errors.password}/>
            {errors.password && <p className="form-error">{String(errors.password.message)}</p>}
          </label>
          <button className="form-submit" type="submit" disabled={!isValid}>Log in</button>
        </form>
        <div className="form-link-text">Need an account? <a href="/signup">Sign up</a ></div>
      </div>
    </>
  );
}
