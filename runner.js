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
let exec_string = escape(`${commands["COMMAND1"]} `)

for (const [key, value] of Object.entries(variables)) {
    exec_string += escape(` ${key}=${value} `)
}
exec_string += escape(` ${commands["COMMAND2"]}`)

console.log("run the ESCAPED exec_string:", exec_string)
const shouldProceed = confirm("Do you want to proceed?");
console.log("Should proceed?", shouldProceed);
if (!shouldProceed) {
    console.log("exit...");
    Deno.exit(1);
}
console.log("running command...");
await exec(exec_string)
