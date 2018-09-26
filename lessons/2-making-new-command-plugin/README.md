## Step2. DynamoDBのデータをダウンロードするプラグインを作ってみよう
### 仕様
`serverless download --resource UsersDynamoDB --target-stage dev`で、Reosurceセクションに指定したUsersDynamoDBのデータをJSONで標準出力に出力してください。

実装前に以下の手順を実行して準備を整えてください
- `sls deploy`を実行してDynamoDBのリソースをデプロイ
- `sls invoke -f post -p event.json`を実行してデータをDBに登録します。
- `sls invoke -f get`を実行してデータの登録を確認する
