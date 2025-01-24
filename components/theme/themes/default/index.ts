import { generate } from '@ant-design/colors';
import genControlHeight from '../shared/genControlHeight';
import genSizeMapToken from '../shared/genSizeMapToken';
import type {
  ColorPalettes,
  LegacyColorPalettes,
  MapToken,
  PresetColorType,
  SeedToken,
} from '../../interface';
import { defaultPresetColors } from '../seed';
import genColorMapToken from '../shared/genColorMapToken';
import genCommonMapToken from '../shared/genCommonMapToken';
import { generateColorPalettes, generateNeutralColorPalettes } from './colors';
import genFontMapToken from '../shared/genFontMapToken';

export default function derivative(token: SeedToken): MapToken {
  const colorPalettes = Object.keys(defaultPresetColors)
    .map((colorKey: keyof PresetColorType) => {
      const colors = generate(token[colorKey]);

      return new Array(10).fill(1).reduce((prev, _, i) => {
        prev[`${colorKey}-${i + 1}`] = colors[i];
        prev[`${colorKey}${i + 1}`] = colors[i];
        return prev;
      }, {}) as ColorPalettes & LegacyColorPalettes;
    })
    .reduce(
      (prev, cur) => {
        prev = {
          ...prev,
          ...cur,
        };
        return prev;
      },
      {} as ColorPalettes & LegacyColorPalettes,
    );

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
