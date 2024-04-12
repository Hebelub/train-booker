import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ['/', '/sessions']
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};