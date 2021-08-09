#!/usr/bin/env node

import meow from "meow";
import generateStore from "./generate";

const cli = meow(
  `
	Usage
	  $ generate-store <destination>

	Options
    --cwd=<dir>               Working directory for store
    --type=<reducer | single | global>   Default is global,single create store in single file, reducer is using with useReducer

	Examples
	  Generate a sample store into src/store
	  $ generate-store src/store 
`,
  {
    flags: {
      cwd: {
        type: "string",
        default: process.cwd(),
      },
      type: {
        type: "string",
        default: "global",
      },
    },
  },
);

generateStore(cli.input[0] || "", {
  cwd: cli.flags.cwd,
  type: cli.flags.type,
});
