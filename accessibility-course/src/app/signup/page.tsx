import React from 'react'
import AuthLayout from '../components/AuthLayout';
import SignupForm from './signupForm';

export default function signupPage() {
  return (
    <>
      <AuthLayout>
        <SignupForm/>
      </AuthLayout> 
    </>
  )
}
