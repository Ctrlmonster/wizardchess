class MyGridTable extends GridTable {
  constructor(scene, x, y, width, height, config) {
    super(scene, x, y, width, height, config);
    // ...
    scene.add.existing(this);
  }
  // ...

}