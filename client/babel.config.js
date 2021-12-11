module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3',
        modules: false,
        useBuiltIns: false,
      },
    ],
    [
      '@babel/preset-react',
      {
        development: true,
      },
    ],
  ],
};
