import { Outlet } from "react-router";
export { loader } from "./_protected.loader";
export default function Route() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
