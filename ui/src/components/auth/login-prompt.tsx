import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignInWithGoogle } from "@/providers/auth-provider";
import { Video } from "lucide-react";

export function LoginPrompt() {
  const { handleGoogleSignIn, isLoading } = useSignInWithGoogle();

  return (
    <div className="max-w-6xl mx-auto border text-[#37251E]  border-black border-b-8 border-r-8 border-b-black/70 border-r-black/70 rounded-2xl overflow-visible justify-center mt-12">
      <div className="w-full max-w-md p-4">
        <Card className="overflow-hidden border-none animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              {/* <Video className="h-12 w-12 text-primary" /> */}
              <img src="login/hero_image.png" alt="video, promps, light co-op games" width={"125px"} height={"88px"} className="inline-block mr-2" />
            </div>
            <CardTitle className="text-2xl text-[#37251E]">
              <p className="m-0 font-normal">Welcome to</p>
              <img src="/lib/logo.png" alt="Logo" width={"200px"} className="inline-block mr-2" />
            </CardTitle>
            <CardDescription>
              Create connections, make friends through guided, shared activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">

            <p className="font-bold space-y-2 text-center text-[#37251E] ">
              Sign in to access your profile and start connecting
            </p>

            <Button
              variant="default"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    />
                  </svg>
                  Sign in with Google
                </span>
              )}
            </Button>
          </CardContent>
          <CardFooter className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms of Service
            </a>{" "}
            &nbsp; and &nbsp;
            <a
              href="/privacy"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Policy
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
