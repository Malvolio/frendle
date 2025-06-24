import { FC, PropsWithChildren } from "react";

const PageTitle: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <div className="mb-8 w-7/12 mx-auto">
    <h1 className="font-peachy text-3xl font-bold text-[#373737] mb-2">{title}</h1>
    <p className="">{children}</p>
  </div>
);

export default PageTitle;
