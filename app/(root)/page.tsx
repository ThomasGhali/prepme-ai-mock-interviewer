import RoboDude from '@/public/robot.png';

import { Button } from '@/components/ui/button';

import Link from 'next/link';
import Image from 'next/image';

import { dummyInterviews } from '@/constants';
import InterviewCard from '@/components/InterviewCard';

const page = () => {
  return (
    <div>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-2xl">
            Become interview-ready. Leverage AI to confidently claim your dream
            job.
          </h2>
          <p className="text-lg">
            Live mock interviews with tailored feedback. Let’s get you prepped.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an interview</Link>
          </Button>
        </div>

        <Image
          src={RoboDude}
          alt="Robot image"
          className="max-sm:hidden w-1/3"
        />
      </section>

      <section className="flex flex-col items-center gap-6 mt-8">
          <h2>Your Interviews</h2>

          <div className="interviews-section">
            {dummyInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))}
          </div>
      </section>

      <section className="flex flex-col items-center gap-6 mt-8">
        <h2>Take an Interview</h2>

        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default page;
