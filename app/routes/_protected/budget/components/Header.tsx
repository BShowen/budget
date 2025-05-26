// Components
import { Slider } from "./Slider";
import { SignOutButton } from "@clerk/react-router";

// Icons
import { LogoutIcon } from "~/components/icons";

type Params = {
  activeTab: "Planned" | "Spent" | "Remaining";
  setActiveTab: (arg0: "Planned" | "Spent" | "Remaining") => void;
};

export function Header({ activeTab, setActiveTab }: Params) {
  return (
    // h-[calc(96px+env(safe-area-inset-top))] <---- This sets the height correctly on mobile web browsers and in PWA mode. 96px is the same as "h-24"
    <header className="h-[calc(96px+env(safe-area-inset-top))] bg-primary text-base-content fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] border-b border-base-200 dark:border-base-300 flex items-center rounded-b-box md:rounded-b-none">
      <div className="max-w-7xl w-full h-full mx-auto flex flex-col pt-2 justify-between">
        <div className="grid grid-cols-4">
          <div className="col-start-1 col-end-2 px-4">
            <div className="flex flex-row justify-start items-center">
              <SignOutButton>
                <button className="btn btn-square btn-sm btn-primary">
                  <LogoutIcon className="rotate-180" size={20} />
                </button>
              </SignOutButton>
            </div>
          </div>
          <div className="col-start-2 col-end-4">
            <div className="h-full flex flex-row justify-center items-center">
              <h1>Dough Tracker</h1>
            </div>
          </div>
        </div>
        <div className="w-full md:max-w-2xl md:mx-auto px-2 pb-2">
          <Slider active={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </header>
  );
}
