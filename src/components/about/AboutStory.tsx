import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";

const AboutStory = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="w-5 h-5 text-green-600" />
        Our Story
      </CardTitle>
      <CardDescription>So far...</CardDescription>
    </CardHeader>
    <CardContent>
      <p>
        Frendle began when its founder, Bartholomew “Barty” Plim, accidentally
        dialed a wrong number and ended up having a 45-minute conversation with
        a retired beekeeper in Latvia. They talked about loneliness, honey, and
        the universal longing to be known. Inspired, the founder spent the next
        72 hours building the first version of Frendle — a platform designed to
        recreate the magic of accidental human connection, but with slightly
        better audio quality. The name “Frendle” came from a typo during a
        drug-addled late-night search for available domains, and ...
      </p>
      <p className="my-3">
        OK, none of that is true. The boring truth is, the two founders (see
        “Team”) read about the Bolt.new hackathon and wanted to win it. They
        (we) looked around for a socially important, solvable problem.
      </p>
      <p>And here we are.</p>
    </CardContent>
  </Card>
);

export default AboutStory;
