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
    name: "Rajesh Kumar",
    party: "Progress Party",
    constituency: "South City",
    age: 45,
    education: "M.Sc. Economics",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
    criminalCases: 0,
    assets: "₹2.5 Cr",
    attendance: 85,
    bio: "Dedicated to urban development and sustainable infrastructure. Served as a municipal councilor for 10 years before running for assembly.",
    promises: [
      {
        id: "p1",
        title: "Metro Expansion",
        description: "Extend the metro line to the southern suburbs within 3 years.",
        status: "in-progress",
        category: "Infrastructure",
        completionPercentage: 60
      },
      {
        id: "p2",
        title: "New Public Library",
        description: "Build a state-of-the-art digital library for students.",
        status: "completed",
        category: "Education",
        completionPercentage: 100
      },
      {
        id: "p3",
        title: "Clean Air Initiative",
        description: "Reduce particulate matter by 20% through stricter industrial norms.",
        status: "not-started",
        category: "Environment",
        completionPercentage: 0
      }
    ],
    funds: {
      allocated: 50000000,
      utilized: 35000000,
      projects: [
        { name: "Road Resurfacing - Sector 4", cost: 12000000, status: "Completed" },
        { name: "Park Renovation", cost: 5000000, status: "In Progress" },
        { name: "Street Light Installation", cost: 8000000, status: "Completed" }
      ]
    }
  },
  {
    id: "2",
    name: "Sarah Fernandes",
    party: "Civic Alliance",
    constituency: "West Hills",
    age: 38,
    education: "B.A. Political Science",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
    criminalCases: 1,
    assets: "₹1.2 Cr",
    attendance: 92,
    bio: "Focusing on education reform and healthcare accessibility. Former activist with a strong track record in community service.",
    promises: [
      {
        id: "p4",
        title: "Community Health Center",
        description: "Establish a 24/7 clinic in West Hills.",
        status: "completed",
        category: "Healthcare",
        completionPercentage: 100
      },
      {
        id: "p5",
        title: "School Digitalization",
        description: "Provide tablets to all government school students.",
        status: "broken",
        category: "Education",
        completionPercentage: 10
      }
    ],
    funds: {
      allocated: 40000000,
      utilized: 38000000,
      projects: [
        { name: "Health Center Construction", cost: 25000000, status: "Completed" },
        { name: "School Supplies", cost: 5000000, status: "Completed" }
      ]
    }
  },
  {
    id: "3",
    name: "Vikram Singh",
    party: "National Union",
    constituency: "North Industrial Zone",
    age: 52,
    education: "B.Tech Civil Engineering",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    criminalCases: 3,
    assets: "₹15 Cr",
    attendance: 45,
    bio: "Industrialist turned politician. Promises to bring jobs and improve factory conditions.",
    promises: [
      {
        id: "p6",
        title: "Job Fair 2025",
        description: "Organize a massive job fair for local youth.",
        status: "in-progress",
        category: "Employment",
        completionPercentage: 40
      }
    ],
    funds: {
      allocated: 70000000,
      utilized: 20000000,
      projects: [
        { name: "Industrial Waste Plant", cost: 15000000, status: "Stalled" }
      ]
    }
  }
];
