# MemberPass MVP (Next.js + NextAuth + Prisma + Stripe + Mapbox)

## 요구사항 (요약)
- 로그인/회원가입 (Credentials)
- Stripe 구독 결제(멤버십 활성화)
- 메인 4섹션: 프로필/바코드, 지도(가까운 숙소), 내 게시글, 이벤트 배너

---

## 1) 로컬 실행 준비

### A. Node 설치 확인
```bash
node -v
npm -v
```

### B. 환경변수 설정
루트에 `.env.local` 생성 후 `.env.example` 참고해서 채우기:

```env
DATABASE_URL="..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_SUCCESS_URL="http://localhost:3000/?checkout=success"
STRIPE_CANCEL_URL="http://localhost:3000/?checkout=cancel"

NEXT_PUBLIC_MAPBOX_TOKEN="pk..."
```

---

## 2) 설치/DB/시드/실행

```bash
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

- 접속: http://localhost:3000

---

## 3) 테스트 계정
- email: `test@example.com`
- password: `Test1234!`

---

## 4) Stripe Webhook (로컬)
Stripe CLI 설치 후:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/billing/webhook
```

출력되는 `whsec_...` 값을 `.env.local`의 `STRIPE_WEBHOOK_SECRET`에 넣고 재시작.

---

## 5) 주의
- 지도 안 나오면 `NEXT_PUBLIC_MAPBOX_TOKEN` 확인
- 결제 후 멤버십 활성화가 안 되면 `stripe listen` 실행/whsec 값 확인
