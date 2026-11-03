const ua = process.env.npm_config_user_agent ?? "";
const execPath = process.env.npm_execpath ?? "";
const isPnpm = ua.startsWith("pnpm/") || /pnpm/i.test(execPath);

if (!isPnpm) {
  const detected = ua.split(" ")[0] || "npm";
  console.error(
    [
      "",
      `This repository uses pnpm (packageManager: pnpm@9.15.4); detected ${detected}.`,
      "",
      "Don't run npm or yarn here. They crash on pnpm's symlinked node_modules",
      "and cannot resolve the \"workspace:*\" dependencies.",
      "",
      "Use instead:",
      "  pnpm install",
      "  pnpm add <pkg> --filter @rota/frontend",
      "  pnpm --filter @rota/frontend exec expo install <pkg>",
      "",
    ].join("\n"),
  );
  process.exit(1);
}
