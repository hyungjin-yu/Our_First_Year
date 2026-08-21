import Link from "next/link";

export const metadata = {
    title: "이용약관 | 우리의 1주년",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-surface px-6 py-12 md:px-12">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="font-label text-sm text-primary hover:text-primary-dim transition-colors">
                    ← 홈으로
                </Link>

                <h1 className="font-headline text-3xl font-bold text-primary mt-6 mb-2">이용약관</h1>
                <p className="font-label text-sm text-on-surface-variant mb-10">시행일: 2026년 8월 21일</p>

                <div className="space-y-8 font-body text-on-surface leading-relaxed">
                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">제1조 (목적)</h2>
                        <p className="text-on-surface-variant">
                            이 약관은 &quot;우리의 1주년&quot;(이하 &quot;앱&quot;)이 제공하는 서비스의 이용조건 및 절차,
                            이용자와 앱 운영자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">제2조 (서비스의 내용)</h2>
                        <p className="text-on-surface-variant">
                            앱은 커플이 초대 코드를 통해 계정을 연결하고, 사진·일기·편지 등의 추억을 함께 기록하고
                            열람할 수 있는 프라이빗 기록 서비스를 제공합니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">제3조 (이용자의 의무)</h2>
                        <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
                            <li>이용자는 본인 계정 정보를 안전하게 관리해야 하며, 계정 도용으로 인한 책임은 이용자 본인에게 있습니다.</li>
                            <li>이용자는 타인의 권리를 침해하는 콘텐츠, 불법적이거나 부적절한 콘텐츠를 업로드해서는 안 됩니다.</li>
                            <li>초대 코드로 연결되는 상대방은 본인이 실제로 관계를 맺고 있는 사람으로 한정해 사용해야 합니다.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">제4조 (콘텐츠의 소유권)</h2>
                        <p className="text-on-surface-variant">
                            이용자가 앱에 업로드한 사진, 일기, 편지 등 콘텐츠의 저작권은 해당 콘텐츠를 작성한 이용자에게 있습니다.
                            앱은 서비스 제공을 위한 범위 내에서만 이를 저장·표시합니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">제5조 (프리미엄 구독)</h2>
                        <p className="text-on-surface-variant">
                            앱은 추가 기능(예: 무제한 사진 업로드)을 제공하는 유료 구독 상품을 판매할 수 있으며,
                            결제는 Google Play / App Store의 인앱 결제 시스템을 통해 처리됩니다. 구독의 취소 및 환불은
                            각 스토어의 정책을 따릅니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">제6조 (계정 해지)</h2>
                        <p className="text-on-surface-variant">
                            이용자는 앱 내 설정 메뉴에서 언제든지 자유롭게 계정을 삭제할 수 있으며, 삭제 시 관련 데이터는
                            지체 없이 영구적으로 삭제됩니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">제7조 (면책조항)</h2>
                        <p className="text-on-surface-variant">
                            앱은 천재지변, 서비스 제공업체(Supabase 등)의 장애 등 불가항력적 사유로 인한 서비스 중단에
                            대해 책임을 지지 않습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-lg font-bold text-primary mb-2">문의처</h2>
                        <p className="text-on-surface-variant">gf16516@gmail.com</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
