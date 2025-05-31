import { FC, PropsWithChildren } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export const PublicLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[url('/bg-paper.png')] bg-repeat bg-auto">
    <Header />
    <main className="flex-1 pt-16">{children}</main>
    <Footer />
  </div>
);
