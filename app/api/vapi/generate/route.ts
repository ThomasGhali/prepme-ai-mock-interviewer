import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { getRandomInterviewCover } from '@/lib/utils';
import { db } from '@/firebase/admin';

export const GET = async () => {
  return Response.json({ success: true, data: 'thanks' }, { status: 200 });
};

export const POST = async (request: Request) => {
  const parsedRequest = await request.json();
  const { type, role, level, techstack, amount, userid } = parsedRequest;

  try {
    const { text: questions } = await generateText({
      model: google('gemma-3-27b-it'),
      prompt: `Prepare questions for a job interview.
      the job role is ${role}.
      the job experience level is ${level}.
      the tech stack used in the job is ${techstack}.
      the focus between behavioural and technical questions should lean towards: ${type}.
      the amount of questions required is ${amount}.
      please return only the questions without any additional text.
      the questions are going to be read by a voice assistant so donot use "/" or "*" or any special characters that might break the voice assistant.
      return the questions fromatted like this:
      ["Question 1", "Question 2", "Question 3"]
      `,
    });

    console.log(
      'sent body:',
      `type: ${type}`,
      `request: ${JSON.stringify(parsedRequest, null, 2)}`,
      `role: ${role}`,
      `level: ${level}`,
      `techstack: ${techstack}`,
      `amount: ${amount}`,
      `userid: ${userid}`,
    );

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(','),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection('interviews').add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);

    return Response.json({ success: false, error }, { status: 500 });
  }
};
