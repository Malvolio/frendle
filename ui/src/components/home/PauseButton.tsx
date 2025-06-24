import usePause from "@/hooks/usePause";
import { Button } from "../ui/button";

const PauseButton = () => {
  const { eligible, data: paused, togglePause, loading: ploading } = usePause();

  return (
    eligible && (
      <Button disabled={ploading} onClick={togglePause} className="w-44">
        {ploading ? "..." : paused ? "Unpause matches" : "Pause matches"}
      </Button>
    )
  );
};

export default PauseButton;
