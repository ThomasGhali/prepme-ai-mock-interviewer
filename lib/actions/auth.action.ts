'use server';

import { auth, db } from '@/firebase/admin';
import { cookies } from 'next/headers';

const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

export const signUp = async (params: SignUpParams) => {
  const { uid, email, name } = params;

  try {
    const userRecord = await db.collection('users').doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: 'User already exists',
      };
    }
    db.collection('users').doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: 'User created successfully. You can now sign in.',
    };
  } catch (error: any) {
    console.error('Error creating new user: ', error);

    if (error.code === 'auth/email-already-exists') {
      return {
        success: false,
        message: 'The email provided is already in use',
      };
    }
  }
};

export const setSessionCookie = async (idToken: string) => {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK_IN_SECONDS * 1000, // one week in milli seconds
  });

  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_WEEK_IN_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
};

export const signIn = async (params: SignInParams) => {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: 'Unable to find user, sign up first.',
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: 'User signed in successfully.',
    };
  } catch (error) {
    console.error('Error signing in: ', error);

    return {
      success: false,
      message: 'Unable to sign in.',
    };
  }
};