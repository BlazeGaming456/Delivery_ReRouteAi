//unshift - adds element to the front of an array
//shift - removes the last element from an array

import getDistance from "./StraightDistance";

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(item, priority) {
        this.elements.push({item, priority});
        this.elements.sort((a,b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().item;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

export default function Astar(graph, startId, goalId, warehouses) {
    const openSet = new PriorityQueue();
    openSet.enqueue(startId, 0);

    const cameFrom = {};
    const gscore = {};
    const fscore = {};

    warehouses.forEach(w => {
        gscore[w.id] = Infinity;
        fscore[w.id] = Infinity;
    })

    gscore[startId] = 0;
    fscore[startId] = getDistance(
        warehouses[startId].coordinates[0],
        warehouses[startId].coordinates[1],
        warehouses[goalId].coordinates[0],
        warehouses[goalId].coordinates[1],
    )

    while(!openSet.isEmpty()) {
        //We dequeue the current node with the lowest fscore
        const current = openSet.dequeue();

        //If we reached the goal, we reconstruct the path, by backtracking from the goalId
        if (current == goalId) {
            const path = [];
            let temp = goalId;
            while (temp!=startId) {
                path.unshift(temp);
                temp = cameFrom[temp];
            }
            path.unshift(startId);
            return path;
        }

        for (const neighbor of graph[current]) {
            const tentativeG = gscore[current] + neighbor.cost;

            //If we get a better path to the neighbor or a lower gscore
            if (tentativeG < gscore[neighbor.node]) {
                cameFrom[neighbor.node] = current;
                gscore[neighbor.node] = tentativeG;
                fscore[neighbor.node] = gscore[neighbor.node] + getDistance(
                    warehouses[neighbor.node].coordinates[0],
                    warehouses[neighbor.node].coordinates[1],
                    warehouses[goalId].coordinates[0],
                    warehouses[goalId].coordinates[1],
                );
                openSet.enqueue(neighbor.node, fscore[neighbor.node]);
            }
        }
    }
}