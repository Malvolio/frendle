import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RoughNotation } from "react-rough-notation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  cancelSubscription,
  createCheckoutSession,
  getSubscription,
} from "@/lib/stripe";
import { useAuth } from "@/providers/auth-provider";
import { Subscription } from "@/types";
import { AlertCircle, BadgeCheck, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export function MembershipSection() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        const { data, error } = await getSubscription(user.id);

        if (error) throw error;

        if (data) {
          setSubscription(data);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const handleSubscribe = async () => {
    if (!user) return;

    setIsProcessing(true);

    try {
      // Premium plan price ID
      const priceId = "price_premium_monthly";

      const { url, error } = await createCheckoutSession(priceId, user.id);

      if (error) throw error;

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setIsProcessing(true);

    try {
      const { success, error } = await cancelSubscription(subscription.id);

      if (error) throw error;

      if (success) {
        toast({
          title: "Subscription canceled",
          description:
            "Your subscription will remain active until the end of the billing period.",
        });

        // Update subscription status
        setSubscription({
          ...subscription,
          cancelAtPeriodEnd: true,
        });
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="text-center m-auto items-center">
            <CardTitle className="flex items-center gap-2 mb-1">
              {/* <BadgeCheck className="w-5 h-5 text-green-600" /> */}
              <h1 className="m-auto">Membership</h1>
            </CardTitle>
            <CardDescription className="text-center">
              We ask for a small membership fee to help keep Frendle intentional, positive, and troll-free. Your contribution supports the community—and a percentage goes to charity.

            </CardDescription>
            <p className="font-bold text-red-700"> Note: was this placeholder or are you thinking there is tiered membership? "Upgrade to Premium for unlimited matches and exclusive features"</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : subscription?.status === "active" ? (
          <div className="space-y-4">



            <div className="gap-4 w-fit m-auto flex flex-col p-8 rounded-lg border-black border-2 ">
              <img src="/profile/membership.svg" alt="" className="m-auto w-[120px]" />
              <Alert className="bg-transparent w-fit m-auto">

                <div className=" flex flex-row gap-2 items-center pl-2 ">

                  <RoughNotation type="highlight" show={true} color="#F0D8A0">
                    <AlertTitle className="font-bold">Active Member</AlertTitle>
                  </RoughNotation>
                  <AlertDescription>
                    You have an active membership
                    {subscription.cancelAtPeriodEnd
                      ? ` that will end on ${formatDate(
                        subscription.currentPeriodEnd
                      )}`
                      : " that will automatically renew"}
                    .
                  </AlertDescription>
                </div>

              </Alert>
              <div >
                {/* <h4 className="text-sm font-medium mb-1">Current plan</h4> */}
                <p className="text-lg font-bold">Membership</p>
                <p>$9.95/month</p>
              </div>

              <div>
                {/* <h4 className="text-sm font-medium mb-1">Billing period</h4> */}
                <p className="text-lg font-bold">
                  {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"}
                </p>
                <p>
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            </div>

            {!subscription.cancelAtPeriodEnd && (
              <div className="m-auto text-center">
                <Button
                  variant="outline"
                  className="w-fit m-auto text-red-700 bg-transparent font-bold border-none"
                  onClick={handleCancelSubscription}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Cancel Membership"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="border rounded-lg p-6 transition-all hover:shadow-md">
                <h3 className="text-xl font-bold mb-2">Premium Membership</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Unlimited matching sessions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Priority matching with other premium members</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Access to exclusive conversation starters</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Personalized activity recommendations</span>
                  </li>
                </ul>
                <Button
                  className="w-full"
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Upgrade to Premium"}
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                By subscribing, you agree to our Terms of Service and Privacy
                Policy. You can cancel your subscription at any time.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <hr></hr>
      Your membership helps us:
      <ul>
        <li className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />Sustain and improve Frendle</li>
        <li className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />Fund moderators and tools</li>
        <li className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />Give back—20% of all fees will go to charity</li>
        <li className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />We believe in making the internet a little more human. If you do too, join us. 💛</li>
      </ul>
      <p className="font-bold text-red-700"> Note: Can we include the charity on this tab?</p>
      {/* <CardFooter className="border-t pt-6 flex flex-col items-start">
        <Alert variant="default" className="w-full bg-muted/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Contribution to charity</AlertTitle>
          <AlertDescription>
            20% of all Premium subscriptions go directly to your selected
            charity.
          </AlertDescription>
        </Alert>
      </CardFooter> */}
    </Card >
  );
}
