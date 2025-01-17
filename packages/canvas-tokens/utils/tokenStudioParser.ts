import {kebabCase} from 'case-anything';
import {DesignToken} from 'style-dictionary/types/DesignToken';

export function resolveRef(ref: string, resolver: (full: string, ref: string) => string) {
  // comment explaining what this RegExp does.
  return ref.replace(/\{([^}]+)\}/gi, resolver);
}

export const tokenStudioParser = ({contents}: any) => {
  const parsed = JSON.parse(contents);

  if (parsed.sys) {
    delete parsed.sys['More styles'];
  }

  if (parsed.base) {
    const {dimension} = parsed.base.base;
    delete parsed.base.base;
    parsed.base.dimension = dimension;
  }

  const updateTokens = (token: DesignToken) => {
    transformExtensions(token);
    transformRefs(token);
    return token;
  };

  mapObjectContent(updateTokens, parsed);

  return parsed;
};

const getLevel = (ref: string) => {
  const levels = ['base', 'brand', 'sys'];
  const [key] = ref.split('.');
  return !levels.includes(key) && 'base';
};

const transformRefs = (token: DesignToken) => {
  const {value} = token;

  const replacePx = (value: string, key: string) =>
    ['x', 'y', 'blur', 'spread', 'width'].includes(key) && value !== '0'
      ? `${parseFloat(value) / 16}rem`
      : value;

  const updateInnerValue = (value: string, key: string): string => {
    const noRefValue = replaceByFullRef(value);
    return replacePx(noRefValue, key);
  };

  if (typeof value === 'string') {
    token.value = replaceByFullRef(value);
    return;
  }

  if (value.length) {
    value.forEach((val: Record<string, string>, index: number) => {
      token.value[index] = updateObjectValue(val, kebabCase, updateInnerValue);
    });
    return;
  }

  token.value = updateObjectValue(value, kebabCase, updateInnerValue);
};

const updateObjectValue = (
  value: Record<string, string>,
  updateKeyFn?: (key: string) => string,
  updateValueFn?: (value: string, key: string) => string
) => {
  return Object.entries(value).reduce((acc: Record<string, string>, [prop, propValue]) => {
    if (updateKeyFn) {
      prop = updateKeyFn(prop);
    }
    if (updateValueFn) {
      propValue = updateValueFn(propValue, prop);
    }

    acc[prop] = propValue;

    return acc;
  }, {});
};

const replaceByFullRef = (value: string) => {
  // add level to ref if it's missed
  return resolveRef(value, (full, ref) => {
    const level = getLevel(ref);
    return level ? `{${level}.${ref}}` : full;
  });
};

// Resolving extensions

const getKeys = (obj: object): string[] => Object.keys(obj);

const mapObjectContent = (fn: (token: DesignToken) => DesignToken, obj: DesignToken) => {
  if (obj.value) {
    return fn(obj);
  }

  const keys = getKeys(obj);
  keys.forEach(key => {
    mapObjectContent(fn, obj[key]);
  });
};

const transformExtensions = (token: DesignToken) => {
  if (token['$extensions']) {
    delete token['$extensions'];
  }
};
