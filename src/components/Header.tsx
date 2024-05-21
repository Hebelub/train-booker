import Link from "next/link"
import Image from "next/image";
import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggler } from "./ThemeToggler";

function Header() {

    return (
        <header className="flex items-center justify-between">
            <Link href="/sessions" className="flex items-center space-x-2">
                <div className="bg-[#ffbf6c] w-fit">
                    <Image
                        src="https://www.shareicon.net/download/2016/05/12/524920_clock_72x72.png"
                        alt="logo"
                        className="Invert"
                        width={50}
                        height={50}
                    />
                </div>
                <h1 className="font-bold font-xl">Book A Session</h1>
            </Link>

            <div className="px-5 flex space-x-2 items-center">
                {/* Theme toggler */}
                <ThemeToggler />

                {/* User Button */}
                <UserButton afterSignOutUrl="/sessions" />

                <SignedOut>
                    <SignInButton mode="modal" />
                </SignedOut>
            </div>
        </header>
    )
}

export default Header