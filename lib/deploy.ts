export function isGhPages() {
  return process.env.NEXT_PUBLIC_DEPLOY_TARGET === "gh-pages";
}
