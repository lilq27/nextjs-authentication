'use client';
import Link from 'next/link';
import { useFormState } from 'react-dom';

import { auth } from '@/actions/auth-actions';
import { useState } from 'react';

export default function AuthForm({ mode }) { // 'login', 'signup'
  const [formState, fromAction] = useFormState(auth.bind(null, mode), {}); //bind 첫번째 인자는 this 값 => 사용 안하면 null
  
  return (
    <form id="auth-form" action={fromAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {formState.errors && (
        <ul id="form-errors">
          {Object.keys(formState.errors).map(error => (
            <li key={error}>{formState.errors[error]}</li>
          ))}
        </ul>
      )}
      <p>
        <button type="submit">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </p>
      <p>
        {mode === 'login' && <Link href="/?mode=signup">Create an account.</Link>}
        {mode === 'signup' && <Link href="/?mode=login">Login with existing account.</Link>}
      </p>
    </form>
  );
}
