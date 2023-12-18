import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { escape } from "https://deno.land/x/safe_string_literal/index.js";
import { exec } from "https://deno.land/x/exec/mod.ts";

const env = await load();
console.log("env:", typeof env, "|", env);

const filterObjectByKeys = (obj, filterKey) => {
    return Object.keys(obj).
            filter((key) => key.includes(filterKey)).
            reduce((cur, key) => { return Object.assign(cur, { [key]: obj[key] })}, {});
}

const filterObjectWithoutKeys = (obj, filterKey) => {
    return Object.keys(obj).
            filter((key) => !key.includes(filterKey)).
            reduce((cur, key) => { return Object.assign(cur, { [key]: obj[key] })}, {});
}

const commands = filterObjectByKeys(env, "COMMAND")
const variables = filterObjectWithoutKeys(env, "COMMAND")
let execString = escape(`${commands["COMMAND1"]} `)

let variablesStringWithReturnCarriage = "\n"
for (const [key, value] of Object.entries(variables)) {
    variablesStringWithReturnCarriage += escape(` ${key}=${value} `) + "\n"
    execString += escape(` ${key}=${value} `)
}
execString += escape(` ${commands["COMMAND2"]}`)

console.log(`use the command: '${commands["COMMAND1"]}'`)
console.log(`loading the variables: ${variablesStringWithReturnCarriage}`)
console.log(`to finally exec the command: '${commands["COMMAND2"]}'`)
console.log("...")

console.log("run the ESCAPED exec_string:", execString)
const shouldProceed = prompt("Do you want to proceed? [y/N] ");
const check = shouldProceed.toLowerCase()[0] === "y"
console.log("Should proceed?", shouldProceed, check);
if (!check) {
    console.log("exit...");
    Deno.exit(1);
}
console.log("running command...");
await exec(execString)
