import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import alignImports from '../../alignImports';
// import * as myExtension from '../../extension';

suite('alignImports', () => {
	vscode.window.showInformationMessage('Starting all tests.');

	test('Should align two imports', () => {
		const sample = `
		import fs from 'fs'
		import path from 'path'`;
		const expected = `
		import fs   from 'fs'
		import path from 'path'`;

		assert.notDeepStrictEqual(alignImports(sample), expected);
	});
});
