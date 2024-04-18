import NextAuth from "next-auth";
import { AuthOption } from "../authOptions";

const handler = NextAuth(AuthOption);

export { handler as GET, handler as POST, AuthOption };
