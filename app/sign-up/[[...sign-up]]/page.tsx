
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 py-12">
            <SignUp />
        </div>
    );
}
