import C from './constants';

/**
 * Draws a vector on the slide. Assumes that you're calling this in a slide
 * context, for example:
 *
 * let slide = present.slide().reveal();
 * slide = addVector(slide, [0, 0, 0], [1, 1, 1]);
 * slide = slide.end(); // Puts next vector on separate slide
 * slide = addVector(slide, [-1, -1, -1], [1, 1, 1]);
 *
 * @param {slide} slide - The mathbox presentation
 * @param {Array[3]} from - Coordinate of vector start
 * @param {Array[3]} to - Coordinate of vector end
 * @param {object} vecOpts - Arguments to pass into vector()
 */
const DEFAULT_VEC_OPTS = {
  width: 6,
  end: true,
};
export function addVector(slide, from, to, vecOpts = {}) {
  return slide
    .voxel({
      data: [
        ...from,
        ...to,
      ],
      items: 2,
      channels: 3,
    })
    .vector(Object.assign({}, DEFAULT_VEC_OPTS, vecOpts));
}

/**
 * Draws multiple vectors on the slide.
 *
 * @param {slide} slide - The mathbox presentation
 * @param {Array[n][2][3]} coords - Array containing from, to pairs
 * @param {object} vecOpts - Arguments to pass into vector()
 * @param {bool} sequential - If true, the vectors will each be added one by
 *     one
 */
export function addVectors(slide, coords, vecOpts = {}, sequential = true) {
  return coords.reduce((sl, [from, to]) => {
      if (sequential)
        sl = sl.slide().reveal();
      return addVector(sl, from, to, vecOpts);
    },
    slide,
  );
}

/**
 * Adds a simple box tree to a slide.
 *
 * @param {slide} slide - The mathbox presentation
 */
export function addTree(slide) {
  return slide
    .voxel(C.treeLeavesData)
    .face({ color: C.treeLeavesColor })
    .voxel(C.treeTrunkData)
    .face({ color: C.treeTrunkColor });
}


/**
 * Returns the 3D world coordinates of a pixel on the sensor.
 *
 * @param {int} i - Height position on the sensor
 * @param {int} j - Width position on the sensor
 */
export function toSensorCoords(i, j) {
  return [-2, (i - 10) * 0.1 + 0.05, (10 - j) * 0.1 + 0.05];
}

/**
 * Returns a pair of 3D coordinates used to draw a vector onto the sensor
 * through the pinhole.
 *
 * @param {Array[3]} sensorCoord - World coordinates of the sensor pixel
 * @param {float} fromXPos - Starting x position of the light ray.
 */
export function coordsThroughPinhole(sensorCoord, fromXPos) {
  const [x, y, z] = sensorCoord;
  const multiple = (fromXPos - x) / x;
  return [
    [x + multiple * x, y + multiple * y, z + multiple * z],
    sensorCoord,
  ];
}
