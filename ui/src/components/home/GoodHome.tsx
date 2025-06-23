import useGetSessions from "@/hooks/useGetSessions";
import Spinner from "../Spinner";
import { NoPairUps } from "./NoPairUps";
import PairUps from "./PairUps";

const GoodHome = () => {
  const { loading, data: sessions, error } = useGetSessions();
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
    return <NoPairUps />;
  }
  return <PairUps sessions={sessions} />;
};
export default GoodHome;
