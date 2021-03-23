import * as vscode         from 'vscode';
import { Position, Range } from "vscode";

export default (text: string): void => {
  const lines = text.split('\n');
  let level = 0;
  const imports: Map<number, number> = new Map();

  for (let i = 0; i < lines.length; i++) {
    // trim white spaces
    const line = lines[i].trim();
    if (/^import.*from.*/.test(line) && level === 0) {   // It is an import on level 0
      const fromPosition = line.indexOf('from'); // TODO: This is not the better way
      imports.set(i, fromPosition);
    }
  }

  const highestPosition = Array.from(imports.entries()).reduce((accum: number, line) => {
    if (accum < line[1]) {
      accum = line[1];
    }
    return accum;
  }, 0);

  let start: number[] = [0, 0];
  let end: number[] = [0, 0];

  const editor = vscode.window.activeTextEditor;

  Array.from(imports.entries()).forEach((entry, index) => {
    const pos = entry[1];
    if (index === 0) {
      start[0] = entry[0];
    } else {
      end[0] = entry[0];
      end[1] = lines[entry[0]].length;
    }
    if (pos < highestPosition) {
      const line = lines[entry[0]];
      const preLine = line.slice(0, pos);
      const postLine = Array(highestPosition - pos).fill(' ').join('') + line.slice(pos);
      const newLine = preLine + postLine;

      const start = new Position(entry[0], 0);
      const end = new Position(entry[0], line.length);
      const range = new Range(start, end)
      if (editor) {
        editor.edit(editBuilder => {
          editBuilder.replace(range, newLine);
        });
      }
    }
  });
};