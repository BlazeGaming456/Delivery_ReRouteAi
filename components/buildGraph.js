import getDistance from "./StraightDistance";

export default function buildGraph(warehouses) {
  const graph = {};
  const MAX_EDGE_DISTANCE = 100; // km, adjust as needed

  warehouses.forEach((w1) => {
    graph[w1.id] = [];

    warehouses.forEach((w2) => {
      if (w1.id != w2.id) {
        const dist = getDistance(
          w1.coordinates[0],
          w1.coordinates[1],
          w2.coordinates[0],
          w2.coordinates[1]
        );
        if (dist <= MAX_EDGE_DISTANCE) {
          graph[w1.id].push({
            node: w2.id,
            cost: dist,
          });
        }
      }
    });
  });

  return graph;
}
