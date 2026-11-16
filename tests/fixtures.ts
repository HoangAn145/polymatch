import { questions, type AssessmentInput } from '../src/platform/domain';
import { SOLUTIONS_DATA } from '../src/data/solutionsData';
export function input(): AssessmentInput {
  return {
    branch: 'VT',
    scale: 'nho',
    budget: 100,
    readiness: 3,
    answers: Object.fromEntries(questions('VT').map((q) => [q.id, 2])),
    kpis: [
      {
        code: 'otif',
        value: 85,
        target: 95,
        period: '2026-11',
        source: 'Báo cáo điều vận',
      },
      {
        code: 'emptyKm',
        value: 25,
        target: 15,
        period: '2026-11',
        source: 'GPS đối soát',
      },
    ],
  };
}
export const catalog = SOLUTIONS_DATA.map((data) => ({
  id: data.id,
  data,
  published: true,
  approved: true,
}));
