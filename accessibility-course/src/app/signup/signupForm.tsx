"use client";
import React from "react";
import '../styles/form.css'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, registerSchema } from "@/lib/schemas/RegisterSchema";
import { registerUser } from "../actions/authAction";

export default function SignupForm() {
    const { register, handleSubmit, setError, formState: {isValid, errors} } = useForm<RegisterSchema>( {
        resolver: zodResolver(registerSchema),
        mode: "onTouched",
      });
      const onSubmit = async (
        data: RegisterSchema
      ) => {
        const result = await registerUser(data);
        if (result.status === "success") {
          console.log("User registered successfully");
        } else {
          if (Array.isArray(result.error)) {
            result.error.forEach((e: any) => {
              console.log("e::: ", e);
              const fieldName = e.path.join(".") as
                | "email"
                | "name"
                | "password";
              setError(fieldName, {
                message: e.message,
              });
            });
          } else {
            setError("root.serverError", {
              message: result.error,
            });
          }
        }
      }
  return (
    <>
      <div className="form-container">
        <div className="form-title">Sign up</div>
        <form className="form-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-label">
            Name
            <input className="form-input" type="text" {...register("name")} aria-invalid={!!errors.name}/>
            {errors.name && <p className="form-error">{String(errors.name.message)}</p>}
          </label>
          <label className="form-label">
            Email
            <input className="form-input" type="text" {...register("email")} aria-invalid={!!errors.email}/>
            {errors.email && <p className="form-error">{String(errors.email.message)}</p>}
          </label>
          {/* <div className="passwords-container"> */}
            <label className="form-label">
                Password
                <input className="form-input" type="password" {...register("password")} aria-invalid={!!errors.password}/>
                {errors.password && <p className="form-error">{String(errors.password.message)}</p>}
            </label>
            {/* <label className="form-label">
                Confirm Password
                <input className="form-input" type="password" />
            </label> */}
          {/* </div> */}
          <button className="form-submit" type="submit" disabled={!isValid}>Sign up</button>
        </form>
        <div className="form-link-text">Have an account? <a href="/login">log in</a ></div>
      </div>
    </>
  );
}
