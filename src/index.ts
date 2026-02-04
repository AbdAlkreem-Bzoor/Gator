import {addCommands, CommandsRegistry, runCommand} from "./commands/commands.ts";


async function main() {

  const [command, ...args] = process.argv.slice(2);

  // console.log(command);
  // args.forEach(arg => console.log(arg));

  if (command === "") {
    throw new Error("No command found");
  }

  const registry: CommandsRegistry = addCommands();

  if (!(command in registry)) {
    throw new Error(`No command found for ${command}`);
  }

  try {
    await runCommand(registry, command, ...args);
  } catch (err) {
    console.error(`Error running command ${command}: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
  process.exit(0);
}

await main();
