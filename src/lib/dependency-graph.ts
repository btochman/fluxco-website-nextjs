import type { Task, TaskDependency } from "@/types/portal";
import type { TaskWithDependencies } from "@/hooks/useTasks";

/**
 * Represents a dependency graph as an adjacency list.
 * Key is task_id (the blocked task), values are blocked_by_ids (tasks that block it).
 */
export type DependencyGraph = Map<string, Set<string>>;

/**
 * Builds an adjacency list representation of task dependencies.
 * Maps each task to the set of tasks that block it.
 */
export function buildDependencyGraph(
  tasks: TaskWithDependencies[]
): DependencyGraph {
  const graph = new Map<string, Set<string>>();

  // Initialize all tasks in the graph
  for (const task of tasks) {
    graph.set(task.id, new Set());
  }

  // Add dependencies
  for (const task of tasks) {
    if (task.blocked_by) {
      for (const dep of task.blocked_by) {
        const blockers = graph.get(task.id) || new Set();
        blockers.add(dep.blocked_by_id);
        graph.set(task.id, blockers);
      }
    }
  }

  return graph;
}

/**
 * Detects cycles in the dependency graph using DFS.
 * Returns an array of arrays, where each inner array represents a cycle.
 */
export function detectCycles(tasks: TaskWithDependencies[]): string[][] {
  const graph = buildDependencyGraph(tasks);
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const path: string[] = [];

  function dfs(taskId: string): boolean {
    visited.add(taskId);
    recursionStack.add(taskId);
    path.push(taskId);

    const blockers = graph.get(taskId) || new Set();
    for (const blockerId of blockers) {
      if (!visited.has(blockerId)) {
        if (dfs(blockerId)) {
          return true;
        }
      } else if (recursionStack.has(blockerId)) {
        // Found a cycle - extract it from the path
        const cycleStart = path.indexOf(blockerId);
        const cycle = path.slice(cycleStart);
        cycles.push([...cycle]);
      }
    }

    path.pop();
    recursionStack.delete(taskId);
    return false;
  }

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      dfs(task.id);
    }
  }

  return cycles;
}

/**
 * Checks if adding a dependency from taskId -> blockedById would create a cycle.
 * Returns the cycle path if one would be created, null otherwise.
 */
export function wouldCreateCycle(
  taskId: string,
  blockedById: string,
  tasks: TaskWithDependencies[]
): string[] | null {
  // Build graph and temporarily add the new edge
  const graph = buildDependencyGraph(tasks);

  // Add the proposed dependency
  const blockers = graph.get(taskId) || new Set();
  blockers.add(blockedById);
  graph.set(taskId, blockers);

  // Check if we can reach taskId starting from blockedById
  // If so, adding this edge would create a cycle
  const visited = new Set<string>();
  const path: string[] = [];

  function dfs(currentId: string): string[] | null {
    if (currentId === taskId) {
      // Found a path back to the original task - this would be a cycle
      return [...path, currentId];
    }

    if (visited.has(currentId)) {
      return null;
    }

    visited.add(currentId);
    path.push(currentId);

    const currentBlockers = graph.get(currentId) || new Set();
    for (const blockerId of currentBlockers) {
      const result = dfs(blockerId);
      if (result) {
        return result;
      }
    }

    path.pop();
    return null;
  }

  return dfs(blockedById);
}

/**
 * Gets the full chain of blockers for a task (transitive closure).
 * Returns task IDs in order from immediate blockers to deepest.
 */
export function getBlockingChain(
  taskId: string,
  tasks: TaskWithDependencies[]
): string[] {
  const graph = buildDependencyGraph(tasks);
  const chain: string[] = [];
  const visited = new Set<string>();
  const queue: string[] = [];

  // Start with immediate blockers
  const immediateBlockers = graph.get(taskId) || new Set();
  for (const blockerId of immediateBlockers) {
    if (!visited.has(blockerId)) {
      queue.push(blockerId);
      visited.add(blockerId);
    }
  }

  // BFS to get all transitive blockers
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    chain.push(currentId);

    const blockers = graph.get(currentId) || new Set();
    for (const blockerId of blockers) {
      if (!visited.has(blockerId)) {
        queue.push(blockerId);
        visited.add(blockerId);
      }
    }
  }

  return chain;
}

/**
 * Performs topological sort on tasks based on dependencies.
 * Tasks with no dependencies come first.
 * Returns null if the graph has a cycle.
 */
export function topologicalSort(
  tasks: TaskWithDependencies[]
): TaskWithDependencies[] | null {
  const graph = buildDependencyGraph(tasks);
  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  // Calculate in-degrees (number of blockers for each task)
  const inDegree = new Map<string, number>();
  for (const task of tasks) {
    const blockers = graph.get(task.id) || new Set();
    inDegree.set(task.id, blockers.size);
  }

  // Build reverse graph (task -> tasks it blocks)
  const reverseGraph = new Map<string, Set<string>>();
  for (const task of tasks) {
    reverseGraph.set(task.id, new Set());
  }
  for (const task of tasks) {
    const blockers = graph.get(task.id) || new Set();
    for (const blockerId of blockers) {
      const blocks = reverseGraph.get(blockerId) || new Set();
      blocks.add(task.id);
      reverseGraph.set(blockerId, blocks);
    }
  }

  // Kahn's algorithm
  const queue: string[] = [];
  for (const task of tasks) {
    if ((inDegree.get(task.id) || 0) === 0) {
      queue.push(task.id);
    }
  }

  const sorted: TaskWithDependencies[] = [];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const task = taskMap.get(currentId);
    if (task) {
      sorted.push(task);
    }

    const blockedTasks = reverseGraph.get(currentId) || new Set();
    for (const blockedId of blockedTasks) {
      const newDegree = (inDegree.get(blockedId) || 0) - 1;
      inDegree.set(blockedId, newDegree);
      if (newDegree === 0) {
        queue.push(blockedId);
      }
    }
  }

  // If we didn't process all tasks, there's a cycle
  if (sorted.length !== tasks.length) {
    return null;
  }

  return sorted;
}

/**
 * Checks if a task is blocked by any incomplete tasks.
 */
export function isTaskBlocked(
  task: TaskWithDependencies,
  allTasks: TaskWithDependencies[]
): boolean {
  if (!task.blocked_by || task.blocked_by.length === 0) {
    return false;
  }

  const taskMap = new Map(allTasks.map((t) => [t.id, t]));

  for (const dep of task.blocked_by) {
    const blocker = taskMap.get(dep.blocked_by_id);
    if (blocker && blocker.status !== "done") {
      return true;
    }
  }

  return false;
}

/**
 * Gets all incomplete blocking tasks for a task.
 */
export function getIncompleteBlockers(
  task: TaskWithDependencies,
  allTasks: TaskWithDependencies[]
): TaskWithDependencies[] {
  if (!task.blocked_by || task.blocked_by.length === 0) {
    return [];
  }

  const taskMap = new Map(allTasks.map((t) => [t.id, t]));
  const blockers: TaskWithDependencies[] = [];

  for (const dep of task.blocked_by) {
    const blocker = taskMap.get(dep.blocked_by_id);
    if (blocker && blocker.status !== "done") {
      blockers.push(blocker);
    }
  }

  return blockers;
}
