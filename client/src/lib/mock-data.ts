export interface Promise {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'not-started' | 'broken';
  category: string;
  completionPercentage: number;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  constituency: string;
  age: number;
  education: string;
  image: string;
  criminalCases: number;
  assets: string;
  attendance: number; // Percentage
  promises: Promise[];
  funds: {
    allocated: number;
    utilized: number;
    projects: { name: string; cost: number; status: string }[];
  };
  bio: string;
}

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Aakash Mehta",
    party: "Mumbai Development Front",
    constituency: "Mumbai South",
    age: 48,
    education: "MBA, University of Mumbai",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
    criminalCases: 0,
    assets: "₹12.5 Cr",
    attendance: 88,
    bio: "Focusing on Mumbai's coastal road projects and local train infrastructure. A former corporate leader committed to urban efficiency.",
    promises: [
      {
        id: "p1",
        title: "Coastal Road Phase 2",
        description: "Complete the connection from Worli to Nariman Point.",
        status: "in-progress",
        category: "Infrastructure",
        completionPercentage: 75
      },
      {
        id: "p2",
        title: "Public School Tech-Lab",
        description: "Equip 50 BMC schools with modern coding labs.",
        status: "completed",
        category: "Education",
        completionPercentage: 100
      },
      {
        id: "p3",
        title: "Dharavi Redevelopment",
        description: "Initiate housing allotment for Phase 1 residents.",
        status: "not-started",
        category: "Housing",
        completionPercentage: 0
      }
    ],
    funds: {
      allocated: 150000000,
      utilized: 110000000,
      projects: [
        { name: "Marine Drive Beautification", cost: 25000000, status: "Completed" },
        { name: "CCTV Network Expansion", cost: 45000000, status: "In Progress" },
        { name: "Garden Restoration", cost: 15000000, status: "Completed" }
      ]
    }
  },
  {
    id: "2",
    name: "Priya Sawant",
    party: "Shiv Sena (UBT)",
    constituency: "Mumbai North West",
    age: 42,
    education: "LL.M., Government Law College",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
    criminalCases: 1,
    assets: "₹4.2 Cr",
    attendance: 95,
    bio: "Advocating for the protection of Aarey Forest and improving healthcare services in the western suburbs.",
    promises: [
      {
        id: "p4",
        title: "Aarey Protection Act",
        description: "Formalize the forest boundaries to prevent further encroachment.",
        status: "completed",
        category: "Environment",
        completionPercentage: 100
      },
      {
        id: "p5",
        title: "Suburban Multi-specialty Hospital",
        description: "Build a new 500-bed hospital in Andheri.",
        status: "in-progress",
        category: "Healthcare",
        completionPercentage: 30
      }
    ],
    funds: {
      allocated: 120000000,
      utilized: 45000000,
      projects: [
        { name: "Hospital Foundation", cost: 35000000, status: "In Progress" },
        { name: "Mangrove Cleanup", cost: 5000000, status: "Completed" }
      ]
    }
  },
  {
    id: "3",
    name: "Suresh Prabhu",
    party: "BJP",
    constituency: "Mumbai North East",
    age: 55,
    education: "B.E. Civil Engineering",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    criminalCases: 2,
    assets: "₹28 Cr",
    attendance: 72,
    bio: "Veteran politician focused on industrial growth and transforming Mumbai into a global financial hub.",
    promises: [
      {
        id: "p6",
        title: "Vikhroli Flyover",
        description: "Construct the long-pending Vikhroli east-west bridge.",
        status: "in-progress",
        category: "Infrastructure",
        completionPercentage: 55
      }
    ],
    funds: {
      allocated: 200000000,
      utilized: 95000000,
      projects: [
        { name: "Bridge Piling Works", cost: 60000000, status: "In Progress" },
        { name: "Market Modernization", cost: 20000000, status: "Completed" }
      ]
    }
  }
];
