import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-add', () => {
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

    it('成功在目标项目中添加Font-awesome', async () => {
        const tree = await runner.runSchematicAsync('ng-add', {}, appTree).toPromise();
        const moduleContent = tree.readContent('/projects/hello/src/app/app.module.ts');

        expect(moduleContent).toMatch(/import.*FontAwesomeModule.*from '@fortawesome\/angular-fontawesome'/);
        expect(moduleContent).toMatch(/imports:\s*\[[^\]]+?,\r?\n\s+FontAwesomeModule\r?\n/m);

        // 验证 Component 的內容
        const componentContent = tree.readContent('/projects/hello/src/app/app.component.ts');
        expect(componentContent).toMatch(/import.*faCoffee.*from '@fortawesome\/free-solid-svg-icons'/);
        expect(componentContent).toContain('faCoffee = faCoffee;');

        // 验证 HTML 的內容
        const htmlContent = tree.readContent('/projects/hello/src/app/app.component.html');
        expect(htmlContent).toContain('<fa-icon [icon]="faCoffee"></fa-icon>');

        // 验证 package.json 的內容
        const packageJson = JSON.parse(tree.readContent('/package.json'));
        const dependencies = packageJson.dependencies;
        expect(dependencies['@fortawesome/fontawesome-svg-core']).toBeDefined();
        expect(dependencies['@fortawesome/free-solid-svg-icons']).toBeDefined();
        expect(dependencies['@fortawesome/angular-fontawesome']).toBeDefined();

        // 验证是否有执行安裝 package 的 task
        expect(runner.tasks.some(task => task.name === 'node-package')).toBe(true);
    });
});