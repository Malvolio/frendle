import { FC, PropsWithChildren } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export const PublicLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[url('background.jpg')] bg-repeat">
    {/* <div className="flex flex-col min-h-screen bg-black"> */}
    <Header />
    <main className="flex-1 pt-16">{children}</main>
    <Footer />
  </div>
);
