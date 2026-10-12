import { redirect } from "next/navigation";

// All projects live in the carousel on the home page.
export default function ProjectsPage() {
  redirect("/#work");
}
