import type { Question } from '@/types';

// 分野4: コストを最適化したアーキテクチャの設計（オリジナル問題）
export const COST: Question[] = [
  // ---- 基礎 ----
  {
    id: 'Q-CST-0003',
    domain: 'cost',
    services: ['EC2'],
    type: 'single',
    stem:
      '毎晩、大量の画像を変換するバッチ処理を実行している。処理は途中で中断されても、続きから再開できる作りになっている。実行時間帯や台数は日によって変わる。最もコストを抑えられる EC2 の購入方法はどれか。',
    choices: [
      { id: 'A', text: 'オンデマンドインスタンス', why_wrong: '中断はされないが割引がなく、中断に耐えられる処理では割高。' },
      { id: 'B', text: 'スポットインスタンス' },
      { id: 'C', text: '3 年契約のリザーブドインスタンス', why_wrong: '使う時間や台数が日によって変わる処理では、使わない時間の分も支払うことになる。' },
      { id: 'D', text: 'Dedicated Hosts', why_wrong: '物理サーバーを専有する方式で、ライセンスや規制の要件がない限り割高。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**スポットインスタンス** は AWS の余っているキャパシティを大きな割引で使える。AWS の都合で中断されることがあるため、中断しても再開できるバッチ処理や、ステートレスな処理に向く。',
    references: ['https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-CST-0004',
    domain: 'cost',
    services: ['S3'],
    type: 'single',
    stem:
      'S3 に保存したデータのアクセス頻度が予測できず、ファイルによって大きく異なる。取り出し料金をかけずに、アクセス頻度に応じて自動でコストを下げたい。どのストレージクラスを使うべきか。',
    choices: [
      { id: 'A', text: 'S3 標準 - 低頻度アクセス（Standard-IA）', why_wrong: 'よく読まれるファイルでは取り出し料金がかさみ、かえって高くなるおそれがある。' },
      { id: 'B', text: 'S3 Intelligent-Tiering' },
      { id: 'C', text: 'S3 Glacier Flexible Retrieval', why_wrong: '取り出しに時間と料金がかかるため、アクセスされる可能性のあるデータには向かない。' },
      { id: 'D', text: 'S3 1 ゾーン - IA', why_wrong: '取り出し料金がかかり、単一 AZ に保存するため AZ 障害でデータを失うおそれもある。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**Intelligent-Tiering** はオブジェクトごとのアクセス状況を見て、安い階層へ自動で移す。取り出し料金はかからず、少額の監視料金だけで使える。アクセスパターンが分からないデータに最適。',
    references: ['https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-CST-0005',
    domain: 'cost',
    services: ['Budgets'],
    type: 'single',
    stem:
      '毎月の AWS 利用料金があらかじめ決めた金額を超えそうになったら、メールで通知を受け取りたい。どのサービスを使うべきか。',
    choices: [
      { id: 'A', text: 'AWS Budgets' },
      { id: 'B', text: 'AWS CloudTrail', why_wrong: 'CloudTrail は API の操作履歴を記録するサービスで、料金の予算管理はしない。' },
      { id: 'C', text: 'Amazon Inspector', why_wrong: 'Inspector は脆弱性を調べるサービスで、料金とは関係ない。' },
      { id: 'D', text: 'AWS Config', why_wrong: 'Config はリソースの設定変更を記録・評価するサービスで、料金の通知はしない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**AWS Budgets** で月の予算を設定すると、実績や予測がしきい値（例：80%）を超えたときにメールや SNS で通知できる。料金の内訳や傾向を分析したいときは **Cost Explorer** を使う。',
    references: ['https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-CST-0006',
    domain: 'cost',
    services: ['Compute Optimizer', 'EC2'],
    type: 'single',
    stem:
      '多数の EC2 インスタンスを運用している。実際の使用率から見て、大きすぎるインスタンスタイプがないかを調べ、適切なサイズの推奨を受けたい。どのサービスを使うべきか。',
    choices: [
      { id: 'A', text: 'AWS Compute Optimizer' },
      { id: 'B', text: 'AWS CloudTrail', why_wrong: '操作履歴を記録するサービスで、使用率に基づくサイズの推奨は出さない。' },
      { id: 'C', text: 'Amazon GuardDuty', why_wrong: '脅威を検出するセキュリティサービスで、コストの推奨はしない。' },
      { id: 'D', text: 'AWS Systems Manager Patch Manager', why_wrong: 'OS のパッチを適用するための機能で、インスタンスのサイズとは関係ない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**Compute Optimizer** は CloudWatch のメトリクスなどを機械学習で分析し、EC2、EBS、Lambda などの適切な設定（ライトサイジング）を推奨する。',
    references: ['https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-CST-0007',
    domain: 'cost',
    services: ['EventBridge', 'EC2'],
    type: 'single',
    stem:
      '開発環境の EC2 インスタンスは平日の 9 時〜19 時しか使われていないのに、24 時間動いている。コストを下げるために最も効果的な方法はどれか。',
    choices: [
      { id: 'A', text: 'Amazon EventBridge のスケジュールで、業務時間外にインスタンスを停止し、朝に起動する' },
      { id: 'B', text: '1 年契約のリザーブドインスタンスを購入する', why_wrong: '使っていない夜間や週末の分も支払うことになり、停止する方法より効果が小さい。' },
      { id: 'C', text: 'より大きなインスタンスタイプに変更する', why_wrong: 'コストが上がるだけ。' },
      { id: 'D', text: 'EBS ボリュームをプロビジョンド IOPS SSD に変更する', why_wrong: 'ストレージのコストが上がり、目的と逆になる。' },
    ],
    answer_ids: ['A'],
    explanation:
      'オンデマンドの EC2 は **停止中はインスタンス料金がかからない**（EBS の料金はかかる）。週 50 時間だけ動かせば、24 時間 365 日動かす場合の約 3 割の時間で済む。EventBridge のスケジュールや Instance Scheduler で自動化できる。',
    references: ['https://docs.aws.amazon.com/eventbridge/latest/userguide/using-eventbridge-scheduler.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-CST-0008',
    domain: 'cost',
    services: ['Lambda'],
    type: 'single',
    stem:
      'S3 にファイルが置かれたときだけ、サムネイル画像を作る処理を実行したい。ファイルが置かれるのは 1 日に数十回で、1 回の処理は数秒で終わる。最もコストを抑えられる実行方法はどれか。',
    choices: [
      { id: 'A', text: '小さな EC2 インスタンスを常時起動し、S3 を定期的に確認する', why_wrong: '処理のない時間もインスタンス料金がかかり続ける。' },
      { id: 'B', text: 'S3 のイベント通知で AWS Lambda 関数を実行する' },
      { id: 'C', text: 'EC2 のリザーブドインスタンスで常時処理サーバーを動かす', why_wrong: '割引はあっても、ほとんど何もしていない時間の料金を払うことになる。' },
      { id: 'D', text: 'Amazon EMR クラスターで処理する', why_wrong: '大規模なデータ処理向けで、数秒の小さな処理には大げさで高い。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**Lambda** はリクエスト数と実行時間（ミリ秒単位）に応じた料金で、処理していない時間は料金がかからない。S3 のイベント通知と組み合わせれば、ファイルが置かれたときだけ自動で実行できる。',
    references: ['https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-CST-0009',
    domain: 'cost',
    services: ['DynamoDB'],
    type: 'single',
    stem:
      '新しいサービスで DynamoDB を使う。リリース直後でアクセス量の予測ができず、急に増えることも、ほとんどないこともある。キャパシティの見積もりをせずに、使った分だけ支払いたい。どの設定がよいか。',
    choices: [
      { id: 'A', text: 'オンデマンドキャパシティモード' },
      { id: 'B', text: 'プロビジョンドキャパシティモードで、想定される最大値を固定で設定する', why_wrong: 'アクセスが少ない時間も最大値の分を支払うことになる。' },
      { id: 'C', text: 'DynamoDB Accelerator（DAX）を導入する', why_wrong: 'DAX は読み取りを速くするキャッシュで、料金体系の問題は解決しない。むしろ DAX の料金が追加される。' },
      { id: 'D', text: 'テーブルクラスを Standard-IA にする', why_wrong: 'Standard-IA はあまり読まれないデータの保存料金を下げるもので、アクセス量の予測ができない問題には対応しない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**オンデマンドモード** は読み書きのリクエスト数に応じた料金で、キャパシティの設定が不要。予測できないトラフィックに向く。アクセス量が安定して予測できるようになったら、プロビジョンドモード（Auto Scaling 付き）に切り替えると安くなることがある。',
    references: ['https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html'],
    difficulty: 1,
    version: 1,
  },

  // ---- 応用 ----
  {
    id: 'Q-CST-0010',
    domain: 'cost',
    services: ['VPC', 'NAT Gateway', 'S3'],
    type: 'single',
    stem:
      'プライベートサブネットの EC2 から、同じリージョンの S3 へ毎日数 TB のデータを送っている。通信は NAT ゲートウェイを通っており、NAT ゲートウェイのデータ処理料金が高額になっている。最も効果的なコスト削減策はどれか。',
    choices: [
      { id: 'A', text: 'NAT ゲートウェイを NAT インスタンスに置き換える', why_wrong: '料金は下がる場合があるが、運用の手間と単一障害点の問題が増える。S3 への通信を NAT から外す方が効果的。' },
      { id: 'B', text: 'S3 用のゲートウェイ型 VPC エンドポイントを作成し、ルートテーブルに追加する' },
      { id: 'C', text: 'NAT ゲートウェイを AZ ごとに追加する', why_wrong: '可用性は上がるが、データ処理料金は減らない。' },
      { id: 'D', text: 'S3 Transfer Acceleration を有効にする', why_wrong: '転送料金が追加でかかるうえ、NAT ゲートウェイを通る点は変わらない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**ゲートウェイ型 VPC エンドポイント**（S3 と DynamoDB 用）は追加料金なしで使える。S3 宛ての通信が NAT ゲートウェイを通らなくなるため、NAT のデータ処理料金がなくなる。\n\nセキュリティの面（インターネットを経由しない）とコストの面、両方で出題される。',
    references: ['https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-CST-0011',
    domain: 'cost',
    services: ['EC2', 'Savings Plans', 'EC2 Auto Scaling'],
    type: 'single',
    stem:
      'Web アプリは 1 日中、最低 10 台の EC2 が必要で、平日の昼は最大 30 台まで増える。昼の増加分は中断されると利用者に影響が出る。今後 1 年はこの傾向が続く見込みである。最もコスト効率のよい組み合わせはどれか。',
    choices: [
      { id: 'A', text: '30 台すべてをオンデマンドで運用する', why_wrong: '常に必要な 10 台にも割引が適用されず、最も割高。' },
      { id: 'B', text: '30 台分の Savings Plans を購入する', why_wrong: '夜間など 20 台分を使わない時間も支払うことになる。' },
      { id: 'C', text: '常に必要な 10 台分を Savings Plans で購入し、昼の増加分はオンデマンドで Auto Scaling する' },
      { id: 'D', text: '30 台すべてをスポットインスタンスで運用する', why_wrong: '中断されると利用者に影響が出るという要件に合わない。' },
    ],
    answer_ids: ['C'],
    explanation:
      '常に動く **ベースラインは Savings Plans やリザーブドインスタンスで割引** し、変動する部分はオンデマンド（中断できる処理ならスポット）で Auto Scaling するのが基本の考え方。',
    references: ['https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-CST-0012',
    domain: 'cost',
    services: ['Aurora'],
    type: 'single',
    stem:
      '社内向けアプリの Aurora MySQL は、平日の日中だけ使われ、負荷も時間帯によって大きく変わる。夜間と週末はほとんど使われない。キャパシティの管理を減らし、使った分に近い料金にしたい。最も適切な構成はどれか。',
    choices: [
      { id: 'A', text: 'ピーク時に合わせた大きなプロビジョンドインスタンスで常時運用する', why_wrong: '使われていない時間もピーク時の料金を払い続けることになる。' },
      { id: 'B', text: 'Aurora Serverless v2 を使い、最小と最大のキャパシティを設定する' },
      { id: 'C', text: 'Aurora レプリカを追加する', why_wrong: '読み取り性能や可用性は上がるが、インスタンスが増えるためコストも増える。' },
      { id: 'D', text: 'RDS for MySQL のマルチ AZ 配置に移行する', why_wrong: '可用性のための構成で、負荷に合わせたコスト削減にはならない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**Aurora Serverless v2** は負荷に応じてキャパシティ（ACU）が細かく自動で増減し、使った分だけ課金される。負荷の変動が大きい、または断続的に使われるデータベースに向く。',
    references: ['https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-CST-0013',
    domain: 'cost',
    services: ['CloudFront', 'S3'],
    type: 'single',
    stem:
      'S3 から直接、世界中の利用者に同じ商品画像を配信しており、インターネットへのデータ転送料金と S3 へのリクエスト料金が高い。表示速度も上げたい。最も適切な方法はどれか。',
    choices: [
      { id: 'A', text: 'CloudFront ディストリビューションを作成して画像をキャッシュさせ、S3 をオリジンにする' },
      { id: 'B', text: 'S3 Transfer Acceleration を有効にする', why_wrong: '転送経路を速くする機能で追加料金がかかり、キャッシュしないため S3 へのリクエストも減らない。' },
      { id: 'C', text: '画像を S3 Glacier Flexible Retrieval に移す', why_wrong: '保存料金は下がるが、取り出しに時間と料金がかかり、配信には使えない。' },
      { id: 'D', text: '各リージョンにバケットを作り、レプリケーションで複製する', why_wrong: 'レプリケーションの転送料金と保存料金が増え、キャッシュによるリクエスト削減にもならない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**CloudFront** がエッジで画像をキャッシュすると、S3 へのリクエストが大きく減る。S3 から CloudFront への転送は無料で、利用者への配信は CloudFront の料金になる。速度とコストの両方が改善する定番の構成。',
    references: ['https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-CST-0014',
    domain: 'cost',
    services: ['Organizations', 'Cost Explorer'],
    type: 'multiple',
    stem:
      '複数の部署が AWS を使っており、部署ごとの利用料金を把握して社内で請求したい。適切な方法を 2 つ選べ。',
    choices: [
      { id: 'A', text: 'リソースに部署名のタグを付け、そのタグをコスト配分タグとして有効にする' },
      { id: 'B', text: 'AWS Organizations で部署ごとにアカウントを分け、一括請求でアカウント別の料金を確認する' },
      { id: 'C', text: 'CloudWatch のメトリクスで CPU 使用率を部署ごとに集計する', why_wrong: '使用率は料金そのものではなく、ストレージやデータ転送などの料金も把握できない。' },
      { id: 'D', text: 'Amazon Inspector のレポートを部署ごとに出力する', why_wrong: 'Inspector は脆弱性の検査結果で、料金の情報は含まれない。' },
      { id: 'E', text: 'すべての部署で 1 つの IAM ユーザーを共有する', why_wrong: '誰が何を使ったか分からなくなり、セキュリティ上も問題がある。' },
    ],
    answer_ids: ['A', 'B'],
    explanation:
      '**コスト配分タグ** を有効にすると、Cost Explorer やコストと使用状況レポートでタグごとに料金を集計できる。\n\n**部署ごとのアカウント分け** なら、一括請求でアカウント別の料金がそのまま分かり、権限の分離もしやすい。実務では両方を組み合わせることが多い。',
    references: ['https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html'],
    difficulty: 2,
    version: 1,
  },
];
