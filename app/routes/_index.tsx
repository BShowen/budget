import { Link } from "react-router";
export default function Route() {
  return (
    <main className="max-w-7xl w-full mx-auto">
      <div className="flex justify-center pt-10">
        <h1>Welcome to Dough Tracker</h1>
      </div>
      <div className="flex flex-col items-center">
        <p>
          Please{" "}
          <Link className="underline text-accent" to={"/sign-in"}>
            sign in
          </Link>{" "}
          or{" "}
          <Link className="underline text-accent" to={"/sign-up"}>
            sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
