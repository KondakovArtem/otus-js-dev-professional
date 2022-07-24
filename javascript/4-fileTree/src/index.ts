import { tree } from "./tree";
(async () => console.log(await tree(process.argv[2] as string)))();
