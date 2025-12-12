'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import Logo from '@/public/logo.svg';
import Image from 'next/image';

import Link from 'next/link';
import { toast } from 'sonner';
import FormField from '@/components/FormField';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { signIn, signUp } from '@/lib/actions/auth.action';

import { auth } from '@/firebase/client';

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const isSignIn = type === 'sign-in';

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success('Account created successfully, please sign in');
        router.push('/sign-in');
      } else {
        const { email, password } = values;

        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const idToken = await userCredentials.user.getIdToken();

        if (!idToken) {
          return {
            success: false,
            message: "User's token is false.",
          };
        }

        await signIn({ email, idToken });

        toast.success('Signed in successfully');
        router.push('/');
      }
    } catch (error) {
      toast.error(`There was an error: ${error}`);
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src={Logo} alt="Logo" />
          <h2 className="text-primary-100">PrepMe</h2>
        </div>

        <h3 className="text-[1.2rem]">Nail your job interview with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="e.g. johndoe@gmail.com"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your password"
              type="password"
            />

            <Button type="submit" className="btn">
              {isSignIn ? 'Sign in' : 'Create an account'}
            </Button>
          </form>
          <p className="text-center">
            {isSignIn ? 'No account yet?' : 'Have an account already?'}
            <Link
              href={isSignIn ? '/sign-up' : '/sign-in'}
              className="font-bold text-user-primary ml-1"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
