import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { randomUUID } from "crypto";

async function main() {
  const email = "test@example.com";
  const password = "Test1234!";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: "테스트유저",
      gender: "Other",
    },
  });

  await prisma.membership.upsert({
    where: { userId: user.id },
    update: { status: "active" },
    create: {
      userId: user.id,
      status: "active",
      barcodeValue: `MEMBER-${randomUUID().slice(0, 8).toUpperCase()}`,
    },
  });

  // Sample lodgings (Seoul)
  await prisma.lodging.createMany({
    data: [
      {
        name: "OUR SITY 스테이 - 시청",
        lat: 37.5665,
        lng: 126.9780,
        address: "서울특별시 중구 세종대로",
        thumbnailUrl: "https://images.unsplash.com/photo-1560067174-8943bd7cc64c?auto=format&fit=crop&w=300&q=60",
        isActive: true,
      },
      {
        name: "OUR SITY 스테이 - 홍대",
        lat: 37.5563,
        lng: 126.9220,
        address: "서울특별시 마포구 홍익로",
        thumbnailUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=300&q=60",
        isActive: true,
      },
      {
        name: "OUR SITY 스테이 - 강남",
        lat: 37.4979,
        lng: 127.0276,
        address: "서울특별시 강남구 테헤란로",
        thumbnailUrl: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=300&q=60",
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  // Sample posts
  await prisma.post.createMany({
    data: [
      { userId: user.id, title: "첫 번째 게시글", content: "멤버십 혜택이 좋아요!" },
      { userId: user.id, title: "두 번째 게시글", content: "오늘은 가까운 숙소를 찾아봤어요." },
    ],
    skipDuplicates: true,
  });

  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  const in14 = new Date(now.getTime() + 14 * 24 * 3600 * 1000);

  await prisma.bannerEvent.createMany({
    data: [
      {
        title: "봄 시즌 멤버십 프로모션",
        imageUrl: "https://images.unsplash.com/photo-1520975682031-a0a6f1e5a5cb?auto=format&fit=crop&w=900&q=60",
        linkUrl: "https://example.com/promo",
        startAt: now,
        endAt: in14,
        priority: 10,
        isActive: true,
      },
      {
        title: "신규 숙소 오픈",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=60",
        linkUrl: "https://example.com/new",
        startAt: now,
        endAt: in7,
        priority: 5,
        isActive: true,
      },
      {
        title: "이벤트 배너 예시",
        imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=60",
        linkUrl: "/",
        startAt: now,
        endAt: in14,
        priority: 1,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete:", { email, password });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
