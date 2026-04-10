import Link from "next/link";

const LOGO_SRC = "/assets/logo.svg";

type LogoProps = {
  /** Tailwind classes for the img (default fits the top nav bar). */
  className?: string;
  /** Wrapper when linking to home. */
  linkClassName?: string;
  withLink?: boolean;
};

export default function Logo({
  className = "h-8 w-auto",
  linkClassName = "flex items-center shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container",
  withLink = true,
}: LogoProps) {
  const img = (
    <img
      src={LOGO_SRC}
      alt="InternBeacon"
      width={180}
      height={40}
      className={className}
    />
  );

  if (withLink) {
    return (
      <Link href="/" className={linkClassName}>
        {img}
      </Link>
    );
  }

  return img;
}
