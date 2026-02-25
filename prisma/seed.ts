import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@spinkit.shop";
const ADMIN_PASSWORD = "Admin123!";

const categories = [
  { id: "cat-1", name: "Rubbers", slug: "rubbers" },
  { id: "cat-2", name: "Blades", slug: "blades" },
  { id: "cat-3", name: "Bats", slug: "bats" },
  { id: "cat-4", name: "Balls", slug: "balls" },
  { id: "cat-5", name: "Cleaners & Glue", slug: "cleaners-glue" },
  { id: "cat-6", name: "Accessories", slug: "accessories" },
];

const products = [
  {
    id: "prod-1",
    slug: "new-donic-bat-pro",
    productCode: "DONIC-BAT-PRO",
    name: "New Donic Bat Pro",
    priceCents: 4999,
    compareAtCents: 5999,
    rating: 4.8,
    reviewCount: 124,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-3",
    tags: JSON.stringify(["bat", "donic", "pro"]),
    shortDesc: "Professional table tennis bat for serious players.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 12,
  },
  {
    id: "prod-2",
    slug: "joola-classic-serve",
    productCode: "JOOLA-CLASSIC",
    name: "Joola Classic Serve",
    priceCents: 3499,
    compareAtCents: null,
    rating: 4.9,
    reviewCount: 89,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-3",
    tags: JSON.stringify(["bat", "joola", "classic"]),
    shortDesc: "Classic Joola paddle for control and spin.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 8,
  },
  {
    id: "prod-3",
    slug: "joola-carbon-blade",
    productCode: "JOOLA-CARBON",
    name: "Joola Carbon Blade",
    priceCents: 8999,
    compareAtCents: null,
    rating: 4.7,
    reviewCount: 203,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-2",
    tags: JSON.stringify(["blade", "carbon", "joola"]),
    shortDesc: "Carbon-reinforced blade for speed and control.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 6,
  },
  {
    id: "prod-4",
    slug: "donic-blue-tshirt",
    productCode: "DONIC-TEE-BLUE",
    name: "Donic Blue",
    priceCents: 2999,
    compareAtCents: null,
    rating: 4.6,
    reviewCount: 56,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-6",
    tags: JSON.stringify(["apparel", "donic", "tshirt"]),
    shortDesc: "Official Donic table tennis t-shirt.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 20,
  },
  {
    id: "prod-5",
    slug: "table-tennis-ball-case",
    productCode: "BALL-CASE-01",
    name: "Table Tennis Ball Case",
    priceCents: 1299,
    compareAtCents: null,
    rating: 4.5,
    reviewCount: 78,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-6",
    tags: JSON.stringify(["balls", "case", "storage"]),
    shortDesc: "Durable case to store and carry table tennis balls.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 15,
  },
  {
    id: "prod-6",
    slug: "donic-balls-3-star",
    productCode: "DONIC-BALLS-3S",
    name: "Donic 3-Star Balls (6-Pack)",
    priceCents: 999,
    compareAtCents: null,
    rating: 4.8,
    reviewCount: 312,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-4",
    tags: JSON.stringify(["balls", "donic", "3-star"]),
    shortDesc: "Official 3-star table tennis balls, 6 per box.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 50,
  },
  {
    id: "prod-7",
    slug: "table-tennis-net-system",
    productCode: "NET-SYS-01",
    name: "Table Tennis Net System",
    priceCents: 3999,
    compareAtCents: 4999,
    rating: 4.7,
    reviewCount: 92,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-6",
    tags: JSON.stringify(["net", "accessories", "table"]),
    shortDesc: "Professional net and post system for standard tables.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 10,
  },
  {
    id: "prod-8",
    slug: "wooden-blade-classic",
    productCode: "BLADE-WOOD-01",
    name: "Wooden Table Tennis Blade",
    priceCents: 2499,
    compareAtCents: null,
    rating: 4.6,
    reviewCount: 145,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-2",
    tags: JSON.stringify(["blade", "wood", "all-round"]),
    shortDesc: "Classic all-wood blade for all-round play.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 18,
  },
  {
    id: "prod-9",
    slug: "black-long-sleeve-top",
    productCode: "APPAREL-BLK-LS",
    name: "Black Long-Sleeve Top",
    priceCents: 3499,
    compareAtCents: null,
    rating: 4.5,
    reviewCount: 42,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-6",
    tags: JSON.stringify(["apparel", "long-sleeve", "training"]),
    shortDesc: "Breathable long-sleeve top for training and competition.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 14,
  },
  {
    id: "prod-10",
    slug: "table-tennis-rubber-sheet",
    productCode: "RUBBER-RED-01",
    name: "Table Tennis Rubber Sheet (Red)",
    priceCents: 2999,
    compareAtCents: null,
    rating: 4.7,
    reviewCount: 167,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-1",
    tags: JSON.stringify(["rubber", "red", "tensor"]),
    shortDesc: "High-quality tensor rubber sheet for spin and speed.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 25,
  },
  {
    id: "prod-11",
    slug: "cleaner-spray-sponge",
    productCode: "CLEAN-01",
    name: "Rubber Cleaner & Sponge",
    priceCents: 899,
    compareAtCents: null,
    rating: 4.6,
    reviewCount: 88,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-5",
    tags: JSON.stringify(["cleaner", "glue", "maintenance"]),
    shortDesc: "Cleaning spray and sponge to maintain rubber performance.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 30,
  },
  {
    id: "prod-12",
    slug: "speed-glue-alternative",
    productCode: "GLUE-01",
    name: "Speed Glue Alternative",
    priceCents: 1499,
    compareAtCents: null,
    rating: 4.5,
    reviewCount: 63,
    images: JSON.stringify(["/images/placeholder.svg"]),
    categoryId: "cat-5",
    tags: JSON.stringify(["glue", "rubber", "assembly"]),
    shortDesc: "Water-based glue for attaching rubbers to blades.",
    longDesc: null,
    ingredients: null,
    howToUse: null,
    stock: 22,
  },
];

async function main() {
  const adminPasswordHash = await hash(ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash: adminPasswordHash, role: "ADMIN" },
    create: {
      email: ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("Seeded admin user:", ADMIN_EMAIL, "| Password:", ADMIN_PASSWORD);

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Seeded categories");

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
  console.log("Seeded products");

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENT",
      value: 10,
      minOrderCents: null,
      expiresAt: null,
    },
  });
  await prisma.coupon.upsert({
    where: { code: "SAVE5" },
    update: {},
    create: {
      code: "SAVE5",
      type: "FIXED",
      value: 500,
      minOrderCents: 3000,
      expiresAt: null,
    },
  });
  console.log("Seeded coupons: WELCOME10, SAVE5");

  // Blog categories and sample posts (skip if blog tables don't exist yet)
  try {
    const blogCatIds = ["blogcat-1", "blogcat-2", "blogcat-3", "blogcat-4", "blogcat-5"];
    await prisma.blogCategory.upsert({
      where: { id: blogCatIds[0] },
      update: {},
      create: { id: blogCatIds[0], name: "Tips & Tricks", slug: "tips-tricks" },
    });
    await prisma.blogCategory.upsert({
      where: { id: blogCatIds[1] },
      update: {},
      create: { id: blogCatIds[1], name: "Equipment Reviews", slug: "equipment-reviews" },
    });
    await prisma.blogCategory.upsert({
      where: { id: blogCatIds[2] },
      update: {},
      create: { id: blogCatIds[2], name: "Player Stories", slug: "player-stories" },
    });
    await prisma.blogCategory.upsert({
      where: { id: blogCatIds[3] },
      update: {},
      create: { id: blogCatIds[3], name: "Training", slug: "training" },
    });
    await prisma.blogCategory.upsert({
      where: { id: blogCatIds[4] },
      update: {},
      create: { id: blogCatIds[4], name: "Technique", slug: "technique" },
    });
    const samplePosts = [
      {
        slug: "master-the-art-of-topspin",
        title: "Master the Art of Topspin: A Complete Guide",
        excerpt: "Learn how to generate more spin on your loops and serves with proper technique and equipment choices.",
        body: "Topspin is one of the most effective weapons in table tennis. This guide covers grip, stroke mechanics, and rubber selection.",
        image: "/images/our-story.png",
        authorName: "Coach Zhang",
        categoryId: blogCatIds[4],
        publishedAt: new Date("2026-07-08"),
      },
      {
        slug: "how-to-choose-your-first-table-tennis-racket",
        title: "How to Choose Your First Table Tennis Racket",
        excerpt: "A beginner-friendly guide to selecting the right blade and rubbers for your playing style and budget.",
        body: "Choosing your first racket can feel overwhelming. We break down blade speed, rubber thickness, and control vs. spin.",
        image: "/images/about.png",
        authorName: "Coach Zhang",
        categoryId: blogCatIds[1],
        publishedAt: new Date("2026-06-15"),
      },
      {
        slug: "top-10-training-drills-for-club-players",
        title: "Top 10 Training Drills for Club Players",
        excerpt: "Effective drills you can do with a partner or robot to improve consistency, footwork, and match readiness.",
        body: "From multi-ball to shadow play, these ten drills will help club players develop faster and play with more confidence.",
        image: "/images/person-image.png",
        authorName: "Coach Zhang",
        categoryId: blogCatIds[3],
        publishedAt: new Date("2026-06-01"),
      },
    ];
    for (const p of samplePosts) {
      await prisma.blogPost.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          ...p,
          body: p.body,
        },
      });
    }
    console.log("Seeded blog categories and sample posts");
  } catch (e: unknown) {
    const err = e as { code?: string; meta?: { modelName?: string } };
    if (err?.code === "P2021" && err?.meta?.modelName === "BlogCategory") {
      console.log(
        "Blog tables not found — run prisma/apply-blog-manually.sql in Supabase SQL Editor, then run 'npx prisma db seed' again to seed blog data."
      );
    } else {
      throw e;
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
