"use client";

import { SignIn, SignUp, UserButton } from "@clerk/nextjs";
import { clerkAppearance, useTheme } from "@/lib/theme";

export function ThemedSignIn() {
  const theme = useTheme();
  return <SignIn appearance={clerkAppearance(theme)} forceRedirectUrl="/account/orders" />;
}

export function ThemedSignUp() {
  const theme = useTheme();
  return <SignUp appearance={clerkAppearance(theme)} forceRedirectUrl="/account/orders" />;
}

export function ThemedUserButton() {
  const theme = useTheme();
  const appearance = clerkAppearance(theme);
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{ ...appearance, elements: { avatarBox: "h-6 w-6" } }}
      userProfileProps={{ appearance }}
    />
  );
}
