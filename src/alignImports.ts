import * as vscode         from 'vscode';
import { Position, Range } from "vscode"
import levelSolver         from './levelSolver';

export default async (text: string): Promise<void> => {
  const lines = text.split('\n');
  let level = 0;
  const imports: Map<number, number> = new Map();

  for (let i = 0; i < lines.length; i++) {
    // trim white spaces
    level += levelSolver(lines[i]);
    const line = lines[i].trim();
    if (/^import .* from .*/.test(line) && level === 0) {   // It is an import on level 0
      const fromPosition = line.indexOf('from');
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

  const ranges: [Range, string][] = []

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
      ranges.push([range, newLine])
      // if (editor) {
      //   console.log(`Editing ${line}`)
      //   editor.edit(editBuilder => {
      //     editBuilder.replace(range, newLine);
      //     console.log(`   Edited`)
      //   });
      // }
    }
  });

  const process = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (ranges.length === 0) {
        resolve()
        return
      }
      
      const actual = ranges.splice(0, 1)[0]
      if (editor) {
        editor.edit((editBuilder) => {
          editBuilder.replace(actual[0], actual[1]);
        }).then(() => {
          process().then(resolve)
        });
      }
    })
  }

  await process()
};