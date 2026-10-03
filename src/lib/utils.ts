// shadcn-style class joiner. Deliberately dependency-free: it joins truthy
// classes but does not resolve Tailwind conflicts the way clsx + tailwind-merge
// would, so callers shouldn't pass a class that fights a component's own.
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
