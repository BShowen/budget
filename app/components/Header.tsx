// Utils
import { capitalize } from "~/utils/functions/capitalize";

// Components
import { BackButton } from "./BackButton";

export function Header({
  title,
  children,
  secondaryIcon,
  hideBackButton,
}: {
  hideBackButton?: boolean;
  title: string;
  children?: React.ReactNode;
  secondaryIcon?: React.ReactNode;
}) {
  return (
    // h-[calc(64px+env(safe-area-inset-top))] <---- This sets the height correctly on mobile web browsers and in PWA mode. 64px is the same as "h-16"
    <header className="h-[calc(64px+env(safe-area-inset-top))] bg-base-100 text-base-content fixed top-0 left-0 lg:left-64 right-0 z-50 pt-[env(safe-area-inset-top)] border-b border-base-200 dark:border-base-300 flex items-center">
      <div className="grid grid-cols-6 max-w-7xl w-full h-full mx-auto">
        <div className="col-start-1 col-end-2 flex justify-center items-center">
          {!hideBackButton && <BackButton />}
        </div>
        <div className="col-start-2 col-end-6 flex flex-col justify-center items-center">
          <h2 className="truncate max-w-[20ch] lg:max-w-[40ch]">{capitalize(title)}</h2>
          {children}
        </div>
        <div className="col-start-6 col-end-7 flex justify-center items-center">{secondaryIcon}</div>
      </div>
    </header>
  );
}
