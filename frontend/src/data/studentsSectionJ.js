// Section J roster. Field names: roll, name, cgpa, quizAvg, assignmentsSubmitted, attendance.
// Replace the generated numbers with real records when you have them.
const NAMES = [
  'Aarav Reddy', 'Vihaan Sharma', 'Ananya Iyer', 'Ishaan Verma', 'Diya Patel',
  'Kabir Singh', 'Meera Nair', 'Arjun Menon', 'Sneha Kulkarni', 'Rohan Gupta',
  'Pooja Hegde', 'Aditya Rao', 'Kavya Shetty', 'Siddharth Joshi', 'Riya Desai',
  'Karthik Subramanian', 'Ishita Malhotra', 'Varun Chaudhary', 'Lakshmi Pillai', 'Harsh Agarwal',
  'Nisha Bhat', 'Manish Yadav', 'Tanvi Deshmukh', 'Rahul Krishnan', 'Shruti Mishra',
  'Abhinav Tiwari', 'Anjali Naidu', 'Gaurav Saxena', 'Divya Chandran', 'Pranav Kapoor',
  'Sanjana Bose', 'Nikhil Varma', 'Aishwarya Pandey', 'Suraj Thakur', 'Keerthi Reddy',
  'Mohit Bansal', 'Pallavi Jain', 'Vivek Sinha', 'Swathi Rajan', 'Ankit Dubey',
  'Preeti Chauhan', 'Yash Mehta', 'Nandini Sen', 'Akash Ghosh', 'Megha Kaur',
  'Tejas Gowda', 'Bhavya Srinivasan', 'Dhruv Mathur', 'Sowmya Ramesh', 'Rajat Bhardwaj',
  'Ritu Parmar', 'Sai Teja Kumar', 'Neha Walia', 'Hemant Pawar', 'Alekhya Narayan',
  'Lokesh Babu', 'Shreya Banerjee', 'Gautam Rathore', 'Madhuri Lele', 'Ravi Teja Naik',
  'Priyanka Dwivedi', 'Vinay Hosur', 'Farhan Qureshi', 'Simran Arora',
];

const classmates = NAMES.map((name, i) => {
  const n = i + 1;
  return {
    roll: `J${String(n).padStart(2, '0')}`,
    name,
    cgpa: Number((6 + ((n * 37) % 35) / 10).toFixed(2)),
    quizAvg: 45 + ((n * 13) % 50),
    assignmentsSubmitted: (n * 7) % 4,
    attendance: 60 + ((n * 11) % 38),
  };
});

// Your own record
const darshini = {
  roll: 'J65',
  name: 'T Darshini Deetya',
  cgpa: 8.5,
  quizAvg: 0,
  assignmentsSubmitted: 0,
  attendance: 77,
};

export const studentsSectionJ = [...classmates, darshini];

export default studentsSectionJ;