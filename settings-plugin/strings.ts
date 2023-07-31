// Ports https://github.com/iteufel/node-strings-file/blob/master/index.js to TyeScript and ESM:

import fs from "fs";
import iconv from "iconv-lite";

type ParsedStrings = {
  [key: string]: string | { value: string; comment: string };
};

export function parse(data: string, wantComments?: boolean): ParsedStrings {
  if (data.indexOf("\n") === -1) {
    data += "\n";
  }
  const re = /(?:\/\*(.+)\*\/\n)?(.+)\s*\=\s*\"(.+)\"\;\n/gim;
  const res: ParsedStrings = {};
  let m: RegExpExecArray | null;

  while ((m = re.exec(data)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    if (m[2].substring(0, 1) === '"') {
      m[2] = m[2].trim().slice(1, -1);
    }
    if (wantComments) {
      res[m[2]] = {
        value: unescapeString(m[3]),
        comment: m[1] || "",
      };
    } else {
      res[m[2]] = unescapeString(m[3]);
    }
  }
  return res;
}

export function compile(obj: ParsedStrings): string {
  let data = "";
  for (const i in obj) {
    if (typeof obj[i] === "object") {
      if (obj[i]["comment"] && obj[i]["comment"].length > 0) {
        data += "\n/*" + obj[i]["comment"] + "*/\n";
      }
      data += '"' + i + '" = ' + '"' + escapeString(obj[i]["value"]) + '";\n';
    } else if (typeof obj[i] === "string") {
      data +=
        '\n"' +
        i +
        '" = ' +
        '"' +
        escapeString(
          // @ts-expect-error
          obj[i]
        ) +
        '";\n';
    }
  }
  return data;
}

function escapeString(str: string): string {
  return str.replace(/\"/gim, '\\"');
}

function unescapeString(str: string): string {
  return str.replace(/\\"/gim, '"');
}

export async function readStrings(file: string, wantComments?: boolean) {
  const data = await fs.promises.readFile(file);

  return parse(iconv.decode(data, "utf-16"), wantComments);
}

export function readStringsSync(
  file: string,
  wantComments?: boolean
): ParsedStrings {
  const data = iconv.decode(fs.readFileSync(file), "utf-16");
  return parse(data, wantComments);
}

export function writeStrings(filename: string, data: ParsedStrings) {
  return fs.promises.writeFile(
    filename,
    iconv.encode(compile(data), "utf-16"),
    "binary"
  );
}

export function writeStringsSync(filename: string, data: ParsedStrings): void {
  return fs.writeFileSync(filename, iconv.encode(compile(data), "utf-16"));
}
