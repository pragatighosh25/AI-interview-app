import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      
      <Card className="w-[350px] p-6">
        <CardContent className="flex flex-col gap-4">

          <h2 className="text-2xl font-bold text-center">Login</h2>

          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />

          <Button>Login</Button>

        </CardContent>
      </Card>

    </div>
  );
}