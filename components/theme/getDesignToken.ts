import { createTheme, getComputedToken } from '@ant-design/cssinjs';

import type { ThemeConfig } from '../config-provider/context';
import type { AliasToken } from './interface';
import defaultDerivative from './themes/default';
import seedToken from './themes/seed';
import formatToken from './util/alias';

const getDesignToken = (config?: ThemeConfig): AliasToken => {
  // 如果传了算法，就根据算法生成主题（包含 map token），反之根据默认的 seed token 生成默认的 map token
  const theme = config?.algorithm ? createTheme(config.algorithm) : createTheme(defaultDerivative);
  const mergedToken = {
    ...seedToken,
    ...config?.token,
  };

  // getComputedToken 方法生成 alias token 合入 组件 token
  //
  return getComputedToken(mergedToken as any, { override: config?.token }, theme, formatToken);
};

export default getDesignToken;
