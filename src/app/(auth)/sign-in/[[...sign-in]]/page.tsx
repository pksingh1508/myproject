import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-lg border border-border bg-card text-card-foreground",
            headerTitle: "text-2xl font-semibold",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton:
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            formButtonPrimary:
              "bg-primary text-primary-foreground hover:bg-primary/90"
          }
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl="/"
      />
    </div>
  );
}
