import { FC, PropsWithChildren } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export const PublicLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col min-h-screen h-full">
    {/* <div className="flex flex-col min-h-screen bg-black"> */}
    <Header />
    {/* VENESSA: I suspect this is what's causing the issue */}
    <main className="pt-16" id="MainContent">{children}</main>
    <Footer />
  </div>
);
