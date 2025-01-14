import { prisma } from "./configs/prisma";

const main = async () => {
  const systemTagNames = [
    // 収入カテゴリ
    { name: "給与" },
    { name: "賞与" },
    { name: "副収入" },
    { name: "投資収入" },
    { name: "臨時収入" },

    // 固定費カテゴリ
    { name: "住居費" },
    { name: "水道光熱費" },
    { name: "通信費" },
    { name: "保険料" },
    { name: "ローン返済" },

    // 変動費カテゴリ
    { name: "食費" },
    { name: "日用品" },
    { name: "交通費" },
    { name: "医療費" },
    { name: "衣服費" },

    // 娯楽・趣味カテゴリ
    { name: "外食" },
    { name: "娯楽費" },
    { name: "旅行" },
    { name: "書籍" },
    { name: "習い事" },

    // その他
    { name: "教育費" },
    { name: "贈答費" },
    { name: "雑費" },
  ];

  const systemTags = await Promise.all(
    systemTagNames.map(
      async (tag) =>
        await prisma.systemTag.upsert({
          where: { name: tag.name },
          update: {},
          create: {
            name: tag.name,
          },
        })
    )
  );

  console.log(systemTags);
};

main()
  .then(async () => {
    console.log("Seed complete.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(`Seed error with: ${e}`);
    await prisma.$disconnect();
    process.exit(1);
  });
