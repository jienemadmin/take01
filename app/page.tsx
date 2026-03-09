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
  const displayEmail =
    session?.user?.email || "로그인 후 내 계정 정보를 확인할 수 있어요";
  const membershipStatus = isLoggedIn
    ? "멤버십 상태 확인 가능"
    : "로그인 후 내 멤버십 확인";
  const barcodeValue = isLoggedIn ? "MEMBER-••••-REAL" : "MEMBER-PREVIEW";
  const barcodeHint = isLoggedIn
    ? "내 바코드를 열어 실제 패스를 확인하세요."
    : "로그인 후 나만의 바코드를 확인할 수 있어요.";

  const banners = [
    {
      id: 1,
      title: "웰컴 멤버십 혜택",
      desc: "회원가입 후 첫 멤버십 안내와 기본 혜택을 확인하세요.",
      href: isLoggedIn ? "/me" : getLoginHref("/me"),
    },
    {
      id: 2,
      title: "이번 주 운영 공지",
      desc: "새로운 기능과 서비스 변경 사항을 빠르게 확인하세요.",
      href: "#notices",
    },
    {
      id: 3,
      title: "패스 사용 안내",
      desc: "바코드 패스와 멤버십 사용 방식을 미리 둘러보세요.",
      href: "#benefits",
    },
  ];

  const benefits = [
    {
      id: 1,
      title: "멤버십 패스 안내",
      desc: "로그인 후 나만의 바코드 패스를 확인하고 멤버십 정보를 관리할 수 있어요.",
    },
    {
      id: 2,
      title: "공지 및 혜택 확인",
      desc: "운영팀 공지, 웰컴 혜택, 신규 이벤트를 한 화면에서 빠르게 볼 수 있어요.",
    },
    {
      id: 3,
      title: "내 계정 관리",
      desc: "프로필, 멤버십 상태, 활동 이력을 내정보 페이지에서 확인할 수 있어요.",
    },
  ];

  const posts = [
    {
      id: 1,
      title: "이번 달 멤버 전용 혜택 정리",
      meta: "운영팀 · 2시간 전",
    },
    {
      id: 2,
      title: "멤버십 패스 사용 가이드",
      meta: "운영팀 · 어제",
    },
    {
      id: 3,
      title: "최근 업데이트와 변경사항",
      meta: "운영팀 · 2일 전",
    },
    {
      id: 4,
      title: "처음 가입한 사용자를 위한 안내",
      meta: "운영팀 · 3일 전",
    },
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
              핵심 화면을 먼저 경험하세요
            </h1>
            <p className="public-desc">
              프로필, 멤버십, 바코드 패스, 공지, 최근 활동을 먼저 보여주고
              실제 액션이 필요한 순간에만 로그인 또는 회원가입을 유도하는
              공개형 홈 구조입니다.
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
            <div className="public-avatar">
              {isLoggedIn ? displayName.slice(0, 1) : "G"}
            </div>

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

          <div
            className={`public-barcodeCard ${
              isLoggedIn ? "is-active" : "is-preview"
            }`}
          >
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
            <Link
              key={banner.id}
              href={banner.href}
              className="mp-card public-bannerCard"
            >
              <div className="public-bannerCard__title">{banner.title}</div>
              <p className="public-bannerCard__desc">{banner.desc}</p>
              <span className="public-bannerCard__cta">자세히 보기</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="benefits" className="public-sectionGrid">
        <article className="mp-card public-panel public-panel--full">
          <div className="public-sectionHead">
            <div>
              <div className="public-sectionLabel">SECTION 04</div>
              <h2>서비스 안내 · 멤버 혜택</h2>
            </div>
          </div>

          <div className="public-benefitGrid">
            {benefits.map((item) => (
              <div key={item.id} className="public-benefitCard">
                <div className="public-benefitCard__title">{item.title}</div>
                <p className="public-benefitCard__desc">{item.desc}</p>
                <Link
                  className="public-benefitCard__cta"
                  href={isLoggedIn ? "/me" : getLoginHref("/register")}
                >
                  {isLoggedIn ? "내정보로 이동" : "회원가입하고 시작하기"}
                </Link>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section id="notices" className="public-sectionGrid">
        <article className="mp-card public-panel public-panel--full">
          <div className="public-sectionHead">
            <div>
              <div className="public-sectionLabel">SECTION 05</div>
              <h2>최근 활동 · 게시물</h2>
            </div>
          </div>

          <div className="public-postList">
            {posts.map((post) => (
              <div key={post.id} className="public-postItem">
                <div>
                  <div className="public-postTitle">{post.title}</div>
                  <div className="public-postMeta">{post.meta}</div>
                </div>

                <Link
                  className="mp-actionBtn"
                  href={isLoggedIn ? "/me" : getLoginHref("/login")}
                >
                  {isLoggedIn ? "열기" : "로그인 후 더보기"}
                </Link>
              </div>
            ))}
          </div>

          <div className="public-finalCta">
            {isLoggedIn ? (
              <>
                <Link className="mp-primary public-primaryBtn" href="/me">
                  내 계정으로 이동
                </Link>
                <p>로그인 상태예요. 내정보에서 멤버십과 계정 정보를 관리할 수 있어요.</p>
              </>
            ) : (
              <>
                <Link className="mp-primary public-primaryBtn" href="/register">
                  회원가입하고 시작하기
                </Link>
                <p>
                  먼저 둘러본 뒤, 필요할 때 로그인 또는 회원가입을 진행하면 됩니다.
                </p>
              </>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
