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
export default function Home() {
  const { push } = useRouter();
  const handleLoginBtn = async () => {
    const id = (document.getElementById("id") as HTMLInputElement).value;
    const name = (document.getElementById("name") as HTMLInputElement).value;
    push(`/result?id=${id}&name=${name}`);
  };

  return (
    <div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="mx-auto min-w-96 max-w-lg ">
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
