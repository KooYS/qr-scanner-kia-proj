"use client";
import React, { Suspense } from "react";
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
import toast from "react-hot-toast";

const Page = () => {
  const params = useSearchParams();
  // const [time, setTime] = React.useState(60);
  const supabase = createClientComponentClient();
  const [user, setUser] = React.useState<any>(null);
  const { push } = useRouter();
  const initialized = React.useRef(false);

  React.useEffect(() => {
    const getData = async () => {
      try {
        if (params.get("id") && params.get("name")) {
          const toastId = toast.loading("Loading...");
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", params.get("id"))
            .eq("name", params.get("name"))
            // .neq("checked", true)
            .maybeSingle();
          setUser(data);
          toast.dismiss(toastId);
          console.log(data);
          if (!data) {
            // await supabase
            //   .from("users")
            //   .update({ checked: true })
            //   .eq("id", data.id)
            //   .select();
            toast.error("잘못된 정보입니다.");
            push("/");
          }
          if (data.checked) {
            // await supabase
            //   .from("users")
            //   .update({ checked: true })
            //   .eq("id", data.id)
            //   .select();
            toast.error("이미 수령하였습니다.");
            push("/");
          }
        }
      } catch (error) {
        // toast.error("잘못된 접근입니다.");
      }
    };

    if (!initialized.current) {
      initialized.current = true;
      getData();
    }
  }, [params]);

  // React.useEffect(() => {
  //   if (time > 0) {
  //     const timer = setTimeout(() => setTime(time - 1), 1000);
  //     return () => clearTimeout(timer); // 컴포넌트 unmount 시 타이머 제거
  //   } else {
  //     toast.error("유효시간이 만료되었습니다.");
  //     push("/");
  //   }
  // }, [time]);

  // const formatTime = (time: number) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = time % 60;
  //   return `${minutes.toString().padStart(2, "0")}:${seconds
  //     .toString()
  //     .padStart(2, "0")}`;
  // };

  if (params.get("id") && params.get("name"))
    return (
      <Suspense>
        <div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="mx-auto min-w-72 max-w-lg text-center">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Kia&apos;s Birthday Cafe
                </CardTitle>
                <Label className="text-md !mt-2">인증 되었습니다.</Label>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">
                      사번 : <b>{user?.id}</b>
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      이름 : <b>{user?.name}</b>
                    </Label>
                  </div>
                  <div className="!mt-8">
                    <Label className="font-bold text-gray-900">
                      본 화면을 주문시 현장 Staff에게 보여주세요.
                    </Label>
                  </div>
                  <Button
                    className="w-full py-7"
                    onClick={async () => {
                      try {
                        const toastId = toast.loading("Loading...");

                        const result = await supabase
                          .from("users")
                          .update({ checked: true, checkedTime: new Date() })
                          .eq("id", user.id);

                        toast.dismiss(toastId);

                        if (result.error === null) {
                          toast.success("수령을 완료했습니다.");
                          push("/");
                        } else {
                          toast.error(
                            `${user.id}님 에러가 발생했습니다. 다시 시도해주세요.`
                          );
                        }
                      } catch (error) {
                        toast.error(
                          `${user.id}님 에러가 발생했습니다. 다시 시도해주세요.`
                        );
                      }
                    }}
                  >
                    수령 확인
                    <br />
                    (클릭 금지, 현장 Staff 확인용)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Suspense>
    );
  else return <></>;
};

export default Page;
