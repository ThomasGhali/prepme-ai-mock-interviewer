import { ReactNode } from 'react';
import Link from 'next/link';

import Logo from '@/public/logo.svg';
import Image from 'next/image';

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='root-layout'>
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
