import type { Question } from '@/types';

// 分野3: 高性能なアーキテクチャの設計（オリジナル問題）
export const PERFORMANCE: Question[] = [
  // ---- 基礎 ----
  {
    id: 'Q-PRF-0003',
    domain: 'performance',
    services: ['RDS'],
    type: 'single',
    stem:
      'RDS for MySQL を使うニュースサイトで、記事の閲覧（読み取り）が急増してデータベースの負荷が高い。書き込みは少ない。アプリの変更を最小限にして読み取り性能を上げる方法はどれか。',
    choices: [
      { id: 'A', text: 'リードレプリカを作成し、読み取りの接続先をレプリカに向ける' },
      { id: 'B', text: 'マルチ AZ を有効にし、スタンバイにも読み取りをさせる', why_wrong: '通常のマルチ AZ 配置（スタンバイ 1 台）のスタンバイは障害時用で、読み取りには使えない。' },
      { id: 'C', text: '自動バックアップの頻度を上げる', why_wrong: 'バックアップの設定は読み取り性能に影響しない。' },
      { id: 'D', text: 'ストレージの容量を増やす', why_wrong: '容量が足りないわけではないため、読み取りの負荷分散にはならない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**リードレプリカ** は非同期で複製された読み取り専用のコピー。読み取りの多い処理をレプリカへ向けると、元のデータベース（プライマリ）の負荷を下げられる。\n\n「可用性 → マルチ AZ」「読み取り性能 → リードレプリカ」の使い分けが頻出。',
    references: ['https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-PRF-0004',
    domain: 'performance',
    services: ['ElastiCache'],
    type: 'single',
    stem:
      'ゲームのランキングやログイン中のセッション情報を、1 ミリ秒未満で読み書きしたい。複数の Web サーバーから同じデータを参照する。最も適切なサービスはどれか。',
    choices: [
      { id: 'A', text: 'Amazon S3', why_wrong: 'S3 はオブジェクトストレージで、ミリ秒未満の応答を求める頻繁な読み書きには向かない。' },
      { id: 'B', text: 'Amazon ElastiCache（Valkey / Redis OSS）' },
      { id: 'C', text: 'Amazon Athena', why_wrong: 'Athena は S3 上のデータを SQL で分析するサービスで、リアルタイムの読み書きには使わない。' },
      { id: 'D', text: 'Amazon S3 Glacier Instant Retrieval', why_wrong: '長期保管向けのストレージクラスで、頻繁な読み書きには向かない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**ElastiCache** はインメモリのデータストアで、1 ミリ秒未満の応答が得られる。Valkey や Redis OSS ではソート済みセット（ランキング）などのデータ構造も使え、セッション管理やキャッシュの定番。',
    references: ['https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-PRF-0005',
    domain: 'performance',
    services: ['Athena', 'S3'],
    type: 'single',
    stem:
      'S3 に蓄積したアクセスログを、必要なときだけ SQL で集計したい。サーバーやクラスターの管理はしたくない。最も適切なサービスはどれか。',
    choices: [
      { id: 'A', text: 'Amazon Athena' },
      { id: 'B', text: 'ログを RDS に取り込んで SQL を実行する', why_wrong: '取り込み処理とデータベースの管理が必要になり、ログが増えるほど手間とコストがかかる。' },
      { id: 'C', text: 'Amazon EMR クラスターを常に起動しておく', why_wrong: 'クラスターの管理が必要で、たまに集計するだけの用途には大げさ。' },
      { id: 'D', text: 'Amazon Kinesis Data Streams', why_wrong: 'リアルタイムのデータを取り込むサービスで、蓄積したログの SQL 集計には使わない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**Athena** は S3 上のデータに直接 SQL を実行できるサーバーレスのサービス。スキャンしたデータ量に応じた料金なので、データを Parquet などの列形式にしたり、パーティションを分けたりすると速く安くなる。',
    references: ['https://docs.aws.amazon.com/athena/latest/ug/what-is.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-PRF-0006',
    domain: 'performance',
    services: ['S3'],
    type: 'single',
    stem:
      '数 GB の動画ファイルを S3 にアップロードしている。途中で通信が切れると最初からやり直しになり、時間もかかる。アップロードを速く、確実にする方法はどれか。',
    choices: [
      { id: 'A', text: 'マルチパートアップロードを使い、ファイルを分割して並列に送る' },
      { id: 'B', text: '1 回の PUT リクエストで送る', why_wrong: '並列化できず、失敗すると全体をやり直すことになる。1 回の PUT で送れるのは 5 GB まで。' },
      { id: 'C', text: 'バケットのバージョニングを有効にする', why_wrong: '過去の版を残す機能で、アップロードの速度や再開には関係ない。' },
      { id: 'D', text: 'ストレージクラスを S3 Glacier Deep Archive にする', why_wrong: '保管コストを下げるもので、アップロードは速くならない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**マルチパートアップロード** はファイルを複数の部分に分けて並列に送る。失敗した部分だけ再送すればよく、全体も速くなる。目安として 100 MB を超えるファイルで使うことが推奨されている。\n\n遠く離れた場所からのアップロードなら、Transfer Acceleration との組み合わせも有効。',
    references: ['https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-PRF-0007',
    domain: 'performance',
    services: ['Kinesis Data Streams'],
    type: 'single',
    stem:
      'EC サイトのクリック履歴をリアルタイムに取り込み、不正検知とレコメンドの 2 つのアプリで同じデータを処理したい。同じユーザーの操作は発生した順に処理する必要がある。最も適切なサービスはどれか。',
    choices: [
      { id: 'A', text: 'SQS 標準キュー', why_wrong: '標準キューは順序を保証せず、1 つのメッセージは 1 つの受信者が処理すると消えるため、2 つのアプリで同じデータを使えない。' },
      { id: 'B', text: 'Amazon Kinesis Data Streams' },
      { id: 'C', text: 'S3 に 1 時間ごとにファイルを書き出す', why_wrong: 'リアルタイムの処理にならない。' },
      { id: 'D', text: 'Amazon SNS 標準トピック', why_wrong: '標準トピックは順序を保証せず、データを保持して後から読み直すこともできない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**Kinesis Data Streams** は、パーティションキー（例：ユーザー ID）ごとにシャード内で順序を保つ。データは一定期間保持され、複数のアプリが同じストリームをそれぞれ読み取れる。',
    references: ['https://docs.aws.amazon.com/streams/latest/dev/introduction.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-PRF-0008',
    domain: 'performance',
    services: ['EBS'],
    type: 'single',
    stem:
      'ミッションクリティカルなデータベースを EC2 上で動かす。非常に高い IOPS と安定した低レイテンシーが必要で、IOPS は容量とは別に指定したい。最も適切な EBS ボリュームタイプはどれか。',
    choices: [
      { id: 'A', text: 'プロビジョンド IOPS SSD（io2 Block Express）' },
      { id: 'B', text: 'スループット最適化 HDD（st1）', why_wrong: '大きなファイルを順番に読み書きする用途向けで、データベースのランダムアクセスには向かない。' },
      { id: 'C', text: 'Cold HDD（sc1）', why_wrong: 'アクセスの少ないデータ向けの最も安いボリュームで、性能は低い。' },
      { id: 'D', text: '汎用 SSD（gp2）', why_wrong: 'gp2 は IOPS が容量に比例して決まるため、容量と別に IOPS を指定できない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**io2 Block Express** はプロビジョンド IOPS SSD で、必要な IOPS を容量とは別に指定でき、最も高い性能と耐久性を持つ。高負荷のデータベース向け。\n\nHDD 系（st1, sc1）は大きなデータの順次アクセス向けで、起動ボリュームにも使えない。',
    references: ['https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html'],
    difficulty: 1,
    version: 1,
  },

  // ---- 応用 ----
  {
    id: 'Q-PRF-0009',
    domain: 'performance',
    services: ['EC2'],
    type: 'single',
    stem:
      '科学計算（HPC）のワークロードで、多数の EC2 インスタンスがお互いに大量のデータをやり取りする。ノード間の通信のレイテンシーを最小にしたい。どの配置方法を使うべきか。',
    choices: [
      { id: 'A', text: 'クラスタープレイスメントグループ' },
      { id: 'B', text: '分散（スプレッド）プレイスメントグループ', why_wrong: 'インスタンスを別々のハードウェアに分けて障害の影響を減らす方式で、通信の速さは目的ではない。' },
      { id: 'C', text: 'パーティションプレイスメントグループ', why_wrong: 'Hadoop などの分散システムで、障害の影響範囲をパーティション単位に分けるための方式。' },
      { id: 'D', text: '複数の AZ に均等に分散させる', why_wrong: 'AZ をまたぐ通信は同じ AZ 内よりレイテンシーが大きくなる。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**クラスタープレイスメントグループ** は、インスタンスを 1 つの AZ 内の近い場所にまとめて配置し、低レイテンシー・高スループットの通信を実現する。HPC 向け。その代わり、AZ 障害の影響はまとめて受ける。',
    references: ['https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-PRF-0010',
    domain: 'performance',
    services: ['Lambda'],
    type: 'single',
    stem:
      'API Gateway と Lambda で作った API がある。毎朝 9 時にアクセスが集中し、コールドスタートによる応答の遅れが問題になっている。最も適切な対策はどれか。',
    choices: [
      { id: 'A', text: 'Lambda 関数のタイムアウトを長くする', why_wrong: 'タイムアウトを延ばしても、起動にかかる時間は短くならない。' },
      { id: 'B', text: '予約済み同時実行数（Reserved Concurrency）を設定する', why_wrong: '予約済み同時実行数は同時実行の枠を確保・制限するもので、実行環境を事前に起動しておくわけではない。' },
      { id: 'C', text: 'プロビジョニングされた同時実行（Provisioned Concurrency）を設定し、Application Auto Scaling のスケジュールで朝の時間帯に増やす' },
      { id: 'D', text: 'Lambda 関数のメモリを最小値まで減らす', why_wrong: 'メモリを減らすと割り当てられる CPU も減り、かえって遅くなる。' },
    ],
    answer_ids: ['C'],
    explanation:
      '**プロビジョニングされた同時実行** を設定すると、指定した数の実行環境が初期化された状態で待機し、コールドスタートがなくなる。待機中も料金がかかるため、アクセスが集中する時間帯だけスケジュールで増やすとコストを抑えられる。',
    references: ['https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-PRF-0011',
    domain: 'performance',
    services: ['RDS Proxy', 'Lambda', 'RDS'],
    type: 'single',
    stem:
      '多数の Lambda 関数が同時に RDS for MySQL へ接続している。アクセスが増えると接続数の上限に達し、エラーが起きる。アプリの変更を最小限に抑えて解決する方法はどれか。',
    choices: [
      { id: 'A', text: 'Amazon RDS Proxy を導入し、Lambda から RDS Proxy 経由で接続する' },
      { id: 'B', text: 'リードレプリカを追加する', why_wrong: '読み取りは分散できるが、書き込みを含む接続数の問題は解決しない。' },
      { id: 'C', text: 'DynamoDB Accelerator（DAX）を導入する', why_wrong: 'DAX は DynamoDB 専用のキャッシュで、RDS には使えない。' },
      { id: 'D', text: 'Lambda 関数のタイムアウトを長くする', why_wrong: '接続を長く持つことになり、接続数の問題が悪化しやすい。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**RDS Proxy** はデータベース接続をプールして使い回す。大量の Lambda からの短い接続をまとめるので、データベースの接続数と負荷を抑えられる。接続先のエンドポイントを変えるだけで使え、フェイルオーバー時間の短縮にも役立つ。',
    references: ['https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-PRF-0012',
    domain: 'performance',
    services: ['Global Accelerator'],
    type: 'single',
    stem:
      '世界中のプレイヤーが接続するオンラインゲームのサーバーを、複数のリージョンで動かしている。通信は UDP で、利用者には固定の IP アドレスで接続させたい。AWS のネットワークを使って遅延を減らし、障害時は数十秒以内に別リージョンへ切り替えたい。最も適切なサービスはどれか。',
    choices: [
      { id: 'A', text: 'Amazon CloudFront', why_wrong: 'CloudFront は HTTP/HTTPS コンテンツの配信とキャッシュ向けで、ゲームの UDP 通信には使えない。' },
      { id: 'B', text: 'AWS Global Accelerator' },
      { id: 'C', text: 'Route 53 のレイテンシーベースルーティング', why_wrong: '固定の IP アドレスを提供せず、DNS のキャッシュがあるため切り替えにも時間がかかる。' },
      { id: 'D', text: 'S3 Transfer Acceleration', why_wrong: 'S3 へのアップロード・ダウンロードを速くする機能で、ゲームサーバーの通信には関係ない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**Global Accelerator** は 2 つの固定のエニーキャスト IP アドレスを提供し、利用者を最寄りのエッジから AWS のネットワーク経由でエンドポイントへ届ける。TCP と UDP に対応し、ヘルスチェックで異常を検知すると、DNS の切り替えを待たずに正常なリージョンへ送る。',
    references: ['https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-PRF-0013',
    domain: 'performance',
    services: ['FSx for Lustre', 'S3'],
    type: 'single',
    stem:
      '機械学習の学習処理で、S3 にある数百 TB のデータを多数の EC2 インスタンスから高速に並列で読み込みたい。ファイルシステムとしてマウントして使え、結果は S3 に書き戻したい。最も適切なサービスはどれか。',
    choices: [
      { id: 'A', text: 'Amazon FSx for Lustre を S3 バケットと関連付けて使う' },
      { id: 'B', text: 'Amazon FSx for Windows File Server', why_wrong: 'Windows の SMB ファイル共有向けで、HPC や機械学習の高速な並列処理には向かない。' },
      { id: 'C', text: '各インスタンスの EBS に毎回データをコピーする', why_wrong: 'コピーに時間がかかり、インスタンスごとに容量とコストも必要になる。' },
      { id: 'D', text: 'AWS Storage Gateway のファイルゲートウェイ', why_wrong: 'オンプレミスから S3 を使うためのサービスで、AWS 内の高速な並列処理向けではない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**FSx for Lustre** は HPC や機械学習向けの高性能な並列ファイルシステム。S3 バケットと関連付けると、S3 のオブジェクトをファイルとして読み込み、結果を S3 に書き戻せる。',
    references: ['https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-PRF-0014',
    domain: 'performance',
    services: ['DynamoDB'],
    type: 'single',
    stem:
      'IoT 機器のデータを DynamoDB に書き込んでいる。パーティションキーを「日付」にしているため、その日の書き込みが同じキーに集中し、テーブル全体のキャパシティに余裕があってもスロットリングが起きる。根本的な対策はどれか。',
    choices: [
      { id: 'A', text: 'テーブルの書き込みキャパシティをさらに増やす', why_wrong: '1 つのパーティションが処理できる量には上限があるため、同じキーへの集中は解消しない。' },
      { id: 'B', text: 'DynamoDB Accelerator（DAX）を導入する', why_wrong: 'DAX は読み取りをキャッシュするもので、書き込みの集中は解決しない。' },
      { id: 'C', text: 'パーティションキーを機器 ID にする、または日付に乱数のサフィックスを付けて、書き込みを多くのキーに分散させる' },
      { id: 'D', text: 'グローバルセカンダリインデックス（GSI）を追加する', why_wrong: 'GSI は別のキーで検索するためのもので、元のテーブルへの書き込み集中は変わらない。' },
    ],
    answer_ids: ['C'],
    explanation:
      'DynamoDB はパーティションキーでデータを分散する。値の種類が少ないキー（日付など）に書き込みが集中すると「ホットパーティション」になる。**値の種類が多いキー** を選ぶか、**サフィックスを付けて分散** させるのが根本的な対策。',
    references: ['https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html'],
    difficulty: 2,
    version: 1,
  },
];
