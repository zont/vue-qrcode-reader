import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import vue from 'rollup-plugin-vue';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/vue-qrcode-reader.common.js',
    format: 'cjs',
    intro: 'var process = { env: { NODE_EN: \'production\' } };'
  },
  plugins: [
    vue(),
    resolve({ module: true, jsnext: true, browser: true }),
    commonjs(),
    babel({
      babelrc: false,
      presets: [
        [
          'env',
          {
            modules: false,
            targets: {
              browsers: ['last 2 versions', 'not dead'],
              uglify: true
            }
          }
        ]
      ],
      plugins: ['external-helpers']
    }),
    uglify()
  ]
};
