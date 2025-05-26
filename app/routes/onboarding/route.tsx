// Loaders and Actions
export { loader } from "./functions/loader";

export default function Onboarding() {
  return (
    <main className="max-w-4xl mx-auto w-full pt-20">
      <div className="flex justify-center">
        <div className="flex flex-col">
          <h2>Setting up your account...</h2>
          <p className="text-secondary text-sm">You'll be redirected in just a moment.</p>
        </div>
      </div>
    </main>
  );
}
