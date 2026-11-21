import type { Question } from '@/types';

// 分野2: 弾力性に優れたアーキテクチャの設計（オリジナル問題）
export const RESILIENT: Question[] = [
  // ---- 基礎 ----
  {
    id: 'Q-RES-0003',
    domain: 'resilient',
    services: ['ELB', 'EC2 Auto Scaling'],
    type: 'single',
    stem:
      'EC2 で動く Web アプリの可用性を高めたい。1 台のインスタンスや 1 つのアベイラビリティーゾーン（AZ）に障害が起きても、サービスを継続させる必要がある。最も適切な構成はどれか。',
    choices: [
      { id: 'A', text: '大きなインスタンスタイプの EC2 を 1 台で運用する', why_wrong: '1 台が故障するとサービスが止まる。単一障害点のまま。' },
      { id: 'B', text: '同じ AZ に EC2 を 3 台並べ、DNS で振り分ける', why_wrong: 'その AZ に障害が起きるとすべて止まる。DNS だけでは故障したインスタンスを外せない。' },
      { id: 'C', text: '複数の AZ にまたがる Auto Scaling グループを作り、Application Load Balancer のヘルスチェックで振り分ける' },
      { id: 'D', text: 'EC2 の自動復旧（オートリカバリー）だけを設定する', why_wrong: 'ハードウェア障害からの復旧には役立つが、AZ 障害には対応できず、復旧中はサービスが止まる。' },
    ],
    answer_ids: ['C'],
    explanation:
      '**複数 AZ の Auto Scaling グループ + ALB** が定番の構成。ALB はヘルスチェックに失敗したインスタンスへ通信を送らず、Auto Scaling は異常なインスタンスを自動で入れ替える。1 つの AZ が止まっても、残りの AZ で処理を続けられる。',
    references: ['https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-RES-0004',
    domain: 'resilient',
    services: ['EFS'],
    type: 'single',
    stem:
      '複数の AZ に配置した Linux の EC2 インスタンスから、同じファイルを同時に読み書きしたい。容量は自動で増減し、AZ 障害にも耐えられる共有ファイルシステムが必要である。どれを使うべきか。',
    choices: [
      { id: 'A', text: 'Amazon EBS ボリューム', why_wrong: 'EBS は 1 つの AZ 内のブロックストレージで、別の AZ のインスタンスとは共有できない。' },
      { id: 'B', text: 'Amazon EFS' },
      { id: 'C', text: 'インスタンスストア', why_wrong: 'インスタンスストアは一時的な領域で、インスタンスを停止すると消え、他のインスタンスと共有もできない。' },
      { id: 'D', text: 'Amazon S3 Glacier Flexible Retrieval', why_wrong: 'アーカイブ用のストレージで、ファイルシステムとして同時に読み書きする用途には使えない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**EFS** は NFS で複数のインスタンスからマウントできる共有ファイルシステム。データは複数の AZ に保存され、容量は使った分だけ自動で増減する。Windows のファイル共有が必要なら FSx for Windows File Server を選ぶ。',
    references: ['https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-RES-0005',
    domain: 'resilient',
    services: ['Route 53'],
    type: 'single',
    stem:
      '東京リージョンで Web サイトを運用し、大阪リージョンに待機用のサイトを用意した。東京が応答しなくなったときだけ、自動で大阪へ切り替えたい。Route 53 のどのルーティングポリシーを使うべきか。',
    choices: [
      { id: 'A', text: '加重ルーティング（50:50）', why_wrong: '平常時から両方に半分ずつ振り分けてしまい、「障害時だけ切り替える」要件に合わない。' },
      { id: 'B', text: 'シンプルルーティング', why_wrong: 'ヘルスチェックと組み合わせられず、障害時に自動で切り替わらない。' },
      { id: 'C', text: 'ヘルスチェック付きのフェイルオーバールーティング' },
      { id: 'D', text: '位置情報ルーティング', why_wrong: '利用者の場所で振り分け先を決める方式で、障害時の切り替えが目的ではない。' },
    ],
    answer_ids: ['C'],
    explanation:
      '**フェイルオーバールーティング** では、プライマリとセカンダリを指定する。プライマリのヘルスチェックが失敗したときだけ、Route 53 がセカンダリの値を返す。アクティブ／パッシブ構成の基本。',
    references: ['https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-RES-0006',
    domain: 'resilient',
    services: ['S3'],
    type: 'single',
    stem:
      'S3 に保存している重要な資料を、誤って上書きしたり削除したりしても元に戻せるようにしたい。最も簡単な方法はどれか。',
    choices: [
      { id: 'A', text: 'バケットのバージョニングを有効にする' },
      { id: 'B', text: 'SSE-KMS で暗号化する', why_wrong: '暗号化はデータを読めないようにするもので、上書きや削除から元に戻すことはできない。' },
      { id: 'C', text: 'S3 Transfer Acceleration を有効にする', why_wrong: '転送を速くする機能で、データの復元とは関係ない。' },
      { id: 'D', text: 'ストレージクラスを S3 Intelligent-Tiering にする', why_wrong: 'コストを最適化する機能で、過去の版は残らない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**バージョニング** を有効にすると、上書きのたびに過去の版が残る。削除しても「削除マーカー」が付くだけなので、以前の版に戻せる。古い版はライフサイクルルールで自動削除して、コストを抑えられる。',
    references: ['https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-RES-0007',
    domain: 'resilient',
    services: ['SNS', 'SQS'],
    type: 'single',
    stem:
      '注文が確定したら、在庫管理・メール送信・分析の 3 つのシステムに同じ注文情報を届けたい。どれかのシステムが一時的に止まっていても、そのシステム宛ての情報は失われないようにしたい。最も適切な構成はどれか。',
    choices: [
      { id: 'A', text: '1 つの SQS キューに注文を入れ、3 つのシステムで同じキューから取り出す', why_wrong: 'SQS のメッセージは 1 つの受信者が処理すると消えるため、3 つのシステムすべてには届かない。' },
      { id: 'B', text: 'SNS トピックに注文を発行し、システムごとの SQS キューをサブスクライブさせる' },
      { id: 'C', text: '注文処理のプログラムから 3 つのシステムの API を順番に呼び出す', why_wrong: '1 つのシステムが止まると呼び出しが失敗し、密結合のため全体の処理も止まりやすい。' },
      { id: 'D', text: '注文データを 1 台の EC2 のファイルに書き出し、各システムが読みに行く', why_wrong: 'その EC2 が単一障害点になり、読み取り済みの管理も自分で作る必要がある。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**SNS + SQS のファンアウト** 構成。SNS が同じメッセージを各 SQS キューへ複製し、それぞれのシステムは自分のキューから自分のペースで処理する。システムが止まっていてもメッセージはキューに残るので、復旧後に処理できる。',
    references: ['https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html'],
    difficulty: 1,
    version: 1,
  },

  // ---- 応用 ----
  {
    id: 'Q-RES-0008',
    domain: 'resilient',
    services: ['災害対策', 'RDS'],
    type: 'single',
    stem:
      '基幹システムの災害対策を設計している。RPO（失ってもよいデータの範囲）は数分、RTO（復旧までの時間）は数十分以内。コストを抑えるため、別リージョンではデータベースだけを常に複製し、アプリサーバーは平常時は起動せず障害時に起動する方針である。この方式はどれか。',
    choices: [
      { id: 'A', text: 'バックアップと復元', why_wrong: 'バックアップから環境を作り直すため、RTO は数時間以上になりやすく、要件を満たせない。' },
      { id: 'B', text: 'パイロットライト' },
      { id: 'C', text: 'ウォームスタンバイ', why_wrong: 'ウォームスタンバイはアプリサーバーも縮小した規模で常に動かしておく方式。平常時は起動しないという方針と合わない。' },
      { id: 'D', text: 'マルチサイト（アクティブ／アクティブ）', why_wrong: '両方のリージョンで常に全規模を動かすため、コストが最も高い。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**パイロットライト** は、データベースなどの中核部分だけを別リージョンで常に動かしておき、アプリサーバーなどは障害時に起動・拡張する方式。\n\nコストと復旧の速さの順は、バックアップと復元 → パイロットライト → ウォームスタンバイ → マルチサイト。',
    references: ['https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-RES-0009',
    domain: 'resilient',
    services: ['Aurora'],
    type: 'single',
    stem:
      'Aurora MySQL を使うグローバルなアプリがある。リージョン全体の障害が起きた場合、別リージョンのデータベースを 1 分程度で書き込み可能に切り替えたい。また、他のリージョンの利用者には近くのリージョンから低遅延で読み取りをさせたい。最も適切な構成はどれか。',
    choices: [
      { id: 'A', text: 'Aurora のマルチ AZ 構成（同じリージョン内のレプリカ）', why_wrong: '同じリージョン内の AZ 障害には強いが、リージョン全体の障害には対応できない。' },
      { id: 'B', text: '毎日のスナップショットを別リージョンにコピーする', why_wrong: '復元に時間がかかり、最大 1 日分のデータを失う。読み取りの低遅延化にもならない。' },
      { id: 'C', text: 'Aurora Global Database を構成する' },
      { id: 'D', text: 'アプリから 2 つのリージョンの別々の Aurora クラスターに同時に書き込む', why_wrong: 'データの整合性をアプリ側で保つ必要があり、実装と運用が非常に複雑になる。' },
    ],
    answer_ids: ['C'],
    explanation:
      '**Aurora Global Database** は、ストレージ層の専用の仕組みで別リージョンへ通常 1 秒未満の遅延で複製する。セカンダリリージョンは読み取りに使え、障害時は 1 分程度で昇格できる。',
    references: ['https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-RES-0010',
    domain: 'resilient',
    services: ['DynamoDB'],
    type: 'single',
    stem:
      'DynamoDB を使うアプリを、米国・欧州・アジアの 3 リージョンで動かしたい。どのリージョンでも書き込みができ、1 つのリージョンが停止しても他のリージョンで処理を続けたい。運用の手間が最も少ない方法はどれか。',
    choices: [
      { id: 'A', text: 'DynamoDB グローバルテーブルを設定する' },
      { id: 'B', text: 'DynamoDB Streams と Lambda で、他のリージョンのテーブルへコピーする仕組みを作る', why_wrong: '実現はできるが、競合の処理や再送などを自分で作る必要があり、手間が大きい。' },
      { id: 'C', text: 'AWS Backup で別リージョンにバックアップをコピーする', why_wrong: 'バックアップからの復元には時間がかかり、各リージョンで常に書き込める構成にはならない。' },
      { id: 'D', text: 'DynamoDB Accelerator（DAX）を各リージョンに置く', why_wrong: 'DAX は読み取りを速くするキャッシュで、リージョン間の複製はしない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**グローバルテーブル** は、選んだリージョンにテーブルの複製を作り、自動で双方向に同期する。どのリージョンでも読み書きでき（マルチアクティブ）、リージョン障害時も他のリージョンで処理を続けられる。',
    references: ['https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-RES-0011',
    domain: 'resilient',
    services: ['SQS'],
    type: 'single',
    stem:
      'SQS キューのメッセージを処理するワーカーがある。形式が壊れた一部のメッセージは何度処理しても失敗し、キューに戻り続けて他のメッセージの処理を妨げている。最も適切な対策はどれか。',
    choices: [
      { id: 'A', text: '可視性タイムアウトを 0 秒にする', why_wrong: '処理中のメッセージがすぐに他のワーカーにも見えるようになり、重複処理が増えるだけで解決しない。' },
      { id: 'B', text: 'メッセージの保持期間を短くして、早く消えるようにする', why_wrong: '正常なメッセージまで処理前に消えるおそれがあり、失敗の原因調査もできなくなる。' },
      { id: 'C', text: 'デッドレターキューを設定し、最大受信回数を超えたメッセージをそこへ移す' },
      { id: 'D', text: 'キューを FIFO キューに変更する', why_wrong: 'FIFO は順序と重複排除のための機能。失敗し続けるメッセージがあると、同じグループの後続が止まり、かえって悪化する。' },
    ],
    answer_ids: ['C'],
    explanation:
      '**デッドレターキュー（DLQ）** を設定すると、指定した回数（maxReceiveCount）処理に失敗したメッセージが別のキューへ移される。元のキューの処理は止まらず、失敗したメッセージは後から原因を調べて再処理できる。',
    references: ['https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-RES-0012',
    domain: 'resilient',
    services: ['EC2 Auto Scaling'],
    type: 'single',
    stem:
      'Web アプリは常に最低 4 台の EC2 インスタンスが必要である。1 つの AZ が丸ごと停止しても、4 台を下回らないようにしたい。コストを最小にする Auto Scaling グループの設定はどれか。',
    choices: [
      { id: 'A', text: '1 つの AZ で最小 4 台', why_wrong: 'その AZ が停止するとすべてのインスタンスが止まる。' },
      { id: 'B', text: '2 つの AZ で最小 4 台（各 AZ に 2 台）', why_wrong: '1 つの AZ が止まると残りは 2 台になり、要件の 4 台を下回る。' },
      { id: 'C', text: '3 つの AZ で最小 6 台（各 AZ に 2 台）' },
      { id: 'D', text: '2 つの AZ で最小 8 台（各 AZ に 4 台）', why_wrong: '要件は満たすが、3 つの AZ で 6 台にする構成より 2 台多く、コストが高い。' },
    ],
    answer_ids: ['C'],
    explanation:
      '3 つの AZ に 2 台ずつ置けば、1 つの AZ が止まっても残り 2 つの AZ で 4 台を保てる。2 つの AZ だと同じ条件で 8 台必要になる。\n\n「AZ が 1 つ止まっても必要な台数を保つ」問題は、**必要台数 ÷（AZ 数 − 1）× AZ 数** で計算するとよい。',
    references: ['https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-benefits.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-RES-0013',
    domain: 'resilient',
    services: ['Step Functions', 'Lambda'],
    type: 'single',
    stem:
      '注文処理は「決済 → 在庫引き当て → 配送手配」の順に Lambda 関数で実行する。途中で失敗したら決められた回数だけ再試行し、それでも失敗したら決済を取り消す処理を実行したい。処理の状態も画面で確認したい。最も適切なサービスはどれか。',
    choices: [
      { id: 'A', text: 'AWS Step Functions' },
      { id: 'B', text: 'Lambda 関数の中から次の Lambda 関数を直接呼び出す', why_wrong: '再試行や取り消し処理をすべてコードで書く必要があり、どこまで進んだかも追いにくい。' },
      { id: 'C', text: 'EC2 上の cron で各処理を順番に実行する', why_wrong: 'サーバーの管理が必要で、再試行や失敗時の分岐も自分で作ることになる。' },
      { id: 'D', text: 'SQS キューを 1 つ用意し、すべての処理で共有する', why_wrong: 'キューだけでは処理の順序や失敗時の分岐を表現できない。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**Step Functions** は、処理の流れをステートマシンとして定義するサービス。ステップごとの再試行（Retry）、失敗時の分岐（Catch）で取り消し処理を呼べる。実行の進み具合はコンソールで図として確認できる。',
    references: ['https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-RES-0014',
    domain: 'resilient',
    services: ['RDS'],
    type: 'single',
    stem:
      'RDS for PostgreSQL の本番データベースで、運用担当者が誤った UPDATE 文を実行し、多くの行を壊してしまった。誤操作の 5 分前の状態に戻したい。自動バックアップは有効になっている。最も適切な方法はどれか。',
    choices: [
      { id: 'A', text: 'マルチ AZ のスタンバイにフェイルオーバーする', why_wrong: 'スタンバイには誤った更新も同期されているため、元の状態には戻らない。' },
      { id: 'B', text: 'リードレプリカを昇格させる', why_wrong: 'リードレプリカにも誤った更新が複製されている。' },
      { id: 'C', text: 'ポイントインタイムリカバリで、誤操作の 5 分前の時点を指定して新しい DB インスタンスとして復元する' },
      { id: 'D', text: '前日に取った手動スナップショットから復元する', why_wrong: '前日以降の正しい更新まで失われる。' },
    ],
    answer_ids: ['C'],
    explanation:
      '自動バックアップが有効なら、保持期間内の任意の時点に戻す **ポイントインタイムリカバリ** が使える。復元は新しい DB インスタンスとして作られるので、接続先を切り替えるか、必要なデータだけを移す。\n\nマルチ AZ やリードレプリカは障害対策で、誤操作は防げない点に注意。',
    references: ['https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html'],
    difficulty: 2,
    version: 1,
  },
];
