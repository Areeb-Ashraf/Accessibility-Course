"use client";
import React from "react";
import '../styles/form.css'
import { useForm } from "react-hook-form"
import { LoginSchema, loginSchema } from "@/lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInUser } from "../actions/authAction";
import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

export default function LoginForm() {
    const { register, handleSubmit, formState: {isValid, errors} } = useForm<LoginSchema>( {
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
      });
      const router = useRouter();
      const onSubmit = async (data: LoginSchema) => {
        const result = await signInUser(data);
        console.log("result::: ", result);
        if (result.status === "success") {
          router.push("/members");
          // router.refresh();
        } else {
          console.error(result.error as string);
        }
      };
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
