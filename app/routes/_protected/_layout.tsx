import { Outlet } from "react-router";
export { loader } from "./_functions/loader";
export default function Route() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
