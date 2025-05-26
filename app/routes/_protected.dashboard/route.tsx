import { SignOutButton } from "@clerk/react-router";
export default function Route() {
  return (
    <main>
      <p>Dashboard</p>
      <SignOutButton>
        <button className="btn btn-sm btn-error">Sign out!</button>
      </SignOutButton>
    </main>
  );
}
