import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GOOGLE_SHEET_ID = '1pOieA2CEp9x-Yuu7mVY34dVmz32KZjIJyd0peH3TEuQ';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  images: string[];
  type: string;
  category: string;
  forType: string;
  area: string;
  furnishing: string;
  config: string;
  floor: string;
  description: string;
  ownerName: string;
  contact: string;
}

function extractDriveId(url: string): string | null {
  const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const directMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return directMatch ? directMatch[1] : null;
}

function convertImageLink(url: string): string {
  const id = extractDriveId(url.trim());
  if (id) {
    return `https://lh3.googleusercontent.com/d/${id}=w1200`;
  }
  return '';
}

function safeParseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(csv: string): Property[] {
  const lines = csv.split('\n');
  const properties: Property[] = [];
  
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith(',,,,,,,,,,,,,,,,')) continue;
    
    const cols = safeParseCSVLine(line);
    
    if (cols.length < 15) continue;
    
    const [, buildingType, forType, propertyType, area, furnishing, description, floor, ownerName, contact, address, config, price, images, , , updatedImages] = cols;
    
    if (!propertyType || !forType) continue;
    
    const allImageUrls = [images, updatedImages]
      .filter(Boolean)
      .flatMap(imgCol => imgCol.split(/[\s,]+/))
      .map(url => url.trim())
      .filter(url => url.includes('drive.google.com'))
      .map(url => convertImageLink(url))
      .filter(url => url !== '');
    
    const uniqueImageUrls = [...new Set(allImageUrls)];
    
    let priceFormatted = price;
    if (price) {
      const numericPrice = parseFloat(price.replace(/,/g, ''));
      if (!isNaN(numericPrice)) {
        if (forType.toLowerCase() === 'rent') {
           priceFormatted = `₹${numericPrice.toLocaleString('en-IN')}/mo`;
        } else {
           priceFormatted = `₹${(numericPrice / 10000000).toFixed(1)} Cr`;
        }
      }
    } else {
      priceFormatted = 'Price on Request';
    }
    
    const titleName = furnishing && furnishing !== 'N/A' 
      ? `${furnishing} ${propertyType}`
      : propertyType;
    
    properties.push({
      id: properties.length + 1,
      title: titleName,
      location: address || '',
      price: priceFormatted,
      images: uniqueImageUrls,
      type: propertyType || 'Property',
      category: buildingType || 'Residential',
      forType: forType || 'Rent',
      area: area || '',
      furnishing: furnishing || 'N/A',
      config: config || '',
      floor: floor || '',
      description: description || '',
      ownerName: ownerName || '',
      contact: contact || '',
    });
  }
  
  return properties;
}

export async function GET() {
  try {
    const timestamp = Date.now();
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&t=${timestamp}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch sheet');
    }
    
    const csv = await response.text();
    const properties = parseCSV(csv);
    
    return NextResponse.json({ 
      properties, 
      count: properties.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties', properties: [], count: 0 },
      { status: 500 }
    );
  }
}
