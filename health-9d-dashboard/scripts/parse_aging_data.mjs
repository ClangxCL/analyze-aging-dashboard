import fs from 'fs';
import path from 'path';

const sourceDir = 'C:/Users/Piyanut/Desktop/Code_Work/Analyze Aging';
const targetFile = 'C:/Users/Piyanut/Desktop/Code_Work/health-9d-dashboard/src/data/agingData.ts';

// Robust CSV parser
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  
  function splitRow(row) {
    const cells = [];
    let insideQuotes = false;
    let currentCell = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        if (insideQuotes && row[i + 1] === '"') {
          currentCell += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        cells.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim());
    return cells;
  }

  const headers = splitRow(lines[0]);
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = splitRow(line);
    const obj = {};
    headers.forEach((h, idx) => {
      let val = values[idx] !== undefined ? values[idx] : '';
      // convert numbers if appropriate
      if (val !== '' && !isNaN(val) && !/^0\d+/.test(val)) {
        obj[h] = Number(val);
      } else {
        obj[h] = val;
      }
    });
    rows.push(obj);
  }
  return rows;
}

const demographics = parseCSV(fs.readFileSync(path.join(sourceDir, '1_demographics_population_meter_2565_2569.csv'), 'utf-8'));
const functionalAbility = parseCSV(fs.readFileSync(path.join(sourceDir, '2_1_functional_ability_adl_and_screening.csv'), 'utf-8'));
const screening9d = parseCSV(fs.readFileSync(path.join(sourceDir, '2_health_screening_9domains_hdc_dms_2565_2569.csv'), 'utf-8'));
const chronicNCDs = parseCSV(fs.readFileSync(path.join(sourceDir, '3_chronic_diseases_ncd_prevalence.csv'), 'utf-8'));
const morbidity = parseCSV(fs.readFileSync(path.join(sourceDir, '4_top10_morbidity_opd_ipd_2565_2569.csv'), 'utf-8'));
const mortality = parseCSV(fs.readFileSync(path.join(sourceDir, '5_top10_mortality_causes_2565_2569.csv'), 'utf-8'));
const burdenOfDisease = parseCSV(fs.readFileSync(path.join(sourceDir, '6_burden_of_disease_dalys_bod.csv'), 'utf-8'));
const comprehensive = parseCSV(fs.readFileSync(path.join(sourceDir, 'elderly_health_5year_comprehensive_dataset_2565_2569.csv'), 'utf-8'));

const tsContent = `// Auto-generated data module from Analyze Aging datasets
export interface DemographicItem {
  Year_TH: number;
  Year_AD: number;
  Total_Population: number;
  Elderly_Population: number;
  Elderly_Pct: number;
  Age_60_69_Early: number;
  Age_60_69_Pct: number;
  Age_70_79_Mid: number;
  Age_70_79_Pct: number;
  Age_80_Plus_Late: number;
  Age_80_Plus_Pct: number;
  Aging_Index: number;
  Old_Age_Dependency_Ratio_OADR: number;
  Potential_Support_Ratio: number;
  Female_Elderly: number;
  Male_Elderly: number;
  Sex_Ratio_F_to_M: number;
  Total_Fertility_Rate_TFR: number;
  Life_Expectancy_Female: number;
  Life_Expectancy_Male: number;
  Super_Aged_Status: string;
  Data_Source: string;
}

export interface FunctionalAbilityItem {
  Indicator_Group: string;
  Category_TH: string;
  Category_EN: string;
  Percentage: number;
  Affected_Elderly_Count: number;
  Health_Impact: string;
  Source: string;
}

export interface Screening9dItem {
  Year_TH: number;
  Year_AD: number;
  Domain_TH: string;
  Domain_EN: string;
  Tool: string;
  HDC_Target_Pop: number;
  HDC_Screened_Persons: number;
  HDC_Screening_Coverage_Pct: number;
  HDC_At_Risk_Persons: number;
  HDC_Risk_Pct: number;
  DMS_Assessed_Persons: number | string;
  DMS_Referred_Persons: number | string;
  DMS_Referral_Pct: number | string;
  Data_Source: string;
}

export interface ChronicNCDItem {
  Rank: number | string;
  ICD10_Code: string;
  Disease_Name_TH: string;
  Disease_Name_EN: string;
  Prevalence_Pct: number;
  Estimated_Cases: number;
  Clinical_Focus: string;
  Source: string;
}

export interface MorbidityItem {
  Care_Type: string;
  Rank: number;
  ICD10_Code: string;
  Condition_Name_TH: string;
  Condition_Name_EN: string;
  Cases_2565: number;
  Cases_2566: number;
  Cases_2567: number;
  Cases_2568: number | string;
  Cases_2569: number | string;
  Rate_Per_100k_2567: number;
  Growth_2565_2567_Pct: number;
  Remarks: string;
  Source: string;
}

export interface MortalityItem {
  Rank: number | string;
  ICD10_Code: string;
  Cause_Of_Death_TH: string;
  Cause_Of_Death_EN: string;
  Deaths_2565: number;
  Deaths_2566: number;
  Deaths_2567: number;
  Deaths_2568: number | string;
  Deaths_2569: number | string;
  Mortality_Rate_Per_100k_2567: number;
  Mortality_Share_Pct_2567: number;
  Growth_2565_2567_Pct: number;
  Remarks: string;
  Source: string;
}

export interface BurdenOfDiseaseItem {
  Rank: number;
  Condition_Name_TH: string;
  Condition_Name_EN: string;
  Total_DALYs_Years: number;
  YLL_Premature_Death_Years: number;
  YLL_Share_Pct: number;
  YLD_Disability_Years: number;
  YLD_Share_Pct: number;
  Ratio_YLL_to_YLD: string;
  Nature_Of_Burden: string;
  Source: string;
}

export interface ComprehensiveItem {
  Category: string;
  Indicator_Code: string;
  Indicator_Name_TH: string;
  Indicator_Name_EN: string;
  Sub_Dimension: string;
  Year_TH: number;
  Value_Numeric: number | string | null;
  Unit: string;
  Metric_Type: string;
  Data_Source: string;
  Remarks: string;
}

export const demographicsData: DemographicItem[] = ${JSON.stringify(demographics, null, 2)};
export const functionalAbilityData: FunctionalAbilityItem[] = ${JSON.stringify(functionalAbility, null, 2)};
export const screening9dData: Screening9dItem[] = ${JSON.stringify(screening9d, null, 2)};
export const chronicNCDsData: ChronicNCDItem[] = ${JSON.stringify(chronicNCDs, null, 2)};
export const morbidityData: MorbidityItem[] = ${JSON.stringify(morbidity, null, 2)};
export const mortalityData: MortalityItem[] = ${JSON.stringify(mortality, null, 2)};
export const burdenOfDiseaseData: BurdenOfDiseaseItem[] = ${JSON.stringify(burdenOfDisease, null, 2)};
export const comprehensiveDataset: ComprehensiveItem[] = ${JSON.stringify(comprehensive, null, 2)};
`;

fs.writeFileSync(targetFile, tsContent, 'utf-8');
console.log('Successfully written agingData.ts! Total comprehensive items:', comprehensive.length);
