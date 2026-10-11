// Brief for each assignment, keyed by the assignment id in lxStore.js.
// Replace these with your faculty's real wording.
export const ASSIGNMENT_BRIEFS = {
  aiml: {
    type: 'Written report',
    length: '1,000 to 1,200 words',
    prompt:
      'Explain how a feedforward neural network learns from data. Start with the forward pass, then describe how the loss is measured, and finish with how backpropagation uses the chain rule to update each weight. Use your own words and show the idea with one small worked example.',
    requirements: [
      'Describe the forward pass through at least two layers.',
      'Explain one loss function and why it suits the task.',
      'Work through one numeric backpropagation step with real numbers.',
      'Cite at least two sources, including your course notes.',
    ],
    format: 'PDF, DOCX or ZIP',
  },
  os: {
    type: 'Written report',
    length: '800 to 1,000 words',
    prompt:
      'Compare FCFS, Shortest Job First and Round Robin scheduling. Explain when each one works well, what problem each one causes, and which one you would choose for an interactive system. Support your answer with a short calculation of average waiting time for a sample set of processes.',
    requirements: [
      'Define each algorithm in one or two sentences.',
      'Give a Gantt chart and waiting times for one shared example.',
      'Discuss at least one drawback of each algorithm.',
      'End with a clear recommendation and a reason.',
    ],
    format: 'PDF, DOCX or ZIP',
  },
  aca: {
    type: 'Problem set',
    length: 'Typed or handwritten, scanned to PDF',
    prompt:
      'Solve the dynamic programming problems set by your faculty. For each problem, state the subproblem, the recurrence, the base cases and the time complexity. Show how you filled the table for one example input.',
    requirements: [
      'State the subproblem and recurrence for every problem.',
      'Give base cases and the final answer.',
      'Write the time and space complexity.',
      'Show the filled table for one example.',
    ],
    format: 'PDF or ZIP',
  },
  'lab-aiml': {
    type: 'Lab report',
    length: 'Code plus a short report',
    prompt:
      'Implement a convolutional neural network for image classification. Describe the layers you used, train the model, and report accuracy on the test set. Explain what the convolution and pooling layers contribute to the result.',
    requirements: [
      'Include the source code in a ZIP file.',
      'Report training and test accuracy with the number of epochs.',
      'Explain the role of convolution and pooling in one paragraph.',
      'Add one plot of the training loss curve.',
    ],
    format: 'ZIP (code and report)',
  },
  'lab-os': {
    type: 'Lab report',
    length: 'Code plus a short report',
    prompt:
      'Simulate paging with a fixed number of frames. Run the simulation on a given reference string using FIFO and LRU replacement. Report the number of page faults for each policy and explain the difference.',
    requirements: [
      'Include the simulation code in a ZIP file.',
      'Show the frame table for the reference string.',
      'Report page faults for FIFO and LRU.',
      'Explain in one paragraph why the results differ.',
    ],
    format: 'ZIP (code and report)',
  },
};