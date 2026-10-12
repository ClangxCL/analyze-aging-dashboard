import { DimensionKey, DimensionMetric, FilterState, HealthDataset, ProvinceData, RegionData } from '../types/health';

export const DIMENSIONS: Array<{ key: DimensionKey; name: string; shortName: string; description: string }> = [
  { key: 'vision', name: 'การมองเห็น', shortName: 'การมองเห็น', description: 'คัดกรองสายตา ต้อกระจก และภาวะสายตาเลือนราง' },
  { key: 'oral', name: 'สุขภาพช่องปาก', shortName: 'ช่องปาก', description: 'คัดกรองการบดเคี้ยว ฟันแท้ และโรคในช่องปาก' },
  { key: 'mobility', name: 'การเคลื่อนไหว', shortName: 'เคลื่อนไหว', description: 'คัดกรองความเสี่ยงหกล้ม ข้อเข่าเสื่อม และการเดิน' },
  { key: 'adl', name: 'การปฏิบัติกิจวัตรประจำวัน (ADL)', shortName: 'ADL', description: 'การประเมินความสามารถในการดำเนินชีวิตประจำวัน' },
  { key: 'hearing', name: 'การได้ยิน', shortName: 'การได้ยิน', description: 'คัดกรองภาวะหูตึง สูญเสียการได้ยิน' },
  { key: 'cognition', name: 'ความคิดความจำ', shortName: 'ความจำ', description: 'คัดกรองภาวะสมองเสื่อม ความคิดความจำถดถอย' },
  { key: 'incontinence', name: 'การกลั้นปัสสาวะ', shortName: 'กลั้นปัสสาวะ', description: 'คัดกรองปัญหาการกลั้นปัสสาวะไม่อยู่' },
  { key: 'nutrition', name: 'ภาวะโภชนาการ/ขาดสารอาหาร', shortName: 'ขาดสารอาหาร', description: 'คัดกรองภาวะทุพโภชนาการ และน้ำหนักลดผิดปกติ' },
  { key: 'depression', name: 'ภาวะซึมเศร้า (2Q)', shortName: 'ซึมเศร้า 2Q', description: 'คัดกรองความเสี่ยงโรคซึมเศร้าด้วยแบบประเมิน 2 คำถาม' }
];

export function filterProvinces(provinces: ProvinceData[], filter: FilterState): ProvinceData[] {
  return provinces.filter(p => {
    if (filter.zone !== 'all' && p.zone !== filter.zone) {
      return false;
    }
    if (filter.province !== 'all' && p.province !== filter.province) {
      return false;
    }
    return true;
  });
}

/**
 * Computes Top 1 - 9 rankings of health issues for the current filtered scope.
 * If a single province is selected, uses that province's ranked dimensions.
 * If a zone is selected, aggregates across the zone.
 * If all are selected, uses national aggregated dimensions.
 */
export function computeAggregatedRankings(
  dataset: HealthDataset,
  filter: FilterState
): DimensionMetric[] {
  if (filter.province !== 'all') {
    const prov = dataset.provinces.find(p => p.province === filter.province);
    if (prov) {
      return prov.rankedDimensions;
    }
  }

  if (filter.zone !== 'all') {
    const reg = dataset.regions.find(r => r.zone === filter.zone);
    if (reg) {
      return reg.rankedDimensions;
    }
  }

  return dataset.national.rankedDimensions;
}

/**
 * Computes province rankings for a given dimension (sorted descending by risk %)
 */
export function rankProvincesByDimension(
  provinces: ProvinceData[],
  dimensionKey: DimensionKey
): Array<{
  id: number;
  province: string;
  zone: string;
  screened: number;
  risk: number;
  normal: number;
  riskPct: number;
  rank: number;
}> {
  const list = provinces.map(p => {
    const d = p.dimensions[dimensionKey];
    return {
      id: p.id,
      province: p.province,
      zone: p.zone,
      screened: d ? d.screened : 0,
      risk: d ? d.risk : 0,
      normal: d ? d.normal : 0,
      riskPct: d ? d.riskPct : 0,
      rank: 0
    };
  });

  list.sort((a, b) => b.riskPct - a.riskPct);
  list.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return list;
}

/**
 * Formats a number with comma separators.
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('th-TH').format(num);
}

/**
 * Formats percentage to two decimal places.
 */
export function formatPercent(pct: number | undefined | null): string {
  if (pct === undefined || pct === null || isNaN(pct)) return '0.00%';
  return `${pct.toFixed(2)}%`;
}

/**
 * Returns a color corresponding to risk percentage (from soft blue to deep cobalt/coral).
 */
export function getRiskColor(pct: number, min: number = 0, max: number = 30): string {
  const clamped = Math.max(min, Math.min(max, pct));
  const ratio = (clamped - min) / (max - min || 1);

  if (ratio < 0.2) return '#e0edff'; // very light blue
  if (ratio < 0.4) return '#99c2ff'; // light signal blue
  if (ratio < 0.6) return '#4d94ff'; // signal blue mid
  if (ratio < 0.8) return '#006bff'; // signal blue
  return '#004eba'; // deep cobalt
}

/**
 * Sequential Heat Map color palette for 0% to 25%+ risk
 */
export function getHeatMapColor(pct: number): { bg: string; text: string } {
  if (pct >= 18) return { bg: '#004eba', text: '#ffffff' };
  if (pct >= 14) return { bg: '#006bff', text: '#ffffff' };
  if (pct >= 10) return { bg: '#4d94ff', text: '#ffffff' };
  if (pct >= 7)  return { bg: '#99c2ff', text: '#0b3558' };
  if (pct >= 4)  return { bg: '#cce0ff', text: '#0b3558' };
  return { bg: '#f0f3f8', text: '#476788' };
}
