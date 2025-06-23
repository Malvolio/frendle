import useGetSessions from "@/hooks/useGetSessions";
import { Link } from "@tanstack/react-router";
import PairUps from "./PairUps";

const NoPairUps = () => (
  <div className="text-center text-gray-500 w-60">
    <h1 className="text-3xl font-bold text-gray-900 mb-2 font-peachy">
      Pair-ups
    </h1>
    <div>We’re working on getting you some pair-ups.</div>
    <img
      src="/home/fred-cal.png"
      alt="Fred the Frendle mascot with a calendare"
      className="w-60 mx-auto mb-4"
    />
    <div>
      Sometimes schedules may not line up, if you’re still getting this message
      after a couple of days consider adding more{" "}
      <Link to="/profile" hash="availability" className="font-bold underline">
        availability
      </Link>
      .
    </div>
  </div>
);
const GoodHome = () => {
  const { loading, data: sessions, error } = useGetSessions();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
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
