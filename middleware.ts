export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/me/:path*",     // 마이페이지 보호
    "/api/me/:path*", // API 보호
  ],
};
