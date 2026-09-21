import {
  Link,
} from "react-router-dom";

import Button from "../components/ui/Button.jsx";

import logo2 from "../assets/logo2.png";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-container-low px-4 text-center">
      <img
        src={logo2}
        alt="PhilaLink"
        className="mb-4 h-12 w-12 object-contain opacity-70"
      />

      <p className="text-6xl font-extrabold text-primary">
        404
      </p>

      <h1 className="mt-2 text-xl font-bold text-on-surface">
        Page not found
      </h1>

      <p className="mt-1 max-w-sm text-sm text-on-surface-variant">
        The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
      </p>

      <Button
        as={Link}
        to="/"
        className="mt-6"
      >
        Back to home
      </Button>
    </div>
  );
}