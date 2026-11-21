import type { Question } from '@/types';

/**
 * 動作確認用の仮問題（4分野×2問）。
 * 本番の問題は後で差し替える。将来は S3 + CloudFront から JSON を取得する想定。
 */
export const QUESTIONS: Question[] = [
  {
    id: 'Q-SEC-0001',
    domain: 'secure',
    services: ['VPC', 'S3'],
    type: 'single',
    stem:
      'プライベートサブネットにある EC2 インスタンスから、同じリージョンの S3 バケットにアクセスする必要がある。通信はインターネットを経由させず、追加の通信料金も抑えたい。最も適切な方法はどれか。',
    choices: [
      { id: 'A', text: 'パブリックサブネットに NAT ゲートウェイを作成し、ルートテーブルで経由させる', why_wrong: 'NAT ゲートウェイ経由ではインターネット向けの経路になり、時間料金とデータ処理料金もかかる。' },
      { id: 'B', text: 'S3 用のゲートウェイ型 VPC エンドポイントを作成し、ルートテーブルに追加する' },
      { id: 'C', text: 'インスタンスにパブリック IP を付与し、インターネットゲートウェイ経由でアクセスする', why_wrong: 'インターネットを経由するため要件に反し、プライベートサブネットの意味もなくなる。' },
      { id: 'D', text: 'S3 との間に VPC ピアリング接続を作成する', why_wrong: 'VPC ピアリングは VPC 同士をつなぐもので、S3 との接続には使えない。' },
    ],
    answer_ids: ['B'],
    explanation:
      'S3 と DynamoDB には **ゲートウェイ型 VPC エンドポイント** がある。ルートテーブルにエントリを追加するだけで、AWS ネットワーク内で S3 に到達でき、エンドポイント自体の追加料金もかからない。\n\nバケットポリシーで `aws:sourceVpce` を条件にすれば、そのエンドポイント経由のアクセスだけに絞ることもできる。',
    references: ['https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-SEC-0002',
    domain: 'secure',
    services: ['IAM'],
    type: 'multiple',
    stem: 'AWS アカウントのルートユーザーを保護するためのベストプラクティスとして正しいものを 2 つ選べ。',
    choices: [
      { id: 'A', text: 'ルートユーザーに MFA を設定する' },
      { id: 'B', text: 'ルートユーザーのアクセスキーを作成しない（ある場合は削除する）' },
      { id: 'C', text: '日常の管理作業はルートユーザーで行い、IAM ユーザーは開発者だけに発行する', why_wrong: 'ルートユーザーは一部の特別な作業に限定し、日常作業は権限を絞った IAM ユーザーやロールで行う。' },
      { id: 'D', text: 'ルートユーザーのパスワードを管理者チーム全員で共有する', why_wrong: '認証情報の共有は誰が操作したか追跡できなくなり、漏えいリスクも高まる。' },
      { id: 'E', text: 'ルートユーザーに IAM ポリシーをアタッチして権限を制限する', why_wrong: 'ルートユーザーには IAM ポリシーをアタッチできない。組織のメンバーアカウントなら SCP で制限できる。' },
    ],
    answer_ids: ['A', 'B'],
    explanation:
      'ルートユーザーはアカウント内のすべてを操作できるため、**MFA の有効化** と **アクセスキーを持たないこと** が基本。日常作業には IAM Identity Center や IAM ロールを使い、ルートユーザーは請求設定の変更など一部の作業だけに使う。',
    references: ['https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-RES-0001',
    domain: 'resilient',
    services: ['RDS'],
    type: 'single',
    stem:
      'Amazon RDS for MySQL で本番データベースを運用している。アベイラビリティーゾーン（AZ）に障害が起きても、手作業なしで数分以内にデータベースを復旧させたい。どの構成にすべきか。',
    choices: [
      { id: 'A', text: '同じリージョンにリードレプリカを作成する', why_wrong: 'リードレプリカは読み取り負荷の分散が目的。昇格は手動操作が必要で、非同期レプリケーションのためデータ損失の可能性もある。' },
      { id: 'B', text: 'マルチ AZ 配置を有効にする' },
      { id: 'C', text: '自動スナップショットを別リージョンにコピーする', why_wrong: 'スナップショットからの復元には時間がかかり、手作業も必要になる。災害対策（DR）向けの手段。' },
      { id: 'D', text: 'インスタンスクラスを大きくする', why_wrong: '性能は上がるが、AZ 障害への耐性は変わらない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**マルチ AZ 配置** では別の AZ にスタンバイが同期レプリケーションで用意され、障害時は自動でフェイルオーバーする。DNS 名は変わらないため、アプリ側の変更も不要。\n\n「可用性 → マルチ AZ」「読み取り性能 → リードレプリカ」と使い分けを覚えておく。',
    references: ['https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-RES-0002',
    domain: 'resilient',
    services: ['SQS', 'EC2'],
    type: 'single',
    stem:
      'EC2 上の Web 層が受け付けた注文を、バックエンドの処理サーバーが処理している。セール時にアクセスが急増すると処理が追いつかず、注文が失われることがある。注文を失わずに処理するための最適な改善はどれか。',
    choices: [
      { id: 'A', text: 'Web 層と処理サーバーの間に Amazon SQS キューを置き、処理サーバーはキューから取り出して処理する' },
      { id: 'B', text: 'Amazon SNS トピックに注文を発行し、処理サーバーをサブスクライバーにする', why_wrong: 'SNS はプッシュ型の通知で、処理側が追いつかないときにメッセージをためておくバッファにはならない。' },
      { id: 'C', text: '処理サーバーのインスタンスサイズを大きくする', why_wrong: '処理能力は上がるが、想定を超える急増が来れば同じ問題が起きる。疎結合にはならない。' },
      { id: 'D', text: 'Web 層から処理サーバーへの呼び出しをリトライ付きの同期呼び出しにする', why_wrong: '同期呼び出しのままでは処理サーバーの性能に Web 層が引きずられ、密結合も解消されない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**SQS** を間に置くと、注文はキューに保持され、処理サーバーは自分のペースで取り出せる（疎結合）。さらにキューの滞留数を指標に Auto Scaling すれば、急増時に処理サーバーを自動で増やせる。',
    references: ['https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-PRF-0001',
    domain: 'performance',
    services: ['CloudFront', 'S3'],
    type: 'single',
    stem:
      '東京リージョンの S3 バケットで画像や動画などの静的コンテンツを配信している。世界中のユーザーから表示が遅いと指摘があった。最も効果的な改善策はどれか。',
    choices: [
      { id: 'A', text: 'S3 Transfer Acceleration を有効にする', why_wrong: 'Transfer Acceleration は主に遠隔地からの「アップロード」を速くする機能で、配信のキャッシュはしない。' },
      { id: 'B', text: 'Amazon CloudFront ディストリビューションを作成し、S3 をオリジンにする' },
      { id: 'C', text: 'AWS Global Accelerator を S3 の前段に置く', why_wrong: 'Global Accelerator は TCP/UDP の経路を最適化するもので、コンテンツをキャッシュしない。S3 を直接のエンドポイントにもできない。' },
      { id: 'D', text: 'S3 のストレージクラスを S3 Express One Zone に変更する', why_wrong: '単一 AZ 内での低レイテンシー向けで、遠隔地のユーザーへの配信速度は改善しない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**CloudFront** は世界中のエッジロケーションでコンテンツをキャッシュし、ユーザーに近い場所から配信する。オリジンアクセスコントロール（OAC）を使えば、S3 バケットを非公開のまま CloudFront 経由だけで配信できる。',
    references: ['https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-PRF-0002',
    domain: 'performance',
    services: ['DynamoDB', 'DAX'],
    type: 'single',
    stem:
      'DynamoDB を使うアプリで、同じ項目への読み取りが集中している。読み取りの応答をマイクロ秒単位まで短くしたいが、アプリのコード変更は最小限にしたい。最適な方法はどれか。',
    choices: [
      { id: 'A', text: 'Amazon ElastiCache (Redis OSS) を導入し、アプリでキャッシュ処理を実装する', why_wrong: '高速化はできるが、キャッシュの読み書きや無効化をアプリ側で実装する必要があり、変更が大きい。' },
      { id: 'B', text: 'DynamoDB Accelerator（DAX）クラスターを作成し、DAX クライアントに切り替える' },
      { id: 'C', text: 'テーブルの読み込みキャパシティーを増やす', why_wrong: 'スロットリングは防げるが、DynamoDB 自体の応答は 1 桁ミリ秒で、マイクロ秒にはならない。' },
      { id: 'D', text: 'グローバルテーブルを有効にする', why_wrong: '複数リージョンへの複製で、同一リージョン内の読み取りレイテンシーは改善しない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**DAX** は DynamoDB 専用のインメモリキャッシュで、DynamoDB と互換性のある API を持つ。クライアントを DAX 用に差し替えるだけで、読み取りがマイクロ秒単位になる。',
    references: ['https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-CST-0001',
    domain: 'cost',
    services: ['S3'],
    type: 'single',
    stem:
      'アプリのログを S3 に保存している。ログは作成から 30 日間は頻繁に参照されるが、その後はほとんど参照されない。監査のため 7 年間保管する必要があり、古いログの取り出しは 48 時間以内でよい。最もコストを抑えられる方法はどれか。',
    choices: [
      { id: 'A', text: 'すべてのログを最初から S3 標準 - 低頻度アクセス（Standard-IA）に保存する', why_wrong: '最初の 30 日は頻繁に参照されるため取り出し料金がかさむ。長期保管の単価も Glacier 系より高い。' },
      { id: 'B', text: 'ライフサイクルルールで、30 日後に S3 Glacier Deep Archive へ移行する' },
      { id: 'C', text: 'ログを EBS ボリュームに保存し、定期的にスナップショットを取得する', why_wrong: 'EBS はブロックストレージで、長期のログ保管には S3 より割高になる。' },
      { id: 'D', text: 'ライフサイクルルールで、30 日後に S3 1 ゾーン - IA へ移行する', why_wrong: 'Glacier Deep Archive より単価が高く、単一 AZ のため AZ 障害でデータを失うおそれもある。' },
    ],
    answer_ids: ['B'],
    explanation:
      'アクセスパターンが分かっているなら **ライフサイクルルール** で自動移行するのが定石。**Glacier Deep Archive** は S3 で最も安いストレージクラスで、標準取り出しは 12 時間以内、大容量取り出しは 48 時間以内。',
    references: ['https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-CST-0002',
    domain: 'cost',
    services: ['EC2', 'Savings Plans'],
    type: 'single',
    stem:
      '24 時間 365 日稼働する EC2 のワークロードがあり、今後 1 年間は同程度の使用量が続く見込みである。ただし、途中でインスタンスファミリーやリージョンを変更する可能性がある。最もコストを抑えられる購入方法はどれか。',
    choices: [
      { id: 'A', text: 'スポットインスタンスで運用する', why_wrong: 'スポットは中断される可能性があり、常時稼働が必要なワークロードには向かない。' },
      { id: 'B', text: 'スタンダードリザーブドインスタンスを 1 年契約で購入する', why_wrong: 'スタンダード RI はインスタンスファミリーやリージョンを変更できず、要件に合わない。' },
      { id: 'C', text: 'Compute Savings Plans を 1 年契約で購入する' },
      { id: 'D', text: 'オンデマンドインスタンスのまま運用する', why_wrong: '柔軟性は最も高いが、長期の常時稼働では割引がなく最も割高になる。' },
    ],
    answer_ids: ['C'],
    explanation:
      '**Compute Savings Plans** は 1 時間あたりの利用額を約束する代わりに割引を受ける仕組み。インスタンスファミリー、サイズ、リージョン、OS を変えても割引が適用され、Fargate や Lambda にも使える。',
    references: ['https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html'],
    difficulty: 2,
    version: 1,
  },
];

export const questionById = (id: string) => QUESTIONS.find((q) => q.id === id);
