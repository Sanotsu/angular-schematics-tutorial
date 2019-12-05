import * as path from 'path';

import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { strings } from '@angular-devkit/core';

const collectionPath = path.join(__dirname, '../collection.json');


describe('crudService', () => {

  const name = 'apple';
  const runner = new SchematicTestRunner('schematics', collectionPath);

  // 模拟ng new创建angular项目，主要对workspace和application进行配置

  // angular项目的配置
  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',              // 不重要的名字，随意取，不影响测试结果
    newProjectRoot: 'projects',     // 项目app的根目录，可以随意取，但是验证会用到
    version: '6.0.0',               // 版本号，随意，不影响测试
  };
  const appOptions: ApplicationOptions = {
    name: 'crudService',            // 项目名称
    inlineStyle: false,             // 以下是项目属性，随意true/false，不影响测试结果
    inlineTemplate: false,
    routing: false,
    style: Style.Css,
    skipTests: false,
    skipPackageJson: false,
  };

  // 调用 SchematicTestRunner 的 runExternalSchematicAsync 方法，并以给出的参数生成angular项目
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

  it('works', async () => {

    const tree = await runner.runSchematicAsync('crudService', { name }, appTree).toPromise();

    const dasherizeName = strings.dasherize(name);
    /*
        // 预期生成的文件
        const expectFiles = [
          `/projects/crudService/src/app/${dasherizeName}-crud.service.spec.ts`,
          `/projects/crudService/src/app/${dasherizeName}-crud.service.ts`,
        ]
    
        // 如果实际模拟的angular项目中拥有预期生成的文件,则将它从expectFiles中移除
        for (const v of tree.files) {
          for (let i = 0; i < expectFiles.length; i++) {
            const e = expectFiles[i];
            if (v.toString() === e) {
              expectFiles.splice(i, 1);
            }
          }
        }
    
        //如果预期生成的文件都有生成,那么预期的应该是0=0成立
        expect(0).toEqual(expectFiles.length);
    */

    //当然,还有toContain方法,是否包含.
    // 上面几个步骤可以改为
    expect(tree.files).toContain(`/projects/crudService/src/app/${dasherizeName}-crud.service.spec.ts`);
    expect(tree.files).toContain(`/projects/crudService/src/app/${dasherizeName}-crud.service.ts`);

  });

});
