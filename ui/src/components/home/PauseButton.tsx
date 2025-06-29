import usePause from "@/hooks/usePause";
import { Button } from "../ui/button";

const PauseButton = () => {
  const { eligible, data: paused, togglePause, loading: ploading } = usePause();

  return (
    eligible && (
      <Button disabled={ploading} onClick={togglePause} className=" bg-[#373737]">
        {ploading ? "..." : paused ? "Unpause matches" : "Pause matches"}
      </Button>
    )
  );
};

export default PauseButton;
