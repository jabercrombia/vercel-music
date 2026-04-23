// The proxy (proxy.ts) rewrites "/" to "/trends/[country]" at the edge.
// This page is never rendered in production but serves as a fallback.
export default function Home() {
  return null
}
