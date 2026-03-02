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
        body: `<p>Topspin is one of the most effective weapons in table tennis. Whether you're looping from mid-distance or attacking a short ball, the ability to generate heavy spin separates good players from great ones. This guide covers everything from grip and stance to stroke mechanics and rubber selection.</p>

<h2>Grip and Stance</h2>
<p>Before you can produce topspin, you need a solid foundation. The shakehand grip is the most common for generating spin because it allows full wrist extension and forearm pronation. Hold the racket loosely—tightening your grip will kill spin. Your stance should be slightly crouched with knees bent, weight on the balls of your feet, and ready to move in any direction.</p>

<h2>Stroke Mechanics</h2>
<p>The key to topspin is brushing the ball rather than hitting through it. Start with your racket below the ball, then accelerate upward and forward in a smooth arc. The contact point should be in front of your body, and you should brush the top-back of the ball with a closed racket angle (around 45–60 degrees). Follow through toward your shoulder.</p>

<h2>Loop vs. Drive</h2>
<p>A <strong>loop</strong> uses more spin and arc—ideal for opening against backspin or attacking from mid-distance. A <strong>drive</strong> or <strong>counter-hit</strong> uses more speed and less spin—ideal for returning fast balls. Practice both: loops for heavy spin, drives for quick exchanges.</p>

<h2>Rubber Selection</h2>
<p>Tensor and spring sponge rubbers are designed for spin. Choose a rubber with a high spin rating if your technique is sound. For beginners, a slightly tacky or medium-spin rubber helps develop feel without sacrificing control. Thicker sponge (2.0mm+) gives more spin potential but requires better technique.</p>

<h2>Practice Drills</h2>
<p>Start with multiball: have a partner feed backspin to your forehand. Focus on brushing the ball, not hitting it. Gradually increase speed. Then practice against topspin—loop from your backhand and forehand. Consistency comes before power.</p>

<h2>Final Tips</h2>
<p>Focus on brushing the ball, not hitting it. Start with a slower, spinier loop before adding power. And remember: the best topspin is the one you can control consistently.</p>`,
        image: "/images/our-story.png",
        authorName: "Coach Zhang",
        categoryId: blogCatIds[4],
        publishedAt: new Date("2026-07-08"),
      },
      {
        slug: "how-to-choose-your-first-table-tennis-racket",
        title: "How to Choose Your First Table Tennis Racket",
        excerpt: "A beginner-friendly guide to selecting the right blade and rubbers for your playing style and budget.",
        body: `<p>Choosing your first table tennis racket can feel overwhelming. With hundreds of blades and rubbers on the market, where do you start? This guide breaks down the basics so you can make an informed decision.</p>

<h2>Blade Speed and Control</h2>
<p>Blades are rated by speed (OFF, OFF-, ALL, ALL-, DEF) and control. Beginners should start with an <strong>ALL</strong> or <strong>ALL-</strong> blade—balanced speed and control. As you improve, you can move to faster blades (OFF-, OFF) for more attacking power.</p>

<h2>Wood vs. Carbon</h2>
<p>All-wood blades offer more feel and control. Carbon blades are faster and stiffer. For your first racket, an all-wood or soft composite blade is usually best. You'll develop better touch and timing.</p>

<h2>Rubber Thickness</h2>
<p>Sponge thickness affects speed and spin. <strong>1.5–1.8mm</strong> is ideal for beginners—more control, less speed. <strong>2.0mm</strong> is a good middle ground. <strong>2.1mm+</strong> (max) is for advanced players who can generate their own power.</p>

<h2>Control vs. Spin</h2>
<p>Rubbers are often categorized as control-oriented or spin-oriented. Control rubbers are easier to use and forgive mistakes. Spin rubbers require better technique but reward you with more spin. Start with control.</p>

<h2>Budget</h2>
<p>You don't need to spend a fortune. A good beginner setup is a blade around €30–50 and two rubbers at €15–25 each. Pre-assembled rackets are fine for casual play, but a custom setup gives you room to grow.</p>

<h2>Final Tips</h2>
<p>Try before you buy if possible. Ask club players or coaches for recommendations. And remember: the best racket is the one that feels right in your hand and lets you develop your game.</p>`,
        image: "/images/about.png",
        authorName: "Coach Zhang",
        categoryId: blogCatIds[1],
        publishedAt: new Date("2026-06-15"),
      },
      {
        slug: "top-10-training-drills-for-club-players",
        title: "Top 10 Training Drills for Club Players",
        excerpt: "Effective drills you can do with a partner or robot to improve consistency, footwork, and match readiness.",
        body: `<p>Structured practice is the fastest way to improve. These ten drills are designed for club players who want to build consistency, footwork, and match readiness—whether you train with a partner or a robot.</p>

<h2>1. Forehand–Backhand Counter</h2>
<p>Partner feeds to your forehand, you counter to their backhand. They return to your backhand, you counter to their forehand. Focus on consistency and rhythm. Aim for 20+ balls without error.</p>

<h2>2. Two-Ball Forehand</h2>
<p>Partner feeds two balls to your forehand: one to the left, one to the right. Move, hit, recover. Repeat. This builds footwork and recovery.</p>

<h2>3. Backhand Block, Forehand Loop</h2>
<p>Partner feeds topspin to your backhand. You block. They return to your forehand. You loop. Repeat. This simulates a common match pattern.</p>

<h2>4. Short Serve, Receive, Loop</h2>
<p>Partner serves short backspin. You push or flip. They push long. You loop. Full sequence from serve to attack.</p>

<h2>5. Multiball Forehand Loop</h2>
<p>Partner feeds backspin to your forehand. You loop. Repeat 20–30 times. Focus on consistency and spin, not power.</p>

<h2>6. Shadow Play</h2>
<p>No ball. Practice footwork patterns: side-to-side, in-and-out. Move as if you're playing. Great for conditioning and muscle memory.</p>

<h2>7. Serve and Third Ball</h2>
<p>You serve. Partner receives. You attack the third ball. Repeat. Vary your serves and placement.</p>

<h2>8. Random Placement</h2>
<p>Partner feeds to random positions on the table. You move and play every ball. This simulates match unpredictability.</p>

<h2>9. First Ball Attack</h2>
<p>Partner serves. You attack immediately (flip or loop). No second chances. Builds aggressive receiving.</p>

<h2>10. Match Simulation</h2>
<p>Play best-of-5 sets with a partner. Focus on one specific tactic (e.g. serve to forehand, attack third ball). Practice under pressure.</p>

<h2>Final Tips</h2>
<p>Start with drills you can complete consistently, then gradually increase difficulty. Ask a coach for feedback if possible. And remember: the best training is the one you do regularly.</p>`,
        image: "/images/person-image.png",
        authorName: "Coach Zhang",
        categoryId: blogCatIds[3],
        publishedAt: new Date("2026-06-01"),
      },
    ];
    for (const p of samplePosts) {
      await prisma.blogPost.upsert({
        where: { slug: p.slug },
        update: { body: p.body } as any,
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
