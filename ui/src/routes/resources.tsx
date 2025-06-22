import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

interface Resource {
  title: string;
  description: string;
  link: string;
  type: "article" | "video" | "podcast" | "book";
  tags: string[];
}
export const Route = createFileRoute("/resources")({
  component: () => {
    const resources: Resource[] = [
      {
        title: "The Science of Social Connection",
        description:
          "An in-depth look at how social connections impact our mental and physical health.",
        link: "https://example.com/social-connection-science",
        type: "article",
        tags: ["research", "health", "psychology"],
      },
      {
        title: "Building Meaningful Relationships in a Digital Age",
        description:
          "Strategies for cultivating authentic connections despite the challenges of modern technology.",
        link: "https://example.com/digital-relationships",
        type: "article",
        tags: ["technology", "relationships", "practical"],
      },
      {
        title: "The Power of Vulnerability in Conversation",
        description:
          "A renowned TED talk about how vulnerability is the key to deeper connections.",
        link: "https://example.com/vulnerability-talk",
        type: "video",
        tags: ["communication", "emotional intelligence", "psychology"],
      },
      {
        title: "Conversation Starters That Create Connection",
        description:
          "Practical questions and prompts to move beyond small talk.",
        link: "https://example.com/conversation-starters",
        type: "article",
        tags: ["communication", "practical", "beginners"],
      },
      {
        title: "The Neuroscience of Human Connection",
        description:
          "How our brains are wired for social interaction and what happens when we connect.",
        link: "https://example.com/neuroscience-connection",
        type: "video",
        tags: ["science", "research", "neuroscience"],
      },
      {
        title: "Connected: The Surprising Power of Our Social Networks",
        description:
          "A fascinating book about how social networks influence our lives in unexpected ways.",
        link: "https://example.com/connected-book",
        type: "book",
        tags: ["networks", "sociology", "research"],
      },
      {
        title: "Building Community in Fragmented Times",
        description:
          "A thoughtful podcast exploring how to rebuild community bonds in modern society.",
        link: "https://example.com/community-podcast",
        type: "podcast",
        tags: ["community", "society", "practical"],
      },
      {
        title: "Social Skills: A Comprehensive Guide",
        description:
          "Evidence-based techniques for improving social interactions and building relationships.",
        link: "https://example.com/social-skills-guide",
        type: "article",
        tags: ["skills", "practical", "beginners"],
      },
    ];

    return (
      <PublicLayout>
        <div className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl font-bold mb-6">
                Resources on Social Connection
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We've curated these resources to help you learn more about the
                importance of social connection and how to build meaningful
                relationships.
              </p>
            </div>

            <Tabs defaultValue="all" className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-5 w-full max-w-xl">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="article">Articles</TabsTrigger>
                  <TabsTrigger value="video">Videos</TabsTrigger>
                  <TabsTrigger value="podcast">Podcasts</TabsTrigger>
                  <TabsTrigger value="book">Books</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resources.map((resource, index) => (
                    <ResourceCard key={index} resource={resource} />
                  ))}
                </div>
              </TabsContent>
              {["article", "video", "podcast", "book"].map((type) => (
                <TabsContent key={type} value={type} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources
                      .filter((resource) => resource.type === type)
                      .map((resource, index) => (
                        <ResourceCard key={index} resource={resource} />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="max-w-2xl mx-auto mt-20 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Have a Resource to Suggest?
              </h2>
              <p className="text-muted-foreground mb-6">
                We're always looking to expand our resource library. If you have
                a suggestion for a helpful article, video, podcast, or book
                about social connection, we'd love to hear from you.
              </p>
              <Button variant="outline">Suggest a Resource</Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  },
});

interface ResourceCardProps {
  resource: Resource;
}

function ResourceCard({ resource }: ResourceCardProps) {
  const typeIcon = {
    article: "📄",
    video: "🎬",
    podcast: "🎙️",
    book: "📚",
  }[resource.type];

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{resource.title}</CardTitle>
            <CardDescription className="mt-2">
              {resource.description}
            </CardDescription>
          </div>
          <div className="text-2xl" aria-hidden="true">
            {typeIcon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="px-2 py-1">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            <span className="flex items-center gap-2">
              View Resource <ExternalLink className="h-4 w-4" />
            </span>
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
