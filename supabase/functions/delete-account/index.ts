// Supabase Edge Function: 계정 및 모든 데이터 영구 삭제
//
// 배포: supabase functions deploy delete-account
// (Supabase CLI 로그인 + 프로젝트 링크가 되어 있어야 함. SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY는
//  Supabase가 Edge Function 런타임에 자동으로 주입하므로 별도 설정 불필요)
//
// 클라이언트에서는 supabase.functions.invoke("delete-account")로 호출한다.
// (invoke가 현재 로그인 세션의 Authorization 헤더를 자동으로 붙여준다)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(JSON.stringify({ error: "인증 정보가 없습니다." }), { status: 401 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // 1) 요청자 신원 확인 (요청자 본인의 JWT로 유저 조회)
    const userClient = createClient(supabaseUrl, serviceRoleKey, {
        global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();

    if (userError || !userData?.user) {
        return new Response(JSON.stringify({ error: "유효하지 않은 세션입니다." }), { status: 401 });
    }

    const userId = userData.user.id;

    // 2) service_role 클라이언트로 전환 (앱 데이터 정리 + 계정 최종 삭제)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // 2-1) 앱 데이터 정리: RLS를 우회하는 SECURITY DEFINER RPC를 "요청자 권한"으로 호출
    //      (본인 데이터만 지우도록 RPC 내부에서 auth.uid() 기준으로 처리됨 — supabase/migrations 참고)
    const { error: dataError } = await userClient.rpc("delete_own_account_data");
    if (dataError) {
        return new Response(
            JSON.stringify({ error: `데이터 삭제 중 오류: ${dataError.message}` }),
            { status: 500 }
        );
    }

    // 2-2) auth.users에서 계정 자체 삭제 (service_role만 가능)
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteUserError) {
        return new Response(
            JSON.stringify({ error: `계정 삭제 중 오류: ${deleteUserError.message}` }),
            { status: 500 }
        );
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
});
