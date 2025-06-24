import useGetSessions from "@/hooks/useGetSessions";
import { useAuth } from "@/providers/auth-provider";
import Spinner from "../Spinner";
import { NoPairUps } from "./NoPairUps";
import PairUps from "./PairUps";
import PausedHome from "./PausedHome";

const GoodHome = () => {
  const { loading, data: sessions, error } = useGetSessions();
  const { user } = useAuth();
  const membership_status = user?.system_profile.membership_status;

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading sessions: {error}.
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return membership_status === "paused" ? <PausedHome /> : <NoPairUps />;
  }
  return (
    <PairUps sessions={sessions} isPaused={membership_status === "paused"} />
  );
};
export default GoodHome;
