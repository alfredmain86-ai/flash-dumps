export const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || 'FLASH DUMPS';
export const COMPANY_PHONE = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+13051234567';
export const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@flashdumps.com';
export const COMPANY_WHATSAPP = process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || '+13051234567';
export const BASE_LAT = parseFloat(process.env.NEXT_PUBLIC_BASE_LAT || '25.7617');
export const BASE_LNG = parseFloat(process.env.NEXT_PUBLIC_BASE_LNG || '-80.1918');

// Miami-Dade County approximate bounding box for service area validation
export const SERVICE_AREA = {
  north: 25.98,
  south: 25.24,
  east: -80.12,
  west: -80.88,
};

export function isInServiceArea(lat: number, lng: number): boolean {
  return (
    lat >= SERVICE_AREA.south &&
    lat <= SERVICE_AREA.north &&
    lng >= SERVICE_AREA.east &&
    lng <= SERVICE_AREA.west
  );
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
