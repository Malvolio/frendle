import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Questionnaire from "./questionnaire";

const Inventory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 mb-2">
          {/* <ListChecks className="w-5 h-5 text-green-600" /> */}
          Pair up with people who just get you
        </CardTitle>

        <CardDescription>
          Answer a couple of questions so we can help find people who share your
          interests and values.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-96 mt-6">
          <Questionnaire />
        </div>
      </CardContent>
    </Card>
  );
};

export default Inventory;
