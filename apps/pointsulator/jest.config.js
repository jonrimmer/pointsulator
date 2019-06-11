module.exports = {
  name: 'pointsulator',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/pointsulator',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
