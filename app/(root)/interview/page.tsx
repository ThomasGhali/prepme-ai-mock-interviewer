import Agent from "@/components/Agent";

const InterviewPage = () => {
    return (
      <>
        <h3>Interview Generation</h3>

        <Agent userName="you" userId="user1" type="generate" />
      </>
    );
};

export default InterviewPage