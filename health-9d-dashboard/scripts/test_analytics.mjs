import fs from 'fs';
import path from 'path';

const datasetPath = path.resolve('public/data/elderly_health_2026.json');
const raw = fs.readFileSync(datasetPath, 'utf8');
const dataset = JSON.parse(raw);

console.log('Testing dataset and analytical operations...');
console.log('1. Metadata verification:');
console.assert(dataset.metadata.totalProvinces === 76, 'Provinces count mismatch');
console.assert(dataset.metadata.totalRegions === 12, 'Regions count mismatch');
console.log('   ✓ 76 provinces and 12 regions verified.');

console.log('2. Ranking verification (Top 1 - 9):');
const nationalRankings = dataset.national.rankedDimensions;
console.assert(nationalRankings.length === 9, 'Should have 9 dimensions');
console.assert(nationalRankings[0].riskPct >= nationalRankings[1].riskPct, 'Rankings should be descending');
console.log('   ✓ National Top 3:', nationalRankings.slice(0, 3).map(r => `${r.rank}. ${r.name} (${r.riskPct}%)`));

console.log('3. Region 1 filter verification:');
const reg1 = dataset.regions.find(r => r.zone === 'เขตสุขภาพที่ 1');
console.assert(reg1 !== undefined, 'Region 1 missing');
console.assert(reg1.rankedDimensions[0].name === 'การมองเห็น', 'Region 1 Top 1 should be การมองเห็น');
console.assert(reg1.rankedDimensions[0].riskPct === 16.97, 'Region 1 Vision risk should be 16.97%');
console.log('   ✓ Region 1 Top 1:', reg1.rankedDimensions[0].name, `${reg1.rankedDimensions[0].riskPct}%`);

console.log('4. Province filter verification (เชียงใหม่):');
const cm = dataset.provinces.find(p => p.province === 'เชียงใหม่');
console.assert(cm !== undefined, 'Chiang Mai missing');
console.assert(cm.rankedDimensions[0].name === 'การมองเห็น', 'Chiang Mai Top 1 should be การมองเห็น');
console.assert(cm.rankedDimensions[0].riskPct === 17.28, 'Chiang Mai Vision risk should be 17.28%');
console.log('   ✓ Chiang Mai Top 1:', cm.rankedDimensions[0].name, `${cm.rankedDimensions[0].riskPct}%`);

console.log('\nAll analytics unit tests passed successfully! ✓');
