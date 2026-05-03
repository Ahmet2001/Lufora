import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/home",
    "/plants/:path*",
    "/grow/:path*",
    "/calendar",
    "/profile",
    "/matchmaker"
  ]
};
