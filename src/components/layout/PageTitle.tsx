import { FC, PropsWithChildren } from "react";

const PageTitle: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <div className="mb-8 w-7/12 mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-600">{children}</p>
  </div>
);

export default PageTitle;
