// Npm packages
import { Outlet } from "react-router";

// Loaders and Actions
export { loader } from "./_functions/loader";

// Components
import { BottomNav } from "~/components/nav/BottomNav";

export default function Route() {
  return (
    <div className="max-w-4xl mx-auto">
      <Outlet />
      <BottomNav />
    </div>
  );
}
