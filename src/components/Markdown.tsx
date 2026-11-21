import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/lib/constants';

/** 行内の **太字** と `コード` を描画する */
export function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return (
        <Text key={j} style={{ fontWeight: '700' }}>
          {part.slice(2, -2)}
        </Text>
      );
    if (part.startsWith('`') && part.endsWith('`'))
      return (
        <Text key={j} style={s.code}>
          {part.slice(1, -1)}
        </Text>
      );
    return <Text key={j}>{part}</Text>;
  });
}

type Block =
  | { kind: 'h2' | 'h3' | 'p' | 'note'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] };

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());

export function parseBlocks(src: string): Block[] {
  const lines = src.split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: line.slice(4) });
      i++;
    } else if (line.startsWith('## ')) {
      blocks.push({ kind: 'h2', text: line.slice(3) });
      i++;
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) items.push(lines[i++].trim().slice(2));
      blocks.push({ kind: 'list', items });
    } else if (line.startsWith('> ')) {
      const parts: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) parts.push(lines[i++].trim().slice(2));
      blocks.push({ kind: 'note', text: parts.join('\n') });
    } else if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const r = lines[i++].trim();
        if (/^\|[\s:|-]+\|$/.test(r)) continue; // 区切り行
        rows.push(cells(r));
      }
      blocks.push({ kind: 'table', head: rows[0] ?? [], rows: rows.slice(1) });
    } else {
      const parts: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^(#{2,3} |- |> |\|)/.test(lines[i].trim())
      )
        parts.push(lines[i++].trim());
      blocks.push({ kind: 'p', text: parts.join('') });
    }
  }
  return blocks;
}

/** 教材本文の簡易Markdownを描画する */
export function Markdown({ source }: { source: string }) {
  const blocks = parseBlocks(source);
  return (
    <View style={{ gap: 12 }}>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'h2':
            return (
              <Text key={i} style={s.h2} accessibilityRole="header">
                {b.text}
              </Text>
            );
          case 'h3':
            return (
              <Text key={i} style={s.h3} accessibilityRole="header">
                {b.text}
              </Text>
            );
          case 'list':
            return (
              <View key={i} style={{ gap: 6 }}>
                {b.items.map((it, j) => (
                  <View key={j} style={s.li}>
                    <Text style={s.bullet}>•</Text>
                    <Text style={[s.p, { flex: 1 }]}>{inline(it)}</Text>
                  </View>
                ))}
              </View>
            );
          case 'note':
            return (
              <View key={i} style={s.note}>
                <Ionicons name="bulb" size={18} color={colors.orange} style={{ marginTop: 2 }} />
                <Text style={[s.p, { flex: 1 }]}>{inline(b.text)}</Text>
              </View>
            );
          case 'table':
            return (
              <View key={i} style={s.table}>
                <View style={[s.tr, s.thead]}>
                  {b.head.map((h, j) => (
                    <Text key={j} style={[s.td, s.th, j === 0 && s.first]}>
                      {inline(h)}
                    </Text>
                  ))}
                </View>
                {b.rows.map((r, j) => (
                  <View key={j} style={[s.tr, j < b.rows.length - 1 && s.trBorder]}>
                    {r.map((c, k) => (
                      <Text key={k} style={[s.td, k === 0 && s.first]}>
                        {inline(c)}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            );
          default:
            return (
              <Text key={i} style={s.p}>
                {inline(b.text)}
              </Text>
            );
        }
      })}
    </View>
  );
}

const s = StyleSheet.create({
  h2: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
    marginTop: 10,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: colors.orange,
    alignSelf: 'flex-start',
  },
  h3: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 },
  p: { fontSize: 15.5, lineHeight: 26, color: colors.text },
  li: { flexDirection: 'row', gap: 8, paddingLeft: 4 },
  bullet: { fontSize: 15.5, lineHeight: 26, color: colors.orange, fontWeight: '800' },
  note: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.orangeSoft,
    borderRadius: 12,
    padding: 14,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  tr: { flexDirection: 'row' },
  trBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  thead: { backgroundColor: '#EEF2FA' },
  td: { flex: 1, fontSize: 13.5, lineHeight: 20, color: colors.text, padding: 8 },
  th: { fontWeight: '700', color: colors.navy },
  first: { flex: 0.85, fontWeight: '700' },
  code: { fontFamily: 'Courier', backgroundColor: '#EEF1F6', color: colors.navy },
});
