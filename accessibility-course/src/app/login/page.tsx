import React from 'react'
import AuthLayout from '../components/AuthLayout';
import LoginForm from './loginForm';

export default function loginPage() {
  return (
    <>
      <AuthLayout>  
        <LoginForm/>
      </AuthLayout>  
    </>
  )
}
