import Link from "next/link";

export const metadata = {
    title: "개인정보처리방침 | 우리의 1주년",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-surface px-6 py-12 md:px-12">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="font-label text-sm text-primary hover:text-primary-dim transition-colors">
                    ← 홈으로
                </Link>

                <h1 className="font-headline text-3xl font-bold text-primary mt-6 mb-2">개인정보처리방침</h1>
                <p className="font-label text-sm text-on-surface-variant mb-10">시행일: 2026년 8월 21일</p>

                <div className="space-y-8 font-body text-on-surface leading-relaxed">
                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">1. 수집하는 개인정보 항목</h2>
                        <p className="mb-2">&quot;우리의 1주년&quot;(이하 &quot;앱&quot;)은 서비스 제공을 위해 아래 정보를 수집합니다.</p>
                        <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
                            <li>계정 정보: 이메일 주소, 비밀번호(암호화되어 저장됨)</li>
                            <li>소셜 로그인 이용 시: 카카오/구글로부터 제공받는 이메일, 프로필 이름, 프로필 사진</li>
                            <li>프로필 정보: 이름, D-Day(기념일) 날짜</li>
                            <li>이용자가 직접 작성/업로드하는 콘텐츠: 추억 기록(제목, 날짜, 설명, 사진), 편지 내용</li>
                            <li>커플 연결을 위한 초대 코드</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">2. 개인정보의 수집 및 이용 목적</h2>
                        <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
                            <li>회원 식별 및 로그인 인증</li>
                            <li>커플 계정 연결 및 콘텐츠(추억, 편지)의 상호 공유</li>
                            <li>앱 핵심 기능(갤러리, 편지함, D-Day 위젯) 제공</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">3. 개인정보의 보관 및 파기</h2>
                        <p className="text-on-surface-variant">
                            이용자가 작성한 콘텐츠와 계정 정보는 Supabase(클라우드 데이터베이스/스토리지) 인프라에 안전하게 저장되며,
                            회원 탈퇴 시 앱 내 &quot;설정 → 계정 및 모든 데이터 영구 삭제&quot; 기능을 통해 관련 데이터가 지체 없이 영구적으로 삭제됩니다.
                            업로드된 사진은 비공개로 저장되며, 본인과 연결된 상대방만 열람할 수 있습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">4. 개인정보의 제3자 제공</h2>
                        <p className="text-on-surface-variant">
                            앱은 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 카카오/구글 소셜 로그인을 선택한 경우,
                            해당 인증 절차를 위해 각 사에 이메일 및 프로필 정보가 전달될 수 있으며 이는 각 서비스의 개인정보처리방침을 따릅니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">5. 이용자의 권리</h2>
                        <p className="text-on-surface-variant">
                            이용자는 언제든지 앱 내에서 본인의 정보를 열람·수정할 수 있으며, 계정 삭제를 통해 본인 및 자신이 작성한
                            콘텐츠에 대한 삭제를 요청할 수 있습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">6. 문의처</h2>
                        <p className="text-on-surface-variant">
                            개인정보 관련 문의사항은 아래 이메일로 연락해 주세요.<br />
                            이메일: gf16516@gmail.com
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
