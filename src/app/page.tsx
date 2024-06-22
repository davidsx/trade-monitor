import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/woo");
  // return (
  //   <main>
  //     <nav>
  //       <Link href="/woo" />
  //     </nav>
  //   </main>
  // );
}
