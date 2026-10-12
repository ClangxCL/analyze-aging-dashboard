export type DimensionKey =
  | 'vision'
  | 'oral'
  | 'mobility'
  | 'adl'
  | 'hearing'
  | 'cognition'
  | 'incontinence'
  | 'nutrition'
  | 'depression';

export interface DimensionCatalogItem {
  key: DimensionKey;
  name: string;
  shortName?: string;
}

export interface DimensionMetric {
  key: DimensionKey;
  name: string;
  shortName: string;
  screened: number;
  normal: number;
  risk: number;
  riskPct: number;
  rank?: number;
}

export interface ProvinceData {
  id: number;
  province: string;
  zone: string;
  zoneNumber: number;
  totalScreened: number;
  screened9d: number;
  pctScreened9d: number;
  top1Issue: string;
  top1RiskPct: number;
  dimensions: Record<DimensionKey, DimensionMetric>;
  rankedDimensions: DimensionMetric[];
}

export interface RegionData {
  zone: string;
  zoneNumber: number;
  provinceCount: number;
  provinces: string[];
  totalScreened: number;
  screened9d: number;
  pctScreened9d: number;
  top1Issue: string;
  top1RiskPct: number;
  dimensions: Record<DimensionKey, DimensionMetric>;
  rankedDimensions: DimensionMetric[];
}

export interface NationalData {
  totalScreened: number;
  screened9d: number;
  pctScreened9d: number;
  dimensions: Record<DimensionKey, DimensionMetric>;
  rankedDimensions: DimensionMetric[];
}

export interface HealthDataset {
  metadata: {
    title: string;
    source: string;
    year: number;
    totalProvinces: number;
    totalRegions: number;
    nationalScreened: number;
    nationalScreened9d: number;
    nationalPctScreened9d: number;
    dimensionCatalog: DimensionCatalogItem[];
  };
  national: NationalData;
  regions: RegionData[];
  provinces: ProvinceData[];
}

export interface FilterState {
  zone: string; // 'all' or 'เขตสุขภาพที่ 1' ...
  province: string; // 'all' or province name
  dimension: DimensionKey | 'all';
}
