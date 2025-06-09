import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Users } from "lucide-react";

const AboutTeam = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="w-5 h-5 text-green-600" />
        Our Team
      </CardTitle>
      <CardDescription>Meet the people behind the product</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="text-center">
          <div className="mb-4 relative overflow-hidden rounded-lg">
            <img src="/michael.png" alt="Michael Lorton" className="w-full" />
          </div>
          <h3 className="text-xl font-semibold">Michael Lorton</h3>
          <p className="text-muted-foreground">Founder & CEO</p>
        </div>

        <div className="text-center">
          <div className="mb-4 relative overflow-hidden rounded-lg">
            <img src="/venessa.png" alt="Venessa Perez" className="w-full" />
          </div>
          <h3 className="text-xl font-semibold">Venessa Perez</h3>
          <p className="text-muted-foreground">Chief Product Officer</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AboutTeam;
