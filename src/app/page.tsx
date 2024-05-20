"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const { push } = useRouter();
  const supabase = createClientComponentClient();

  const handleLoginBtn = async () => {
    const id = (document.getElementById("id") as HTMLInputElement).value;
    const name = (document.getElementById("name") as HTMLInputElement).value;
    // const toastId = toast.loading("Loading...");
    // const { data } = await supabase
    //   .from("users")
    //   .select("*")
    //   .eq("id", id)
    //   .eq("name", name)
    //   .neq("checked", true)
    //   .maybeSingle();
    // toast.dismiss(toastId);

    // if (!data) {
    //   // await supabase
    //   //   .from("users")
    //   //   .update({ checked: true })
    //   //   .eq("id", data.id)
    //   //   .select();
    //   toast.error("이미 수령하였습니다.");
    // }

    push(`/result?id=${id}&name=${name}`);
  };

  return (
    <div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="mx-auto min-w-72 max-w-lg m-8">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">이벤트</CardTitle>
            <CardDescription>사원번호와 성함을 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">사원번호</Label>
                <Input id="id" required type="text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">성함</Label>
                <Input id="name" required type="text" />
              </div>
              <Button onClick={handleLoginBtn} className="w-full">
                확인하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
