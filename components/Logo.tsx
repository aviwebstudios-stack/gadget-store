import Image from "next/image";

// Both files are in the HTML; the "dark" class on <html> decides which one shows,
// so the right logo is visible before hydration.
export function Logo({ width, height, className = "", priority = false }: { width: number; height: number; className?: string; priority?: boolean }) {
  return (
    <>
      <Image src="/logo.png" alt="Delux Tech Gadget" width={width} height={height} priority={priority} className={`hidden dark:block ${className}`} />
      <Image src="/logo-dark.png" alt="Delux Tech Gadget" width={width} height={height} priority={priority} className={`block dark:hidden ${className}`} />
    </>
  );
}
