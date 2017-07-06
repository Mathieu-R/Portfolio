import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';

export default {
  entry: 'scripts/app.js',
  dest: 'static/scripts/bundle.js',
  format: 'cjs',
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    filesize(),
    progress()
  ],
  sourceMap: true
};
