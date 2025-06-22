import { FC, PropsWithChildren } from "react";

const TextBlock: FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="min-h-screen">
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">{children}</div>
    </div>
  </div>
);

export default TextBlock;
