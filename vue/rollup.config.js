import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2';

const extensions = ['.js', '.ts'];
export default {
  input: './src/index.js',
  output: {
    format: 'umd', // 模块化类型
    file: 'dist/umd/vue.js',
    name: 'Vue', // 打包后的全局变量的名字
    sourcemap: true
  },
  plugins: [
    typescript(/*{ plugin options }*/),
    nodeResolve({
      extensions,
      modulesOnly: true,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
    process.env.ENV === 'development' ? serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: ''
    }) : null
  ]
}