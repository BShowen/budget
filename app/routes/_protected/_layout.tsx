import { Outlet } from "react-router";
import { SideNav } from "~/components/nav/SideNav";
export { loader } from "./_functions/loader";
export default function Route() {
  return (
    <div className="max-w-4xl mx-auto">
      <Outlet />
    </div>
  );
}
