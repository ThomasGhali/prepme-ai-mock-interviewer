import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewPage = async () => {
  const user = await getCurrentUser();

  console.log('username from interview page:', user?.name);
  console.log('userid from interview page:', user?.id);

    return (
      <>
        <h3>Interview Generation</h3>

        <Agent userName={user?.name!} userId={user?.id} type="generate" />
      </>
    );
};

export default InterviewPage