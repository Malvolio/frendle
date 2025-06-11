import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListChecks } from "lucide-react";
import Questionnaire from "./questionnaire";

const Inventory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-green-600" />
          Let’s pair up with people who just get you
        </CardTitle>

        <CardDescription>
          We’ll help you find people who share your interests and values.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-96">
          <Questionnaire />
        </div>
      </CardContent>
    </Card>
  );
};

export default Inventory;
