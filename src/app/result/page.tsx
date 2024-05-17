"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast, { Toaster } from "react-hot-toast";
const Page = () => {
  const params = useSearchParams();
  const [time, setTime] = React.useState(60);
  const supabase = createClientComponentClient();
  const [user, setUser] = React.useState<any>(null);
  const { push } = useRouter();
  const initialized = React.useRef(false);

  React.useEffect(() => {
    const getData = async () => {
      try {
        if (params.get("id") && params.get("name")) {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", params.get("id"))
            .eq("name", params.get("name"))
            .neq("checked", true)
            .maybeSingle();
          setUser(data);
          console.log(data);
          if (data) {
            await supabase
              .from("users")
              .update({ checked: true })
              .eq("id", data.id)
              .select();
          } else {
            toast.error("이미 수령하였습니다.");
            push("/");
          }
        }
      } catch (error) {
        toast.error("잘못된 접근입니다.");
      }
    };

    if (!initialized.current) {
      initialized.current = true;
      getData();
    }
  }, [params]);

  React.useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer); // 컴포넌트 unmount 시 타이머 제거
    } else {
      toast.error("유효시간이 만료되었습니다.");
      push("/");
    }
  }, [time]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (params.get("id") && params.get("name"))
    return (
      <div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">이벤트</CardTitle>
              <CardDescription>유효시간 : {formatTime(time)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">{user?.id}</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{user?.name}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  else return <></>;
};

export default Page;
