import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import Questionnaire from "./questionnaire";

const Inventory = () => {
  const { user } = useAuth();
  return (
    <Card className="w-11/12 md:w-7/12 m-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 mb-2">
          {/* <ListChecks className="w-5 h-5 text-green-600" /> */}
          Pair-up with people who just get you
        </CardTitle>

        <CardDescription>
          Answer some questions so we can help find people who share your
          interests and values. You don’t have to answer them all, but the more
          you answer, the better the matches we can find you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-96 mt-6 m-auto justify-center flex">
          {user && <Questionnaire userId={user.auth.id} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default Inventory;
