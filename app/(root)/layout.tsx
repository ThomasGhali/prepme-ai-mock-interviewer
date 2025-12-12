import { ReactNode } from 'react';
import Link from 'next/link';

import Logo from '@/public/logo.svg';
import Image from 'next/image';
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthinticated = await isAuthenticated();

  if (!isUserAuthinticated) {
    return redirect('/sign-in');
  }

  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" />
          <h2 className="text-primary-100">PrepMe</h2>
        </Link>
      </nav>

      {children}
    </div>
  );
};

export default HomeLayout;
