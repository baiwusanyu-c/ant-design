import { generate, presetPalettes, presetPrimaryColors } from '@ant-design/colors';

import type { MapToken, PresetColorType, SeedToken } from '../../interface';
import { defaultPresetColors } from '../seed';
import genColorMapToken from '../shared/genColorMapToken';
import genCommonMapToken from '../shared/genCommonMapToken';
import genControlHeight from '../shared/genControlHeight';
import genFontMapToken from '../shared/genFontMapToken';
import genSizeMapToken from '../shared/genSizeMapToken';
import { generateColorPalettes, generateNeutralColorPalettes } from './colors';

export default function derivative(token: SeedToken): MapToken {
  // pink is deprecated name of magenta, keep this for backwards compatibility
  presetPrimaryColors.pink = presetPrimaryColors.magenta;
  presetPalettes.pink = presetPalettes.magenta;
  const colorPalettes = Object.keys(defaultPresetColors)
    .map((colorKey) => {
      const colors =
        token[colorKey as keyof PresetColorType] === presetPrimaryColors[colorKey]
          ? presetPalettes[colorKey]
          : generate(token[colorKey as keyof PresetColorType]);
      return new Array(10).fill(1).reduce((prev, _, i) => {
        prev[`${colorKey}-${i + 1}`] = colors[i];
        prev[`${colorKey}${i + 1}`] = colors[i];
        return prev;
      }, {});
    })
    .reduce((prev, cur) => {
      // biome-ignore lint/style/noParameterAssign: it is a reduce
      prev = { ...prev, ...cur };
      return prev;
    }, {});

  return {
    // seedToken
    ...token,
    // ************ 以下是生成 map token，由 seed token 和 defaultPresetColors派生
    // 额外提供的颜色(已经生成颜色梯度)
    ...colorPalettes,
    // Colors
    // 根据 seed 的颜色 token 生成 颜色 map token
    ...genColorMapToken(token, {
      generateColorPalettes,
      generateNeutralColorPalettes,
    }),
    // Font
    ...genFontMapToken(token.fontSize),
    // Size
    ...genSizeMapToken(token),
    // Height
    ...genControlHeight(token),
    // Others
    ...genCommonMapToken(token),
  };
}
