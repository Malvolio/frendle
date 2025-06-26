import useFreeTrial from "@/hooks/useFreeTrial";
import { useState } from "react";

const UnpaidHome = () => {
  const [error, setError] = useState<string | null>(null);
  const startFreeTrial = useFreeTrial();
  const onClick = async () => {
    setError(null);
    const reload = await startFreeTrial();
    if (reload) {
      reload();
    } else {
      setError("Failed to start free trial. Please try again later.");
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center w-80 text-center p-3">
        <div>
          For a limited time, we are offering a free trial of Frendle. Press the
          button below to start your free trial.
        </div>
        <button
          onClick={onClick}
          className="bg-blue-500 text-white px-4 py-2 my-8 rounded hover:bg-green-600"
        >
          Start Free Trial
        </button>
        <div className="text-red-500 py-2">{error}</div>
      </div>
    </>
  );
};
export default UnpaidHome;
