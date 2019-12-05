import {
  Rule, SchematicContext, Tree,
  apply, mergeWith, url,
  move,
  applyTemplates
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

import { CrudServiceSchema as Schema } from './schema'
import { getParsePath } from '../component/index';

export function crud(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    // 获取到在angular cli工作区下的 路劲和要生成的service 前缀name
    const { name, path } = getParsePath(tree, _options);

    // 读取模板文件
    const sourceTemplates = url('./files');

    // 应用模板文件
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      applyTemplates({
        ..._options,
        ...strings,
        name
      }),
      move(path) // 将创建好的模板文件移动到指定位置
    ]);

    // 将传入的值(option)与模板文件合并(传入值替代模板变量值)
    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}

