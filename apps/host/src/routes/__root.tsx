import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "../components";

export const rootRoute = createRootRoute({
  component: () => (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  ),
});
