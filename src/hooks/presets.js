export const presets = {
  identity: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
  sharpen: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
  gaussianBlur: [[1, 2, 1], [2, 4, 2], [1, 2, 1]].map(row => row.map(v => v / 16)),
  boxBlur: [[1, 1, 1], [1, 1, 1], [1, 1, 1]].map(row => row.map(v => v / 9)),
  prewittX: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
  prewittY: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]]
};