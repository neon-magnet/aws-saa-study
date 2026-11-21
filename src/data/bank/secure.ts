import type { Question } from '@/types';

// 分野1: セキュアなアーキテクチャの設計（オリジナル問題）
export const SECURE: Question[] = [
  // ---- 基礎 ----
  {
    id: 'Q-SEC-0003',
    domain: 'secure',
    services: ['IAM', 'EC2'],
    type: 'single',
    stem:
      'EC2 インスタンス上のアプリケーションから S3 バケットを読み書きする必要がある。認証情報の漏えいリスクを最も小さくする方法はどれか。',
    choices: [
      { id: 'A', text: 'IAM ユーザーのアクセスキーをアプリのソースコードに書き込む', why_wrong: 'ソースコードやリポジトリからキーが漏えいしやすく、ローテーションも手作業になる。' },
      { id: 'B', text: '必要な権限を持つ IAM ロールを作成し、インスタンスプロファイルとして EC2 に割り当てる' },
      { id: 'C', text: 'IAM ユーザーのアクセスキーを EC2 の環境変数に設定する', why_wrong: '長期のアクセスキーを使う点は変わらず、インスタンスにログインできる人に見えてしまう。' },
      { id: 'D', text: 'バケットポリシーでバケットを公開し、認証なしでアクセスさせる', why_wrong: '誰でもアクセスできる状態になり、最も危険な方法。' },
    ],
    answer_ids: ['B'],
    explanation:
      'EC2 に **IAM ロール** を割り当てると、アプリは一時的な認証情報を自動で受け取り、定期的に自動更新される。長期のアクセスキーを保存しないため、漏えいリスクが最も小さい。\n\nAWS 上で動くものには「アクセスキーではなくロール」が基本。',
    references: ['https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-SEC-0004',
    domain: 'secure',
    services: ['VPC'],
    type: 'single',
    stem:
      'VPC のトラフィック制御について、「ステートフルで、許可ルールだけを設定でき、インスタンス（ENI）単位で適用される」ものはどれか。',
    choices: [
      { id: 'A', text: 'ネットワーク ACL', why_wrong: 'ネットワーク ACL はステートレスで、許可と拒否の両方を設定でき、サブネット単位で適用される。' },
      { id: 'B', text: 'セキュリティグループ' },
      { id: 'C', text: 'ルートテーブル', why_wrong: 'ルートテーブルは通信の行き先（経路）を決めるもので、通信の許可・拒否はしない。' },
      { id: 'D', text: 'インターネットゲートウェイ', why_wrong: 'VPC とインターネットをつなぐ出入口で、通信のフィルタリング機能はない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**セキュリティグループ** はステートフルなので、許可した通信の戻りは自動で通る。設定できるのは許可ルールだけ。\n\n**ネットワーク ACL** はステートレスで、戻りの通信も明示的に許可する必要がある。特定の IP を「拒否」したい場合はネットワーク ACL を使う。',
    references: ['https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-SEC-0005',
    domain: 'secure',
    services: ['Secrets Manager', 'RDS'],
    type: 'single',
    stem:
      'アプリケーションが使う RDS のデータベース認証情報を安全に保管し、定期的に自動でローテーションしたい。運用の手間が最も少ないサービスはどれか。',
    choices: [
      { id: 'A', text: 'AWS Secrets Manager', },
      { id: 'B', text: 'AWS KMS', why_wrong: 'KMS は暗号化キーを管理するサービスで、パスワードなどのシークレットの保管やローテーションはしない。' },
      { id: 'C', text: 'EC2 のユーザーデータにパスワードを記載する', why_wrong: 'ユーザーデータはインスタンスから読み取れるため、機密情報の置き場所に向かない。ローテーションもできない。' },
      { id: 'D', text: 'S3 バケットに暗号化したテキストファイルとして保存する', why_wrong: '保管はできるが、ローテーションの仕組みを自分で作る必要があり、手間が大きい。' },
    ],
    answer_ids: ['A'],
    explanation:
      '**Secrets Manager** はシークレットを暗号化して保管し、RDS などの認証情報を **自動ローテーション** できる。アプリは API でその時点の値を取得するので、パスワードを書き換える必要がない。\n\nSystems Manager の Parameter Store も設定値の保管に使えるが、自動ローテーションの機能はない点が違い。',
    references: ['https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-SEC-0006',
    domain: 'secure',
    services: ['WAF', 'ALB'],
    type: 'single',
    stem:
      'Application Load Balancer（ALB）の背後で Web アプリを公開している。SQL インジェクションやクロスサイトスクリプティングなどの攻撃をブロックしたい。どのサービスを使うべきか。',
    choices: [
      { id: 'A', text: 'AWS Shield Standard', why_wrong: 'Shield Standard はネットワーク層・トランスポート層の DDoS 攻撃から守るもので、アプリ層の攻撃パターンは検査しない。' },
      { id: 'B', text: 'Amazon GuardDuty', why_wrong: 'GuardDuty は脅威を「検出」するサービスで、通信をブロックはしない。' },
      { id: 'C', text: 'AWS WAF を ALB に関連付け、マネージドルールを適用する' },
      { id: 'D', text: 'セキュリティグループでポート 443 のみ許可する', why_wrong: 'セキュリティグループはポートや IP で判断するため、HTTPS の中身に含まれる攻撃は防げない。' },
    ],
    answer_ids: ['C'],
    explanation:
      '**AWS WAF** は HTTP/HTTPS リクエストの中身を検査するファイアウォール。ALB、CloudFront、API Gateway などに関連付けられ、SQL インジェクションや XSS 対策の **マネージドルール** をそのまま使える。',
    references: ['https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html'],
    difficulty: 1,
    version: 1,
  },
  {
    id: 'Q-SEC-0007',
    domain: 'secure',
    services: ['S3', 'KMS'],
    type: 'single',
    stem:
      'S3 に保存するデータをサーバー側で暗号化したい。暗号化キーの使用履歴を CloudTrail で監査でき、キーポリシーで誰がキーを使えるかを自分で管理したい。最も適切な方法はどれか。',
    choices: [
      { id: 'A', text: 'S3 マネージドキーによるサーバー側の暗号化（SSE-S3）', why_wrong: 'キーは S3 が管理するため、キーごとのアクセス制御や使用履歴の監査はできない。' },
      { id: 'B', text: 'KMS のカスタマーマネージドキーによるサーバー側の暗号化（SSE-KMS）' },
      { id: 'C', text: 'お客様が用意したキーによるサーバー側の暗号化（SSE-C）', why_wrong: 'キーは利用者が毎回リクエストで渡し、AWS は保存しない。キーの管理をすべて自分で行う必要がある。' },
      { id: 'D', text: 'バケットのバージョニングを有効にする', why_wrong: 'バージョニングは過去の版を残す機能で、暗号化とは関係ない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**SSE-KMS** で **カスタマーマネージドキー** を使うと、キーポリシーで利用者を制御でき、キーの使用は CloudTrail に記録される。キーのローテーションも設定できる。\n\n「監査」「キーの管理を自分で」という要件が出たら SSE-KMS を思い出す。',
    references: ['https://docs.aws.amazon.com/kms/latest/developerguide/overview.html'],
    difficulty: 1,
    version: 1,
  },

  // ---- 応用 ----
  {
    id: 'Q-SEC-0008',
    domain: 'secure',
    services: ['Organizations', 'SCP'],
    type: 'single',
    stem:
      'AWS Organizations で複数のアカウントを管理している。すべてのメンバーアカウントで、東京と大阪以外のリージョンの利用を禁止したい。各アカウントの管理者がこの制限を解除できないようにする必要がある。最も適切な方法はどれか。',
    choices: [
      { id: 'A', text: '各アカウントの IAM ユーザーとロールに、リージョンを制限する IAM ポリシーをアタッチする', why_wrong: '各アカウントの管理者が IAM ポリシーを変更・削除できるため、制限を解除されてしまう。' },
      { id: 'B', text: 'aws:RequestedRegion 条件で拒否するサービスコントロールポリシー（SCP）を OU に適用する' },
      { id: 'C', text: 'AWS Config ルールで許可外のリージョンのリソースを検出する', why_wrong: 'Config は設定の検出・評価をするもので、操作そのものを止めることはできない。' },
      { id: 'D', text: '各 IAM ユーザーにアクセス許可の境界（Permissions Boundary）を設定する', why_wrong: 'アカウント内の設定なので、管理者権限を持つユーザーが変更できる。設定漏れも起こりやすい。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**SCP** は組織の管理アカウントから OU やアカウント単位で「使える権限の上限」を決める仕組み。メンバーアカウントの管理者（ルートユーザーを含む）も SCP の制限を超える操作はできない。\n\nグローバルサービス（IAM など）まで止めないよう、除外の条件を入れるのが実務上のポイント。',
    references: ['https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-SEC-0009',
    domain: 'secure',
    services: ['CloudFront', 'S3'],
    type: 'single',
    stem:
      'S3 に置いた静的サイトを CloudFront 経由で配信している。利用者が S3 の URL に直接アクセスして CloudFront を迂回することを防ぎたい。最も適切な方法はどれか。',
    choices: [
      { id: 'A', text: 'S3 バケットを公開し、バケットポリシーで Referer ヘッダーを確認する', why_wrong: 'Referer ヘッダーは利用者側で簡単に偽装できるため、確実な対策にならない。' },
      { id: 'B', text: 'オリジンアクセスコントロール（OAC）を設定し、バケットポリシーでその CloudFront ディストリビューションからのアクセスだけを許可する' },
      { id: 'C', text: 'S3 バケットにセキュリティグループを設定し、CloudFront の IP 範囲だけを許可する', why_wrong: 'S3 バケットにはセキュリティグループを設定できない。' },
      { id: 'D', text: 'すべてのオブジェクトに署名付き URL を発行して配る', why_wrong: '公開サイトの全ファイルに署名付き URL を配るのは現実的でなく、S3 への直接アクセスを禁止することにもならない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**OAC** を使うと CloudFront が署名付きリクエストで S3 にアクセスする。バケットは非公開のまま、バケットポリシーで「この CloudFront ディストリビューションから」のアクセスだけを許可できる。\n\n以前のオリジンアクセスアイデンティティ（OAI）より OAC が推奨されている。',
    references: ['https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-SEC-0010',
    domain: 'secure',
    services: ['Systems Manager', 'EC2'],
    type: 'single',
    stem:
      'プライベートサブネットの EC2 インスタンスに、運用担当者がコマンド操作のためログインする必要がある。踏み台サーバーは置かず、受信ポートも開けたくない。操作内容のログも残したい。最も適切な方法はどれか。',
    choices: [
      { id: 'A', text: 'パブリックサブネットに踏み台サーバーを置き、そこから SSH で接続する', why_wrong: '踏み台サーバーを置かないという要件に反し、SSH ポートの開放と鍵の管理も必要になる。' },
      { id: 'B', text: 'セキュリティグループでポート 22 を 0.0.0.0/0 に開け、パブリック IP を付与する', why_wrong: 'インターネットから SSH を受け付ける状態になり、攻撃対象になる。' },
      { id: 'C', text: 'AWS Systems Manager Session Manager を使い、セッションのログを S3 や CloudWatch Logs に保存する' },
      { id: 'D', text: 'インスタンスにパブリック IP を付与し、EC2 Instance Connect で接続する', why_wrong: 'SSH の受信経路が必要になり、プライベートサブネットのまま受信ポートを閉じる要件を満たせない。' },
    ],
    answer_ids: ['C'],
    explanation:
      '**Session Manager** は、インスタンスの SSM エージェントから AWS への「外向き」の通信でセッションを張る。受信ポートや踏み台、SSH 鍵が不要で、IAM で接続できる人を制御できる。操作ログは S3 や CloudWatch Logs に残せる。\n\nインターネットに出られないサブネットでは、Systems Manager 用の VPC エンドポイントを用意する。',
    references: ['https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-SEC-0011',
    domain: 'secure',
    services: ['S3', 'Macie'],
    type: 'multiple',
    stem:
      '顧客の個人情報を含むファイルを S3 に保存している。バケットが誤って公開されるのを防ぎ、個人情報を含むオブジェクトを自動で見つけたい。必要な対策を 2 つ選べ。',
    choices: [
      { id: 'A', text: 'アカウント全体で S3 ブロックパブリックアクセスを有効にする' },
      { id: 'B', text: 'Amazon Macie で機密データの検出ジョブを実行する' },
      { id: 'C', text: 'Amazon Inspector で S3 バケットをスキャンする', why_wrong: 'Inspector は EC2 やコンテナイメージ、Lambda の脆弱性を調べるサービスで、S3 内の個人情報は検出しない。' },
      { id: 'D', text: 'AWS Shield Advanced を有効にする', why_wrong: 'Shield Advanced は DDoS 対策で、公開設定のミスや個人情報の検出とは関係ない。' },
      { id: 'E', text: 'S3 Transfer Acceleration を有効にする', why_wrong: 'アップロードを速くする機能で、セキュリティ対策ではない。' },
    ],
    answer_ids: ['A', 'B'],
    explanation:
      '**S3 ブロックパブリックアクセス** をアカウント単位で有効にすると、バケットポリシーや ACL で公開しようとしても無効化される。\n\n**Macie** は機械学習とパターン照合で、S3 内の個人情報や認証情報などの機密データを自動で検出する。',
    references: ['https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-SEC-0012',
    domain: 'secure',
    services: ['Cognito', 'S3'],
    type: 'single',
    stem:
      '数百万人が使うモバイルアプリを開発している。ユーザーのサインアップとサインイン（Google アカウントでのログインを含む）を提供し、ログインしたユーザーにだけ S3 への一時的なアクセス権を与えたい。最も適切な構成はどれか。',
    choices: [
      { id: 'A', text: 'アプリのユーザーごとに IAM ユーザーを作成する', why_wrong: 'IAM ユーザーは AWS を操作する人やシステム向けで、アプリの一般利用者の管理には向かない。数にも上限がある。' },
      { id: 'B', text: 'Amazon Cognito のユーザープールで認証し、ID プールで一時的な AWS 認証情報を発行する' },
      { id: 'C', text: 'IAM Identity Center にユーザーを登録する', why_wrong: 'IAM Identity Center は社員などが AWS アカウントや業務アプリにサインインするためのもので、一般向けアプリの会員管理には使わない。' },
      { id: 'D', text: '共通の IAM アクセスキーをアプリに組み込み配布する', why_wrong: 'アプリからキーを抜き取られると誰でも使えてしまい、ユーザーごとの制御もできない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**Cognito ユーザープール** はサインアップ・サインイン、ソーシャルログイン、MFA などの会員機能を提供する。**ID プール** はログインしたユーザーに IAM ロールの一時的な認証情報を渡し、S3 などに直接アクセスさせられる。',
    references: ['https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-SEC-0013',
    domain: 'secure',
    services: ['EBS', 'KMS'],
    type: 'single',
    stem:
      '暗号化されていない EBS ボリュームを使っている EC2 インスタンスがある。セキュリティ要件の変更で、このボリュームのデータを暗号化する必要が出た。正しい手順はどれか。',
    choices: [
      { id: 'A', text: 'ボリュームの設定を変更して暗号化を有効にする', why_wrong: '既存の暗号化されていないボリュームを、その場で暗号化に切り替えることはできない。' },
      { id: 'B', text: 'スナップショットを作成し、暗号化を指定してコピーし、そこから新しいボリュームを作って付け替える' },
      { id: 'C', text: 'アカウントで「EBS のデフォルト暗号化」を有効にする', why_wrong: 'デフォルト暗号化は今後新しく作るボリュームに効くもので、既存のボリュームは暗号化されない。' },
      { id: 'D', text: 'インスタンスを停止して、別のインスタンスタイプで起動し直す', why_wrong: 'インスタンスタイプを変えてもボリュームの暗号化状態は変わらない。' },
    ],
    answer_ids: ['B'],
    explanation:
      '既存のボリュームを暗号化するには **スナップショット → 暗号化してコピー → 新しいボリュームを作成** の順で行い、元のボリュームと付け替える。暗号化されたスナップショットから作るボリュームは自動的に暗号化される。\n\n今後のために「デフォルト暗号化」も有効にしておくとよい。',
    references: ['https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html'],
    difficulty: 2,
    version: 1,
  },
  {
    id: 'Q-SEC-0014',
    domain: 'secure',
    services: ['S3'],
    type: 'single',
    stem:
      '規制要件により、S3 に保存した取引記録を 5 年間、誰も（ルートユーザーも含めて）削除・上書きできないようにする必要がある。最も適切な方法はどれか。',
    choices: [
      { id: 'A', text: 'S3 オブジェクトロックをガバナンスモードで設定する', why_wrong: 'ガバナンスモードは特別な権限を持つユーザーなら保持設定を外して削除できるため、要件を満たさない。' },
      { id: 'B', text: 'S3 オブジェクトロックをコンプライアンスモードで設定し、保持期間を 5 年にする' },
      { id: 'C', text: 'バージョニングと MFA Delete を有効にする', why_wrong: 'MFA を使えばルートユーザーは削除できるため、「誰も削除できない」要件には届かない。' },
      { id: 'D', text: 'バケットポリシーで削除操作を拒否する', why_wrong: '管理者がバケットポリシー自体を書き換えれば削除できてしまう。' },
    ],
    answer_ids: ['B'],
    explanation:
      '**オブジェクトロックのコンプライアンスモード** では、保持期間中はルートユーザーを含めて誰もオブジェクトを削除・上書きできず、保持期間を短くすることもできない。WORM（書き込みは 1 回、読み取りは何度でも）が求められる記録の保管に使う。',
    references: ['https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html'],
    difficulty: 2,
    version: 1,
  },
];
