import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
// import less from 'rollup-plugin-less'
import json from 'rollup-plugin-json'
import sourcemaps from 'rollup-plugin-sourcemaps'
import url from 'rollup-plugin-url'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      name: 'ssr',
      format: 'iife',
    },
  ],
  external: ['react', 'react-dom', 'prop-types'],
  sourcemap: true,
  plugins: [
    resolve({
      browser: false,
      extensions: ['.js', '.json'],
    }),
    commonjs({
      namedExports: {
        'node_modules/react-hotkeys/lib/index.js': ['HotKeys'],
      },
    }),
    url({}),
    json(),
    postcss({}),
    sourcemaps({
      exclude: ['node_modules/**'],
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
  ],
}
