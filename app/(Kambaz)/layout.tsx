import KambazNavigation from "./Navigation";
import "./styles.css";

export default function KambazLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="wd-kambaz">
      <KambazNavigation />
      <div className="wd-main-content-offset p-3">{children}</div>
    </div>
  );
}
