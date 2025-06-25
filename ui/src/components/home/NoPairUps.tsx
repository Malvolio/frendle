import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { Link } from "@tanstack/react-router";
import Spinner from "../Spinner";
import { useAvailability } from "./AvailabilityProvider";

export const WorkingOnIt = () => (
  <div className="text-center text-gray-500 w-60">
    <div>We’re working on getting you some pair-ups.</div>
    <img
      src="/home/fred-cal.png"
      alt="Fred the Frendle mascot with a calendare"
      className="w-60 mx-auto mb-4"
    />
    <div>
      Sometimes schedules may not line up, if you’re still getting this message
      after a couple of days consider adding more{" "}
      <Link to="/" hash="availability" className="font-bold underline">
        availability
      </Link>
      .
    </div>
  </div>
);

const Reasons = ({
  noAvailability,
  noTimezone,
}: {
  noAvailability: boolean;
  noTimezone: boolean;
}) => (
  <>
    <div>Here’s what to do to get pair-ups going!</div>
    <ul>
      <li
        className={cn("list-disc list-inside", {
          "line-through": !noAvailability,
        })}
      >
        Add your{" "}
        <Link
          to="/"
          hash="availability"
          className="font-bold underline"
          disabled={!noAvailability}
        >
          availabilities
        </Link>
      </li>
      <li
        className={cn("list-disc list-inside", {
          "line-through": !noTimezone,
        })}
      >
        Set your{" "}
        <Link
          to="/"
          hash="availability"
          className="font-bold underline"
          disabled={!noTimezone}
        >
          timezone
        </Link>
      </li>
    </ul>
  </>
);
`

▢  availability to get pairs ups going!
▢ Purchase a subscription
▢ Update your payment info`;
export const NoPairUps = () => {
  const { user } = useAuth();
  const { data, loading } = useAvailability();

  if (loading) {
    return <Spinner />;
  }
  const hasAvailability = data && data.size > 0;
  const hasTimezone = user?.private_profile.timezone;

  return hasAvailability && hasTimezone ? (
    <WorkingOnIt />
  ) : (
    <Reasons noAvailability={!hasAvailability} noTimezone={!hasTimezone} />
  );
};
