import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  cancelSubscription,
  createCheckoutSession,
  getSubscription,
} from "@/lib/stripe";
import { useAuth } from "@/providers/auth-provider";
import { Subscription } from "@/types";
import { CheckCircle2 } from "lucide-react";
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
        const { data, error } = await getSubscription(user.auth.id);

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

      const { url, error } = await createCheckoutSession(priceId, user.auth.id);

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
              {/* <h1 className="m-auto text-5xl">Membership</h1> */}
            </CardTitle>
            {/* <CardDescription className="text-center">
              We ask for a small membership fee to help keep Frendle
              intentional, positive, and troll-free. Your contribution supports
              the community—and a percentage goes to charity.
            </CardDescription> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : subscription?.status === "active" ? (
          <div>
            <div className="relative bg-[#FFFDFA] pb-4 rotate-2 m-auto flex flex-col border-2 border-black   border-b-8 border-r-8 border-b-black/70 border-r-black/70 rounded-xl md:max-w-2xl ">
              <div className="text-center bg-[#FDBE7C] font-bold text-sm leading-loose py-1 rounded-t-md mt-1 mx-1 text-[#914D06]">
                SUPPORTING MEMBER
              </div>
              <div className="gap-6 px-6 space-y-0 ">
                <img
                  src="/home/membership_1.svg"
                  alt=""
                  className="m-auto w-[100px] mt-3 mb-0"
                />

                <p className="text-5xl font-peachy m-auto -my-4 uppercase">
                  {user?.public_profile.name || "[Name]"}
                </p>
                <Alert className="bg-transparent w-fit m-auto border-none mt-0">
                  {user?.system_profile.created_at && (
                    <AlertTitle className="text-1xl w-fit m-auto">
                      ➡ Member since{" "}
                      {new Date(
                        user.system_profile.created_at
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        // day: "numeric",
                      })}{" "}
                      ⬅
                    </AlertTitle>
                  )}
                </Alert>
                <div className="rounded-lg border border-gray-200 gap-0 h-auto flex flex-col justify-normal p-6  ">
                  <div className="p-0 m-0 flex flex-col justify-around gap-2">
                    <div className="flex flex-row gap-4 p-0 m-0 h-auto align-left justify-start items-center ">
                      <p className="leading-none m-0">
                        Membership: $9.95/month
                      </p>

                      {!subscription.cancelAtPeriodEnd && (
                        <Button
                          className=" text-red-700 bg-transparent font-bold border-none shadow-none text-left w-9 border-8 "
                          onClick={handleCancelSubscription}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Cancel"}
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-row gap-2 ">
                      <p className="leading-none m-0">
                        {subscription.cancelAtPeriodEnd
                          ? "Ends:"
                          : "Auto-renews:"}{" "}
                        &nbsp;
                        {formatDate(subscription.currentPeriodEnd)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
      {/* May want this for people who have not signed up */}
      {/* Your membership helps us:
      <ul>
        <li className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
          Sustain and improve Frendle
        </li>
        <li className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
          Fund moderators and tools
        </li>
        <li className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
          Give back—20% of all fees will go to charity
        </li>
        <li className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
          We believe in making the internet a little more human. If you do too,
          join us. 💛
        </li>
      </ul> */}
    </Card>
  );
}
