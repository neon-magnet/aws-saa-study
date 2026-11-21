import type { Domain } from '@/types';

export const colors = {
  navy: '#061B42',
  navyLight: '#0F2C63',
  orange: '#FF9900',
  orangeSoft: '#FFF3E0',
  bg: '#F4F6FA',
  card: '#FFFFFF',
  text: '#0E1726',
  sub: '#5B6577',
  border: '#DDE2EA',
  correct: '#1E8E5A',
  correctSoft: '#E6F5ED',
  wrong: '#C93C3C',
  wrongSoft: '#FCEBEB',
};

export const DOMAINS: { key: Domain; label: string; short: string; weight: number }[] = [
  { key: 'secure', label: 'セキュアなアーキテクチャの設計', short: 'セキュア', weight: 0.3 },
  { key: 'resilient', label: '弾力性に優れたアーキテクチャの設計', short: '弾力性', weight: 0.26 },
  { key: 'performance', label: '高性能なアーキテクチャの設計', short: '高性能', weight: 0.24 },
  { key: 'cost', label: 'コストを最適化したアーキテクチャの設計', short: 'コスト', weight: 0.2 },
];

export const domainShort = (d: Domain) => DOMAINS.find((x) => x.key === d)?.short ?? d;

export const PASS_SCORE = 720;
