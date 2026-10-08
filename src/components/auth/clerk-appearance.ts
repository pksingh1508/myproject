// Element-level polish for Clerk's SignIn / SignUp cards. Colours, fonts and
// radii come from the provider-level variables in the root layout.
export const clerkAuthAppearance = {
  elements: {
    rootBox: "w-full",
    cardBox: "shadow-lift border border-border rounded-[1.75rem]",
    card: "bg-card",
    socialButtonsBlockButton:
      "rounded-full border-border hover:bg-foreground/[0.04] transition-colors",
    formFieldInput: "rounded-xl",
    formButtonPrimary:
      "rounded-full bg-primary text-primary-foreground shadow-none hover:bg-primary/90",
    footerActionLink: "text-brand font-medium",
  },
};
