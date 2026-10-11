// 5 units per subject. Written from standard syllabus topics, not fetched live.
// Replace or extend these with real material when you have it.
export const SUBJECT_UNITS = {
  AIML: {
    name: 'AIML',
    units: [
      {
        id: 'aiml-1',
        title: 'Introduction to AI and Search',
        summary: 'Search algorithms explore states to reach a goal. Breadth-first search finds shortest paths in unweighted graphs. A* uses a heuristic to guide the search, and an admissible heuristic never overestimates the true cost.',
        questions: [
          { q: 'Which search uses a FIFO queue and finds the shortest path in an unweighted graph?', options: ['Depth-first search', 'Breadth-first search', 'Hill climbing', 'Greedy best-first'], correct: 1, why: 'BFS expands level by level, so the first path it finds has the fewest edges.' },
          { q: 'What makes A* different from uniform cost search?', options: ['It ignores path cost', 'It adds a heuristic estimate of the remaining cost', 'It only works on trees', 'It uses random restarts'], correct: 1, why: 'A* ranks nodes by cost so far plus an estimate of the cost to the goal.' },
          { q: 'A heuristic is admissible when it:', options: ['Overestimates the cost to the goal', 'Never overestimates the true cost', 'Always equals zero', 'Depends on the path taken'], correct: 1, why: 'Admissibility guarantees that A* with this heuristic returns an optimal path.' },
        ],
      },
      {
        id: 'aiml-2',
        title: 'Machine Learning Basics',
        summary: 'Supervised learning uses labeled data to predict outputs. Regression predicts continuous values and classification predicts categories. Overfitting means a model memorizes training data and generalizes poorly.',
        questions: [
          { q: 'Supervised learning requires:', options: ['Labeled data', 'No data at all', 'Only unlabeled data', 'Rewards from an environment'], correct: 0, why: 'Supervised learning learns a mapping from inputs to known labels.' },
          { q: 'Overfitting means the model:', options: ['Fits training data but generalizes poorly', 'Fails on training data too', 'Has too few parameters', 'Uses unlabeled data'], correct: 0, why: 'It captures noise in the training set, so accuracy on new data drops.' },
          { q: 'Which is a regression task?', options: ['Spam detection', 'Predicting house prices', 'Image classification', 'Clustering customers'], correct: 1, why: 'Regression predicts a continuous number, such as a price.' },
        ],
      },
      {
        id: 'aiml-3',
        title: 'Neural Networks and Activation Functions',
        summary: 'A neural network stacks layers of weighted sums followed by activation functions. Activations add non-linearity, which lets the network learn complex patterns. ReLU outputs max(0, x), and softmax turns output scores into class probabilities.',
        questions: [
          { q: 'The main purpose of an activation function is to:', options: ['Add non-linearity', 'Store the weights', 'Reduce dataset size', 'Sort the inputs'], correct: 0, why: 'Without non-linearity, stacked layers collapse into one linear function.' },
          { q: 'ReLU outputs:', options: ['max(0, x)', '1 / (1 + e^-x)', 'tanh(x)', 'x squared'], correct: 0, why: 'ReLU passes positive values unchanged and sets negative values to zero.' },
          { q: 'Softmax is commonly used in the output layer for:', options: ['Multi-class probabilities', 'Regression output only', 'Pooling', 'Normalizing images'], correct: 0, why: 'Softmax produces values between 0 and 1 that sum to 1 across classes.' },
        ],
      },
      {
        id: 'aiml-4',
        title: 'Backpropagation and Gradient Descent',
        summary: 'Backpropagation computes gradients of the loss with respect to each weight using the chain rule. Gradient descent updates weights by moving against the gradient. The learning rate controls the step size.',
        questions: [
          { q: 'Backpropagation computes gradients using which rule?', options: ['Chain rule', 'Bubble sort', 'Monte Carlo sampling', 'Fourier transform'], correct: 0, why: 'The chain rule propagates derivatives backward through each layer.' },
          { q: 'A learning rate that is too large usually causes:', options: ['Slow convergence always', 'Divergence or oscillation', 'No change in weights', 'A lower loss every step'], correct: 1, why: 'Steps overshoot the minimum, so the loss can bounce or grow.' },
          { q: 'Gradient descent updates parameters by moving:', options: ['Along the gradient direction', 'Along the negative gradient', 'Randomly', 'Only in the output layer'], correct: 1, why: 'The negative gradient points in the direction that reduces the loss.' },
        ],
      },
      {
        id: 'aiml-5',
        title: 'Convolutional Neural Networks',
        summary: 'CNNs use convolution kernels that slide over an image and share weights across positions. Pooling layers reduce spatial size. CNNs suit grid-like data such as images.',
        questions: [
          { q: 'Convolution kernels in a CNN share:', options: ['Weights across positions', 'Biases per pixel only', 'Nothing', 'The input values'], correct: 0, why: 'Weight sharing lets one kernel detect the same pattern anywhere in the image.' },
          { q: 'Max pooling:', options: ['Downsamples by keeping the maximum in each window', 'Doubles the image size', 'Adds random noise', 'Converts the image to text'], correct: 0, why: 'Pooling keeps the strongest response in each window and reduces size.' },
          { q: 'CNNs are especially well suited for:', options: ['Grid-like data such as images', 'Unstructured tabular data only', 'Sorting numbers', 'Compiling code'], correct: 0, why: 'Local spatial structure in grids is what convolutions exploit.' },
        ],
      },
    ],
  },

  OS: {
    name: 'OS',
    units: [
      {
        id: 'os-1',
        title: 'Introduction to OS and System Calls',
        summary: 'An operating system manages hardware and provides services to programs. System calls are the interface through which programs request services. The CPU runs in user mode or kernel mode, and only kernel mode can run privileged instructions.',
        questions: [
          { q: 'A system call is:', options: ['An interface for programs to request OS services', 'A hardware interrupt only', 'A type of file', 'A scheduling algorithm'], correct: 0, why: 'Programs use system calls such as read, write and fork to ask the kernel for work.' },
          { q: 'Which mode has full access to hardware?', options: ['User mode', 'Kernel mode', 'Both have equal access', 'Neither'], correct: 1, why: 'Kernel mode can run privileged instructions and access all hardware.' },
          { q: 'Which is NOT a core OS function?', options: ['Process management', 'Memory management', 'Compiling source code into machine code', 'File management'], correct: 2, why: 'Compiling is the job of a compiler, not the operating system.' },
        ],
      },
      {
        id: 'os-2',
        title: 'Process Scheduling',
        summary: 'The scheduler chooses which ready process runs next. FCFS is simple but can cause the convoy effect. SJF gives the minimum average waiting time when non-preemptive. Round Robin gives each process a fixed time quantum.',
        questions: [
          { q: 'FCFS scheduling can suffer from:', options: ['The convoy effect', 'Starvation of every process', 'Deadlock always', 'Race conditions'], correct: 0, why: 'A long job at the front makes short jobs wait behind it.' },
          { q: 'Non-preemptive SJF minimizes:', options: ['Average waiting time', 'Context switches', 'Memory usage', 'Disk seeks'], correct: 0, why: 'Running shorter jobs first reduces the average wait across all jobs.' },
          { q: 'Round Robin performance depends mainly on:', options: ['The time quantum', 'Priority inversion', 'The page size', 'Disk speed'], correct: 0, why: 'A very large quantum behaves like FCFS, and a very small one adds overhead.' },
        ],
      },
      {
        id: 'os-3',
        title: 'Process Synchronization',
        summary: 'When threads share data, unsynchronized access causes race conditions. Mutexes and semaphores enforce mutual exclusion. A binary semaphore behaves like a lock.',
        questions: [
          { q: 'A mutex is used to:', options: ['Ensure mutual exclusion', 'Allocate memory', 'Schedule the disk', 'Encrypt data'], correct: 0, why: 'Only one thread at a time may hold the lock on a shared resource.' },
          { q: 'A semaphore initialized to 1 acts as:', options: ['A counting semaphore with count 10', 'A binary semaphore like a lock', 'A pipe', 'A page table'], correct: 1, why: 'With a count of 1, the semaphore allows only one holder at a time.' },
          { q: 'A race condition occurs when:', options: ['Threads access shared data concurrently without synchronization', 'Only one thread runs', 'Threads are idle', 'The disk is full'], correct: 0, why: 'The final result depends on the timing of the threads.' },
        ],
      },
      {
        id: 'os-4',
        title: 'Deadlocks',
        summary: 'Deadlock needs four conditions at once: mutual exclusion, hold and wait, no preemption, and circular wait. The Banker algorithm avoids deadlock by checking that the system stays in a safe state. Ordering resource requests breaks circular wait.',
        questions: [
          { q: 'The four necessary conditions for deadlock include:', options: ['Mutual exclusion, hold and wait, no preemption, circular wait', 'Speed, size, cost, time', 'Paging, segments, pages, frames', 'Read, write, execute, append'], correct: 0, why: 'All four must hold at the same time for a deadlock to occur.' },
          { q: 'The Banker algorithm:', options: ['Avoids deadlock by checking for a safe state', 'Only detects deadlock after it happens', 'Schedules disk requests', 'Allocates CPUs only'], correct: 0, why: 'A request is granted only if the system can still finish all processes.' },
          { q: 'Breaking circular wait is done by:', options: ['Ordering resource acquisition', 'Adding more processes', 'Removing all locks', 'Increasing the time quantum'], correct: 0, why: 'If every process requests resources in the same order, no cycle can form.' },
        ],
      },
      {
        id: 'os-5',
        title: 'Memory Management',
        summary: 'Paging divides logical memory into fixed-size pages mapped to physical frames. A page fault happens when the needed page is not in physical memory. Segmentation divides memory into variable-size logical segments.',
        questions: [
          { q: 'Paging divides:', options: ['Logical memory into fixed-size pages', 'The disk into sectors only', 'CPU registers', 'Network packets'], correct: 0, why: 'Pages map to physical frames of the same size.' },
          { q: 'A page fault means:', options: ['The requested page is not in physical memory', 'The CPU is overheating', 'The disk is full', 'The process ended normally'], correct: 0, why: 'The OS loads the page from disk, then the instruction resumes.' },
          { q: 'Segmentation divides memory into:', options: ['Variable-size logical segments', 'Equal fixed frames', 'Kernel pages only', 'Cache lines'], correct: 0, why: 'Segments follow the logical structure of a program, such as code and stack.' },
        ],
      },
    ],
  },

  ACA: {
    name: 'Advanced Computer Algorithms',
    units: [
      {
        id: 'aca-1',
        title: 'Asymptotic Analysis',
        summary: 'Big-O notation gives an upper bound on how running time grows with input size. Binary search runs in O(log n). Growth rates order from O(log n) and O(n) up to O(n log n) and O(n squared).',
        questions: [
          { q: 'Big-O describes:', options: ['An upper bound on growth rate', 'The exact runtime in seconds', 'A lower bound only', 'Exact memory in bytes'], correct: 0, why: 'Big-O ignores constants and machine speed and focuses on growth.' },
          { q: 'The time complexity of binary search is:', options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'], correct: 0, why: 'Each step halves the remaining search space.' },
          { q: 'Which grows fastest?', options: ['O(n squared)', 'O(n log n)', 'O(n)', 'O(log n)'], correct: 0, why: 'Quadratic growth outpaces linearithmic, linear, and logarithmic growth.' },
        ],
      },
      {
        id: 'aca-2',
        title: 'Divide and Conquer',
        summary: 'Divide and conquer splits a problem, solves the parts, and combines the results. Merge sort follows the recurrence T(n) = 2T(n/2) + O(n), giving O(n log n). Quick sort degrades to O(n squared) when pivots are always the smallest or largest element.',
        questions: [
          { q: 'Merge sort follows the recurrence T(n) = 2T(n/2) + O(n). Its complexity is:', options: ['O(n log n)', 'O(n squared)', 'O(n)', 'O(log n)'], correct: 0, why: 'The recursion depth is log n and each level does O(n) work.' },
          { q: 'The three steps of divide and conquer are:', options: ['Divide, conquer, combine', 'Sort, search, stop', 'Scan, merge, repeat', 'Guess, check, return'], correct: 0, why: 'Split the problem, solve subproblems, then merge their answers.' },
          { q: 'Quick sort reaches its worst case when:', options: ['The pivot is always the smallest or largest', 'The array is random', 'The array has one element', 'The pivot is the median'], correct: 0, why: 'Partitions become unbalanced, so the recursion depth grows to n.' },
        ],
      },
      {
        id: 'aca-3',
        title: 'Greedy Algorithms',
        summary: 'Greedy algorithms make the locally best choice at each step. They are optimal when the problem has the greedy choice property and optimal substructure. Activity selection picks the earliest finishing activity, and Huffman coding merges the two lowest-frequency nodes.',
        questions: [
          { q: 'A greedy algorithm is correct when the problem has:', options: ['Greedy choice property and optimal substructure', 'Overlapping subproblems only', 'No structure', 'Negative weights only'], correct: 0, why: 'These two properties guarantee that local choices lead to a global optimum.' },
          { q: 'Activity selection chooses:', options: ['The activity that finishes earliest', 'The longest activity', 'A random activity', 'The activity that starts last'], correct: 0, why: 'Finishing early leaves the most room for the remaining activities.' },
          { q: 'Huffman coding builds its tree by repeatedly merging:', options: ['The two lowest-frequency nodes', 'The two highest-frequency nodes', 'Random pairs', 'The first two symbols'], correct: 0, why: 'Rare symbols get longer codes and frequent symbols get shorter ones.' },
        ],
      },
      {
        id: 'aca-4',
        title: 'Dynamic Programming',
        summary: 'Dynamic programming applies when a problem has overlapping subproblems and optimal substructure. Memoization caches subproblem results. The 0/1 knapsack table has n times W entries.',
        questions: [
          { q: 'Dynamic programming applies when a problem has:', options: ['Overlapping subproblems and optimal substructure', 'Only independent subproblems', 'No recursion ever', 'Random inputs'], correct: 0, why: 'Caching overlapping subproblems avoids repeated work.' },
          { q: 'The 0/1 knapsack DP table typically has size:', options: ['n times W', 'n only', 'W only', 'n squared'], correct: 0, why: 'One row per item and one column per capacity from 0 to W.' },
          { q: 'Memoization means:', options: ['Caching results of subproblems', 'Removing recursion', 'Sorting the input', 'Using random values'], correct: 0, why: 'Each subproblem is computed once and its result is stored for reuse.' },
        ],
      },
      {
        id: 'aca-5',
        title: 'Graph Algorithms',
        summary: 'Dijkstra finds shortest paths when edge weights are non-negative. Kruskal builds a minimum spanning tree by sorting edges and using union-find. Topological sort orders the vertices of a directed acyclic graph.',
        questions: [
          { q: 'Dijkstra requires:', options: ['Non-negative edge weights', 'Negative edges only', 'An unweighted graph only', 'A directed acyclic graph only'], correct: 0, why: 'Negative edges can break the greedy assumption that finalized distances stay final.' },
          { q: 'Kruskal algorithm uses:', options: ['Edge sorting and union-find', 'BFS only', 'Topological sort', 'A DP table only'], correct: 0, why: 'Edges are added in increasing weight unless they form a cycle.' },
          { q: 'Topological sort applies to:', options: ['Directed acyclic graphs', 'Undirected cyclic graphs', 'Undirected trees only', 'Any graph with negative weights'], correct: 0, why: 'A cycle would make a valid ordering impossible.' },
        ],
      },
    ],
  },
};