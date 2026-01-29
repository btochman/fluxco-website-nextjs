export interface Transformer {
  id: string;
  type: "new" | "refurbished";
  category: string;
  capacity: string;
  capacityKVA: number;
  voltage: string;
  manufacturer: string;
  location: string;
  feocCompliant: boolean;
  price: string;
  quantity: number;
}

// FEOC compliant manufacturers (US, Canada, Mexico, allies - not China/Russia)
const feocCompliantManufacturers = ["ABB", "Siemens", "GE", "Eaton", "Schneider", "Hitachi", "Cooper", "Hammond", "Square D", "Westinghouse", "Mitsubishi", "Toshiba", "TECO"];
const nonFeocManufacturers = ["Hyundai", "Crompton Greaves"];
const manufacturers = [...feocCompliantManufacturers, ...nonFeocManufacturers];

const locations = [
  "Houston, TX", "Chicago, IL", "Atlanta, GA", "Phoenix, AZ", "Toronto, CA", "Detroit, MI", "Denver, CO", 
  "Mexico City, MX", "Vancouver, CA", "Miami, FL", "Dallas, TX", "Seattle, WA", "Los Angeles, CA", 
  "New York, NY", "Boston, MA", "San Francisco, CA", "Portland, OR", "Montreal, CA", "Calgary, CA",
  "Austin, TX", "San Antonio, TX", "Nashville, TN", "Charlotte, NC", "Minneapolis, MN", "Kansas City, MO",
  "St. Louis, MO", "Indianapolis, IN", "Columbus, OH", "Pittsburgh, PA", "Philadelphia, PA",
  "Tampa, FL", "Orlando, FL", "Jacksonville, FL", "San Diego, CA", "Sacramento, CA", "Las Vegas, NV",
  "Salt Lake City, UT", "Albuquerque, NM", "Oklahoma City, OK", "Tulsa, OK", "Memphis, TN", "Louisville, KY",
  "Milwaukee, WI", "Cleveland, OH", "Cincinnati, OH", "Raleigh, NC", "Richmond, VA", "Baltimore, MD",
  "Monterrey, MX", "Guadalajara, MX", "Edmonton, CA", "Winnipeg, CA", "Quebec City, CA", "Ottawa, CA"
];

const capacityOptions = [
  { capacity: "75 kVA", kva: 75, category: "Distribution", voltages: ["480V/208V", "480V/240V", "600V/208V"], priceRange: [8000, 15000] },
  { capacity: "100 kVA", kva: 100, category: "Distribution", voltages: ["480V/208V", "480V/120V", "600V/240V"], priceRange: [10000, 18000] },
  { capacity: "150 kVA", kva: 150, category: "Distribution", voltages: ["480V/208V", "4.16kV/480V", "600V/208V"], priceRange: [12000, 22000] },
  { capacity: "225 kVA", kva: 225, category: "Distribution", voltages: ["7.2kV/480V", "4.16kV/480V", "13.8kV/240V"], priceRange: [18000, 28000] },
  { capacity: "250 kVA", kva: 250, category: "Distribution", voltages: ["7.2kV/240V", "13.8kV/480V", "4.16kV/208V"], priceRange: [20000, 32000] },
  { capacity: "300 kVA", kva: 300, category: "Distribution", voltages: ["480V/208V", "13.8kV/480V", "7.2kV/480V"], priceRange: [16000, 35000] },
  { capacity: "500 kVA", kva: 500, category: "Distribution", voltages: ["13.8kV/480V", "25kV/480V", "7.2kV/480V"], priceRange: [40000, 65000] },
  { capacity: "750 kVA", kva: 750, category: "Distribution", voltages: ["13.8kV/480V", "25kV/480V", "34.5kV/480V"], priceRange: [55000, 85000] },
  { capacity: "1,000 kVA", kva: 1000, category: "Distribution", voltages: ["13.8kV/480V", "25kV/480V", "34.5kV/480V"], priceRange: [58000, 95000] },
  { capacity: "1,500 kVA", kva: 1500, category: "Distribution", voltages: ["13.8kV/480V", "25kV/4.16kV", "34.5kV/480V"], priceRange: [75000, 120000] },
  { capacity: "2,000 kVA", kva: 2000, category: "Distribution", voltages: ["25kV/480V", "34.5kV/4.16kV", "13.8kV/4.16kV"], priceRange: [85000, 145000] },
  { capacity: "2,500 kVA", kva: 2500, category: "Power", voltages: ["34.5kV/4.16kV", "69kV/13.8kV", "25kV/4.16kV"], priceRange: [110000, 175000] },
  { capacity: "3,000 kVA", kva: 3000, category: "Power", voltages: ["34.5kV/4.16kV", "69kV/13.8kV", "46kV/13.8kV"], priceRange: [135000, 210000] },
  { capacity: "5,000 kVA", kva: 5000, category: "Power", voltages: ["69kV/13.8kV", "138kV/34.5kV", "46kV/4.16kV"], priceRange: [165000, 285000] },
  { capacity: "7,500 kVA", kva: 7500, category: "Power", voltages: ["69kV/13.8kV", "138kV/34.5kV", "115kV/34.5kV"], priceRange: [240000, 380000] },
  { capacity: "10,000 kVA", kva: 10000, category: "Power", voltages: ["138kV/34.5kV", "115kV/13.8kV", "69kV/13.8kV"], priceRange: [380000, 550000] },
  { capacity: "15,000 kVA", kva: 15000, category: "Power", voltages: ["138kV/34.5kV", "230kV/69kV", "115kV/34.5kV"], priceRange: [520000, 780000] },
  { capacity: "20,000 kVA", kva: 20000, category: "Power", voltages: ["230kV/69kV", "138kV/34.5kV", "345kV/138kV"], priceRange: [680000, 950000] },
  { capacity: "25,000 kVA", kva: 25000, category: "Power", voltages: ["230kV/69kV", "345kV/138kV", "138kV/34.5kV"], priceRange: [820000, 1150000] },
  { capacity: "30,000 kVA", kva: 30000, category: "Power", voltages: ["345kV/138kV", "230kV/69kV", "500kV/230kV"], priceRange: [950000, 1350000] },
  // Specialty transformers
  { capacity: "45 kVA", kva: 45, category: "Specialty", voltages: ["480V/208V", "600V/120V", "380V/208V"], priceRange: [5500, 9500] },
  { capacity: "112.5 kVA", kva: 112, category: "Specialty", voltages: ["480V/208V", "480V/120V", "600V/208V"], priceRange: [9000, 16000] },
  { capacity: "167 kVA", kva: 167, category: "Specialty", voltages: ["4.16kV/480V", "13.8kV/480V", "7.2kV/240V"], priceRange: [14000, 24000] },
  { capacity: "333 kVA", kva: 333, category: "Specialty", voltages: ["13.8kV/480V", "4.16kV/480V", "25kV/480V"], priceRange: [25000, 42000] },
  { capacity: "833 kVA", kva: 833, category: "Specialty", voltages: ["13.8kV/480V", "25kV/4.16kV", "34.5kV/480V"], priceRange: [58000, 92000] },
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`;
  }
  return `$${price.toLocaleString()}`;
}

function generateInventoryItem(index: number): Transformer {
  const type: "new" | "refurbished" = Math.random() > 0.35 ? "new" : "refurbished";
  const capacityOption = getRandomItem(capacityOptions);
  const voltage = getRandomItem(capacityOption.voltages);
  const manufacturer = getRandomItem(manufacturers);
  const location = getRandomItem(locations);
  
  // Determine FEOC compliance based on manufacturer
  const feocCompliant = feocCompliantManufacturers.includes(manufacturer);
  
  // Refurbished items are 35-55% cheaper
  const priceMultiplier = type === "refurbished" ? 0.45 + Math.random() * 0.2 : 1;
  const basePrice = getRandomInt(capacityOption.priceRange[0], capacityOption.priceRange[1]);
  const finalPrice = Math.round(basePrice * priceMultiplier / 100) * 100;
  
  // Quantity varies by capacity - larger units have fewer in stock
  let maxQty = 30;
  if (capacityOption.kva > 5000) maxQty = 3;
  else if (capacityOption.kva > 2000) maxQty = 6;
  else if (capacityOption.kva > 1000) maxQty = 10;
  else if (capacityOption.kva > 500) maxQty = 15;

  const quantity = getRandomInt(1, maxQty);

  return {
    id: `TX-${String(index).padStart(3, '0')}`,
    type,
    category: capacityOption.category,
    capacity: capacityOption.capacity,
    capacityKVA: capacityOption.kva,
    voltage,
    manufacturer,
    location,
    feocCompliant,
    price: formatPrice(finalPrice),
    quantity
  };
}

// Generate 412 items (original 12 style + 400 new)
export const inventoryData: Transformer[] = Array.from({ length: 412 }, (_, i) => generateInventoryItem(i + 1));
