import { prisma } from "./configs/prisma";

const main = async () => {
  const systemTagNames = [
    // 収入カテゴリ
    { name: "給与", type: "income" },
    { name: "賞与", type: "income" },
    { name: "副収入", type: "income" },
    { name: "投資収入", type: "income" },
    { name: "臨時収入", type: "income" },

    // 固定費カテゴリ
    { name: "住居費", type: "expense" },
    { name: "水道光熱費", type: "expense" },
    { name: "通信費", type: "expense" },
    { name: "保険料", type: "expense" },
    { name: "ローン返済", type: "expense" },

    // 変動費カテゴリ
    { name: "食費", type: "expense" },
    { name: "日用品", type: "expense" },
    { name: "交通費", type: "expense" },
    { name: "医療費", type: "expense" },
    { name: "衣服費", type: "expense" },

    // 娯楽・趣味カテゴリ
    { name: "外食", type: "expense" },
    { name: "娯楽費", type: "expense" },
    { name: "旅行", type: "expense" },
    { name: "書籍", type: "expense" },
    { name: "習い事", type: "expense" },

    // その他
    { name: "教育費", type: "expense" },
    { name: "贈答費", type: "expense" },
    { name: "雑費", type: "expense" },
  ];

  const systemTags = await prisma.$transaction(async (tx) => {
    return await Promise.all(
      systemTagNames.map(
        async (tag) =>
          await tx.systemTag.upsert({
            where: { name: tag.name },
            update: {},
            create: { name: tag.name, type: tag.type },
          })
      )
    );
  });

  console.log(
    systemTags.map((tag) => ({ id: tag.id, name: tag.name, type: tag.type }))
  );
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
