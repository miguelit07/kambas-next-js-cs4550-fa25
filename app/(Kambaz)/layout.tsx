"use client";
import KambazNavigation from "./Navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import store from "./store";
import { Provider } from "react-redux";
import Session from "./Account/Session";

export default function KambazLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <Session>
        <div id="wd-kambaz">
          <KambazNavigation />
          <div className="wd-main-content-offset flex-fill">{children}</div>
        </div>
      </Session>
    </Provider>
  );
}
