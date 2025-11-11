import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">Account Created Successfully</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-slate-300 text-center">
              Please check your email to confirm your account before logging in.
            </p>
            <Link href="/auth/login" className="w-full">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
