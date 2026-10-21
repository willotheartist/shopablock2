import { notFound } from "next/navigation";
export default async function DesignReview({
  searchParams,
}: {
  searchParams: Promise<{ width?: string }>;
}) {
  if (process.env.VERCEL_ENV !== "preview") notFound();
  const value = (await searchParams).width;
  const width = value === "320" ? 320 : value === "768" ? 768 : 390;
  return (
    <main
      id="main"
      style={{ background: "#303030", padding: 24, minHeight: "100vh" }}
    >
      <h1 style={{ fontSize: 24, color: "white", marginBottom: 20 }}>
        Responsive design check · {width}px
      </h1>
      <iframe
        title="Mobile homepage preview"
        src="/"
        style={{ width, height: 844, border: 0, display: "block" }}
      />
    </main>
  );
}
