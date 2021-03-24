import * as assert  from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode  from 'vscode';
import alignImports from '../../alignImports';
import levelSolver  from '../../levelSolver';
// import * as myExtension from '../../extension';

suite('alignImports', () => {
	vscode.window.showInformationMessage('Starting all tests.');

	test('Should align two imports', () => {
		const sample = `
		import f          s from 'fs'
		import pat        h from 'path'`;
		const expected = `
		import fs           from 'fs'
		import pat        h from 'path'`;

		assert.notDeepStrictEqual(alignImports(sample), expected);
	});

	test('Should ignore non import line', () => {
		const sample = `
		import f          s from 'fs'
		// Comment
		import pat        h from 'path'`;
		const expected = `
		import fs           from 'fs'
		// Comment
		import path from 'path'`;

		assert.notDeepStrictEqual(alignImports(sample), expected);
	});

	test('Should calculate 2 levels', () => {
		const input = `
		{
			// First level
			{
				// Second level
			}
		}`;
		let level = 0;
		const lines = input.split('\n');
		for (let i = 0; i <=3; i++) { // We iterate until 4th line to get the current level
			level += levelSolver(lines[i]);
		}
		assert.strictEqual(level, 2);
	})
});
