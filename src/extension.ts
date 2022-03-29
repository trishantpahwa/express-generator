// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as cp from 'child_process';
import { error } from 'console';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "express-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('express-generator.generate-express', () => {
		// The code you place here will be executed every time your command is executed
		const _path = vscode.workspace.rootPath;
		if (_path) {
			const snippets = JSON.parse(fs.readFileSync(__dirname + '/snippets/snippets.json').toString());
			function addSnippet(snippetType: string) {
				return snippets[snippetType].body.join('');
			}
			fs.mkdirSync(_path + '/src');
			fs.writeFileSync(_path + '/src/index.js', addSnippet('app'));
			fs.mkdirSync(_path + '/src/models');
			fs.writeFileSync(_path + '/src/models/index.js', addSnippet('models'));
			fs.mkdirSync(_path + '/src/routes');
			fs.writeFileSync(_path + '/src/routes/index.js', addSnippet('routes'));
			fs.mkdirSync(_path + '/src/controllers');
			fs.writeFileSync(_path + '/src/controllers/index.js', addSnippet('controllers'));
			fs.mkdirSync(_path + '/src/services');
			fs.writeFileSync(_path + '/src/services/index.js', addSnippet('servicesIndex'));
			fs.writeFileSync(_path + '/src/services/my.service.js', addSnippet('myService'));
			fs.mkdirSync(_path + '/tests');
			vscode.workspace.openTextDocument(_path + '/src/index.js').then(function (doc: any) {
				vscode.window.showTextDocument(doc);
			});
			cp.exec('npm i -S express cors body-parser morgan --prefix ' + _path, function (err, stdout, stderr) {
				if (err) {
					vscode.window.showInformationMessage('Unable to install packages.');
				} else {
					vscode.window.showInformationMessage('Installed packages.');
				}
			});
			// Display a message box to the user
			vscode.window.showInformationMessage('Generated express app.');
		} else {

			vscode.window.showErrorMessage('Open a folder in workspace to generate express app in.');
		}
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
