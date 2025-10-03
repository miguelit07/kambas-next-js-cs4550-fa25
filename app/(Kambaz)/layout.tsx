import KambazNavigation from "./Navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

export default function KambazLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="wd-kambaz">
      <KambazNavigation />
      <div className="wd-main-content-offset flex-fill">{children}</div>
    </div>
  );
}
