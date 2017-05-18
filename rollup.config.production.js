import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import hash from 'rollup-plugin-hash'; // production
import cleanup from 'rollup-plugin-cleanup'; // production

export default {
  entry: 'scripts/app.js',
  dest: 'static/scripts/bundle.js',
  format: 'cjs',
  plugins: [
    cleanup(),
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    filesize(),
    progress(),

  ],
  sourceMap: false
};

// if you do not use rollup with gulp
// do not forget to install
// npm install --save-dev rollup-watch
// package.json => 'client': 'rollup -c -w'

// vue-rollup-plugin extract automatically css of your Vue components
// in a bundle.css file
// only if it is in the components not in a file apart (via src = "...")
