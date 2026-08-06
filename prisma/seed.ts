import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;

  if (!username || !password || !name) {
    throw new Error(
      "ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_NAME must be set in .env before seeding"
    );
  }

  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { username },
    update: { password: hash, name, role: "ADMIN", active: true },
    create: { username, password: hash, name, role: "ADMIN" },
  });

  const counter = await prisma.counter.upsert({
    where: { id: "receipt" },
    update: {},
    create: { id: "receipt", value: 0 },
  });

  console.log(`Seeded admin user "${admin.username}" (${admin.name})`);
  console.log(`Receipt counter at ${counter.value}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
