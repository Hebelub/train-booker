import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <SignIn />;
    </div>
}