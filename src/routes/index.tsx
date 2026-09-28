import { createFileRoute } from "@tanstack/react-router";
import { Gallery } from "@/components/puzzle/Gallery";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Gallery />;
}
