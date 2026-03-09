import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutBtn from "@/components/LogoutBtn";

function getLoginHref(callbackUrl: string) {
  return `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const isLoggedIn = !!session?.user;
  const displayName = session?.user?.name || "Guest";
  const displayEmail = session?.user?.email || "로그인 후 내 계정을 확인할 수 있어요";
  const membershipStatus = isLoggedIn ? "멤버십 상태 확인 가능" : "로그인 후 내 멤버십 확인";
  const barcodeValue = isLoggedIn ? "MEMBER-••••-REAL" : "MEMBER-PREVIEW";
  const barcodeHint = isLoggedIn
    ? "내 바코드를 열어 실제 패스를 확인하세요."
    : "로그인 후 나만의 바코드를 확인할 수 있어요.";

  const banners = [
    {
      id: 1,
      title: "웰컴 멤버십 혜택",
      desc: "회원가입 후 첫 멤버십 안내를 확인하세요.",
      href: isLoggedIn ? "/me" : getLoginHref("/me"),
    },
    {
      id: 2,
      title: "이번 주 추천 숙소",
      desc: "가까운 지점과 혜택을 확인해보세요.",
      href: "#lodgings",
    },
    {
      id: 3,
      title: "공지사항 업데이트",
      desc: "서비스 변경사항과 새로운 이벤트를 확인하세요.",
      href: "#notices",
    },
  ];

  const lodgings = [
    { id: 1, name: "강남 프리미엄 스테이", area: "서울 강남", tag: "도심형" },
    { id: 2, name: "성수 라이프 하우스", area: "서울 성수", tag: "트렌디" },
    { id: 3, name: "해운대 오션 레지던스", area: "부산 해운대", tag: "오션뷰" },
  ];

  const posts = [
    { id: 1, title: "이번 달 멤버 전용 혜택 정리", meta: "운영팀 · 2시간 전" },
    { id: 2, title: "가까운 지점에서 사용할 수 있는 서비스", meta: "운영팀 · 어제" },
    { id: 3, title: "멤버십 패스 사용 가이드", meta: "운영팀 · 2일 전" },
  ];

  return (
    <div className="public-home">
      <section className="public-hero mp-card">
        <div className="public-topbar">
          <div className="mp-brand">
            <div className="mp-brand__title">MemberPass</div>
            <span className="mp-badge">Public Home</span>
          </div>

          <div className="mp-actions">
            {isLoggedIn ? (
              <>
                <Link className="mp-actionBtn" href="/me">
                  내정보
                </Link>
                <LogoutBtn />
              </>
            ) : (
              <>
                <Link className="mp-actionBtn" href="/register">
                  회원가입
                </Link>
                <Link className="mp-actionBtn" href="/login">
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="public-hero__content">
          <div>
            <span className="public-eyebrow">OPEN PREVIEW</span>
            <h1 className="public-title">
              로그인 전에
              <br />
              서비스 핵심 화면을 먼저 보여주세요
            </h1>
            <p className="public-desc">
              프로필, 멤버십, 바코드 패스, 공지, 숙소, 최근 활동을 먼저 경험하게 하고
              실제 액션에서만 로그인 또는 회원가입을 유도하는 구조입니다.
            </p>

            <div className="public-hero__actions">
              {isLoggedIn ? (
                <>
                  <Link className="mp-primary public-primaryBtn" href="/me">
                    내 멤버십 보기
                  </Link>
                  <Link className="public-secondaryBtn" href="#membership">
                    아래로 둘러보기
                  </Link>
                </>
              ) : (
                <>
                  <Link className="mp-primary public-primaryBtn" href="/register">
                    회원가입하고 시작하기
                  </Link>
                  <Link className="public-secondaryBtn" href="#membership">
                    먼저 둘러보기
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="public-heroCard">
            <div className="public-heroCard__label">미리보기</div>
            <div className="public-heroCard__name">{displayName}</div>
            <div className="public-heroCard__email">{displayEmail}</div>
            <div className="public-heroCard__status">{membershipStatus}</div>
          </div>
        </div>
      </section>

      <section id="membership" className="public-sectionGrid">
        <article className="mp-card public-panel">
          <div className="public-sectionHead">
            <div>
              <div className="public-sectionLabel">SECTION 01</div>
              <h2>프로필 · 멤버십 미리보기</h2>
            </div>
          </div>

          <div className="public-profileCard">
            <div className="public-avatar">{isLoggedIn ? displayName.slice(0, 1) : "G"}</div>

            <div className="public-profileMeta">
              <div className="public-profileName">{displayName}</div>
              <div className="public-profileSub">{displayEmail}</div>
              <div className="public-statusPill">
                {isLoggedIn ? "로그인됨" : "비로그인 사용자"}
              </div>
            </div>
          </div>

          <div className="public-infoList">
            <div className="public-infoItem">
              <span>멤버십 상태</span>
              <strong>{membershipStatus}</strong>
            </div>
            <div className="public-infoItem">
              <span>전용 혜택</span>
              <strong>{isLoggedIn ? "활성화 가능" : "로그인 후 확인"}</strong>
            </div>
            <div className="public-infoItem">
              <span>개인화 정보</span>
              <strong>{isLoggedIn ? "실제 계정 연결됨" : "공개 미리보기"}</strong>
            </div>
          </div>
        </article>

        <article className="mp-card public-panel">
          <div className="public-sectionHead">
            <div>
              <div className="public-sectionLabel">SECTION 02</div>
              <h2>바코드 패스 미리보기</h2>
            </div>
          </div>

          <div className={`public-barcodeCard ${isLoggedIn ? "is-active" : "is-preview"}`}>
            <div className="public-barcodeCard__top">
              <span>Membership Pass</span>
              <span>{isLoggedIn ? "LIVE" : "PREVIEW"}</span>
            </div>

            <div className="public-barcodeFake" aria-hidden="true">
              {Array.from({ length: 42 }).map((_, idx) => (
                <span key={idx} className={idx % 3 === 0 ? "thick" : ""} />
              ))}
            </div>

            <div className="public-barcodeValue">{barcodeValue}</div>
            <p className="public-barcodeHint">{barcodeHint}</p>

            <Link
              className="mp-primary public-primaryBtn"
              href={isLoggedIn ? "/me" : getLoginHref("/me")}
            >
              {isLoggedIn ? "내 바코드 열기" : "로그인하고 내 바코드 보기"}
            </Link>
          </div>
        </article>
      </section>

      <section className="public-section">
        <div className="public-sectionHead">
          <div>
            <div className="public-sectionLabel">SECTION 03</div>
            <h2>공지 · 배너</h2>
          </div>
        </div>

        <div className="public-bannerGrid">
          {banners.map((banner) => (
            <Link key={banner.id} href={banner.href} className="mp-card public-bannerCard">
              <div className="public-bannerCard__title">{banner.title}</div>
              <p className="public-bannerCard__desc">{banner.desc}</p>
              <span className="public-bannerCard__cta">자세히 보기</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="lodgings" className="public-sectionGrid">
        <article className="mp-card public-panel">
          <div className="public-sectionHead">
            <div>
              <div className="public-sectionLabel">SECTION 04</div>
              <h2>지도 · 주변 지점</h2>
            </div>
          </div>

          <div className="public-mapMock">
            <div className="public-mapMock__badge">Map Preview</div>
            <div className="public-mapMock__pins">
              <span />
              <span />
              <span />
            </div>
            <p>지금은 미리보기 구조만 표시합니다. 다음 단계에서 실제 지도 API를 붙이면 됩니다.</p>
          </div>

          <div className="public-lodgingList">
            {lodgings.map((item) => (
              <div key={item.id} className="public-lodgingItem">
                <div>
                  <div className="public-lodgingName">{item.name}</div>
                  <div className="public-lodgingMeta">
                    {item.area} · {item.tag}
                  </div>
                </div>

                <Link
                  className="mp-actionBtn"
                  href={isLoggedIn ? "/me" : getLoginHref("/login")}
                >
                  {isLoggedIn ? "저장" : "로그인 후 저장"}
                </Link>
              </div>
            ))}
          </div>
        </article>

        <article id="notices" className="mp-card public-panel">
          <div className="public-sectionHead">
            <div>
              <div className="public-sectionLabel">SECTION 05</div>
              <h2>최근 활동 · 게시물</h2>
            </div>
          </div>

          <div className="public-postList">
            {posts.map((post) => (
              <div key={post.id} className="public-postItem">
                <div className="public-postTitle">{post.title}</div>
                <div className="public-postMeta">{post.meta}</div>
              </div>
            ))}
          </div>

          <Link
            className="mp-footBtn"
            href={isLoggedIn ? "/me" : getLoginHref("/register")}
          >
            {isLoggedIn ? "내 활동 더 보기" : "회원가입하고 내 활동 시작하기"}
          </Link>
        </article>
      </section>
    </div>
  );
}
