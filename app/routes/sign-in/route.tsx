// export { loader } from "./functions/loader";
import { SignIn } from "@clerk/react-router";

export default function App() {
  return (
    <main className="max-w-2xl w-full mx-auto">
      <div className="w-full flex justify-center pt-10">
        <SignIn />
      </div>
    </main>
  );
}
