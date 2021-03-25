// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import sortImports from './alignImports';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	vscode.commands.registerCommand('align-imports.align', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			sortImports(editor.document.getText())
		}
	})

	vscode.workspace.onWillSaveTextDocument(async (document) => {
		const activeOnSave = vscode.workspace.getConfiguration('align-imports').get('alignOnSave')
		if (activeOnSave) {
			document.waitUntil(sortImports(document.document.getText()))
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
