import { SignUp, useSignUp } from "@clerk/react-router";

export default function SignUpPage() {
  const signup = useSignUp();
  console.log(signup);
  return (
    <main className="max-w-7xl w-full mx-auto">
      <div className="w-full flex flex-row justify-center pt-10">
        <SignUp />
      </div>
    </main>
  );
}
