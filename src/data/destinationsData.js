import * as THREE from 'three';

// Convert lat/long to 3D vector on a sphere of radius R
export function latLonToVector3(lat, lon, radius = 2.02) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export const DESTINATIONS = [
  {
    id: 'uk',
    name: 'United Kingdom',
    code: 'UK',
    flag: '🇬🇧',
    lat: 51.5074,
    lon: -0.1278,
    heading: 'World-class universities & globally recognised degrees',
    tagline: 'Home to 4 of the World’s Top 10 Universities with 1-Year Masters programs.',
    topUniversities: ['University of Oxford', 'Cambridge University', 'Imperial College London', 'UCL', 'Univ of Edinburgh'],
    popularFields: [
      { name: 'Business & Finance', icon: 'Briefcase' },
      { name: 'Computer Science & AI', icon: 'Cpu' },
      { name: 'Mechanical & Civil Eng', icon: 'Cog' },
      { name: 'Law & International Relations', icon: 'Scale' },
      { name: 'Healthcare & Medicine', icon: 'Activity' }
    ],
    postStudyWork: '2-Year Graduate Visa (3 Years for PhD)',
    intakes: 'September & January',
    avgCost: '£14,000 – £28,000 / yr',
    scholarships: 'Chevening, Commonwealth, GREAT Scholarships up to 100%'
  },
  {
    id: 'canada',
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    lat: 45.4215,
    lon: -75.6972,
    heading: 'Top-tier education with transparent post-study PR pathways',
    tagline: 'World-renowned research institutions, safe diverse communities, and high quality of life.',
    topUniversities: ['University of Toronto', 'UBC Vancouver', 'McGill University', 'Waterloo', 'McMaster'],
    popularFields: [
      { name: 'Data Science & Software', icon: 'Code' },
      { name: 'Biomedical Engineering', icon: 'Dna' },
      { name: 'Renewable Energy', icon: 'Zap' },
      { name: 'Global Supply Chain', icon: 'Truck' },
      { name: 'Finance & FinTech', icon: 'TrendingUp' }
    ],
    postStudyWork: 'Up to 3-Year Post-Graduation Work Permit (PGWP)',
    intakes: 'Fall (Sept), Winter (Jan), Spring (May)',
    avgCost: 'CAD $18,000 – $36,000 / yr',
    scholarships: 'Vanier, Lester B. Pearson, University Entrance Grants'
  },
  {
    id: 'australia',
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    lat: -33.8688,
    lon: 151.2093,
    heading: 'World-ranked Group of Eight (Go8) universities & vibrant lifestyle',
    tagline: 'High starting graduate salaries, sunny climate, and cutting-edge laboratory facilities.',
    topUniversities: ['Univ of Melbourne', 'Univ of Sydney', 'UNSW Sydney', 'Australian National Univ', 'Univ of Queensland'],
    popularFields: [
      { name: 'Information Technology & Cyber', icon: 'Shield' },
      { name: 'Mining & Environmental Tech', icon: 'Globe' },
      { name: 'Public Health & Nursing', icon: 'HeartPulse' },
      { name: 'Accounting & Analytics', icon: 'PieChart' },
      { name: 'Architecture & Design', icon: 'Layout' }
    ],
    postStudyWork: '2 to 4-Year Temporary Graduate Visa (Subclass 485)',
    intakes: 'Semester 1 (Feb) & Semester 2 (July)',
    avgCost: 'AUD $24,000 – $42,000 / yr',
    scholarships: 'Australia Awards, Destination Australia, Vice-Chancellor Awards'
  },
  {
    id: 'usa',
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    lat: 40.7128,
    lon: -74.0060,
    heading: 'Global epicenter of innovation, tech giants & Silicon Valley',
    tagline: 'Over 4,000 accredited institutions with unparalleled research funding and OPT opportunities.',
    topUniversities: ['MIT', 'Stanford University', 'Harvard', 'Columbia', 'UC Berkeley'],
    popularFields: [
      { name: 'Artificial Intelligence & Robotics', icon: 'Bot' },
      { name: 'Quantitative Finance & Economics', icon: 'DollarSign' },
      { name: 'Aerospace Engineering', icon: 'Plane' },
      { name: 'Biotech & Genomics', icon: 'Microscope' },
      { name: 'Media & Interactive Tech', icon: 'Film' }
    ],
    postStudyWork: '12 Months OPT + 24-Month STEM Extension (3 Years Total)',
    intakes: 'Fall (August/Sept) & Spring (January)',
    avgCost: '$25,000 – $55,000 / yr',
    scholarships: 'Fulbright, Need-blind Financial Aid, Merit Fellowships'
  },
  {
    id: 'germany',
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    lat: 51.1657,
    lon: 10.4515,
    heading: 'TU9 engineering powerhouses with zero to minimal tuition fees',
    tagline: 'Europe’s strongest industrial economy offering English-taught master programs.',
    topUniversities: ['Technical Univ of Munich (TUM)', 'LMU Munich', 'Heidelberg Univ', 'RWTH Aachen', 'KIT Karlsruhe'],
    popularFields: [
      { name: 'Automotive & Mechanical Eng', icon: 'Car' },
      { name: 'Computer Science & Software', icon: 'Terminal' },
      { name: 'Renewable Energies & Physics', icon: 'Sun' },
      { name: 'Industrial Management', icon: 'Building' },
      { name: 'Molecular Medicine', icon: 'Activity' }
    ],
    postStudyWork: '18-Month Job Seeker Visa with EU Blue Card fast-track',
    intakes: 'Winter (Oct) & Summer (April)',
    avgCost: '€0 – €3,000 / yr (Public Universities)',
    scholarships: 'DAAD Scholarships, Deutschlandstipendium, Heinrich Böll'
  },
  {
    id: 'newzealand',
    name: 'New Zealand',
    code: 'NZ',
    flag: '🇳🇿',
    lat: -36.8485,
    lon: 174.7633,
    heading: 'Safe, scenic & all 8 universities ranked in the global top 3%',
    tagline: 'Pioneering green sciences, hands-on learning, and progressive work-rights policies.',
    topUniversities: ['University of Auckland', 'Univ of Otago', 'Victoria Univ of Wellington', 'Univ of Canterbury'],
    popularFields: [
      { name: 'Agricultural Science & AgriTech', icon: 'Sprout' },
      { name: 'Digital Media & VFX', icon: 'Video' },
      { name: 'Marine Biology & Ecology', icon: 'Compass' },
      { name: 'Tourism & Hospitality Mgmt', icon: 'Compass' },
      { name: 'Software Engineering', icon: 'Code2' }
    ],
    postStudyWork: 'Up to 3-Year Post-Study Work Visa',
    intakes: 'February & July',
    avgCost: 'NZD $22,000 – $38,000 / yr',
    scholarships: 'Manaaki New Zealand Scholarships, University Excellence Awards'
  }
];
