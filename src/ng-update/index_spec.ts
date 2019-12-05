import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-update', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const workspaceOptions: WorkspaceOptions = {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '6.0.0',
    };
    const appOptions: ApplicationOptions = {
        name: 'hello',
        inlineStyle: false,
        inlineTemplate: false,
        routing: false,
        style: Style.Css,
        skipTests: false,
        skipPackageJson: false,
    };

    let appTree: UnitTestTree;

    beforeEach(async () => {
        appTree = await runner.runExternalSchematicAsync(
            '@schematics/angular',
            'workspace',
            workspaceOptions
        ).toPromise();
        appTree = await runner.runExternalSchematicAsync(
            '@schematics/angular',
            'application',
            appOptions,
            appTree
        ).toPromise();
    });

    it('测试 ng update', async () => {

        const tree = await runner.runExternalSchematicAsync('./src/migration.json', 'migration002', {}, appTree).toPromise();
        const componentContent = tree.readContent('/projects/hello/src/app/app.component.ts');
        expect(componentContent).toContain('title = \'AngularSchematicsTutorial002\'');
    });
});