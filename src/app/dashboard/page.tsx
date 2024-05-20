"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CardTitle, CardHeader, CardContent, Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const Page = () => {
  const supabase = createClientComponentClient();
  const initialized = React.useRef(false);

  const [status, setStatus] = React.useState<{
    checkedUser: number;
    notCheckedUser: number;
  }>({ checkedUser: 0, notCheckedUser: 0 });

  const [search, setSearch] = React.useState<any>();

  const getKoreaTime = React.useCallback((date: Date) => {
    const offset = 1000 * 60 * 60 * 9;
    const koreaNow = new Date(date.getTime() + offset);
    return koreaNow.toISOString().replace("T", " ").split(".")[0];
  }, []);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const toastId = toast.loading("Loading...");
        const { count: checkedUser } = await supabase
          .from("users")
          .select("id", { count: "exact" })
          .eq("checked", true);
        const { count: notCheckedUser } = await supabase
          .from("users")
          .select("id", { count: "exact" })
          .eq("checked", false);
        if (checkedUser && notCheckedUser) {
          setStatus({
            checkedUser,
            notCheckedUser,
          });
        }
        toast.dismiss(toastId);
      } catch (error) {
        toast.error("잘못된 접근입니다.");
      }
    };

    if (!initialized.current) {
      initialized.current = true;
      getData();
    }
  }, []);

  return (
    <Suspense>
      <div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="mx-auto min-w-72 max-w-lg text-center">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">
                    수령 : <b>{status.checkedUser.toLocaleString()}</b>
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">
                    미수령 : <b>{status.notCheckedUser.toLocaleString()}</b>
                  </Label>
                </div>

                <div className="space-y-2 !mt-16">
                  <Label htmlFor="name">&quot;사원번호&quot; 로 검색</Label>
                  <Input id="id" type="text" />
                </div>
                <Button
                  className="w-full"
                  onClick={async () => {
                    try {
                      const id = (
                        document.getElementById("id") as HTMLInputElement
                      ).value;
                      const toastId = toast.loading("Loading...");
                      const { data } = await supabase
                        .from("users")
                        .select("*")
                        .eq("id", id)
                        .maybeSingle();
                      toast.dismiss(toastId);
                      if (data) setSearch(data);
                      else {
                        toast.error(`에러가 발생했습니다. 다시 시도해주세요.`);
                      }
                    } catch (error) {
                      toast.error(`에러가 발생했습니다. 다시 시도해주세요.`);
                    }
                  }}
                >
                  조회하기
                </Button>

                {search && (
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="id">
                      사원번호 : <b>{search?.id}</b>
                    </Label>
                    <Label htmlFor="id">
                      성함 : <b>{search?.name}</b>
                    </Label>
                    <Label htmlFor="id">
                      {search?.checked ? (
                        <>
                          <b className="text-red-500">
                            수령 ({getKoreaTime(new Date(search.checkedTime))})
                          </b>
                        </>
                      ) : (
                        <>미수령</>
                      )}
                    </Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
