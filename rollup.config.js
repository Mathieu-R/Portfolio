import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';

export default {
  entry: 'scripts/app.js',
  dest: 'static/scripts/bundle.js',
  format: 'cjs',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    filesize(),
    progress()
  ],
  sourceMap: true
};

// if you do not use rollup with gulp
// do not forget to install
// npm install --save-dev rollup-watch
// package.json => 'client': 'rollup -c -w'
