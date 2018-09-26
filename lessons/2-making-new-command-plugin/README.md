## Step2. DynamoDBのデータをダウンロードするプラグインを作ってみよう
### 仕様
`serverless download --resource UsersDynamoDB --target-stage dev`で、Reosurceセクションに指定したUsersDynamoDBのデータをJSONで標準出力に出力してください。

実装前に以下の手順を実行して準備を整えてください
- `sls deploy`を実行してDynamoDBのリソースをデプロイ
- `sls invoke -f post -p event.json`を実行してデータをDBに登録します。
- `sls invoke -f get`を実行してデータの登録を確認する

開発の手引き
- まずはコマンドのJSONを定義して`sls --help`で表示されることを目指してください
- optionに入っている`resource`と`target-stage`からテーブル名を取得しましょう。serverless.yml上のresourcesセクションには`serverless.service.resources`にてアクセス可能です
- 以下の操作でServerless内部のaws-sdkが使用可能です。コアで使用しているものと互換性を保つために出来る限り同じものを使用しましょう

```JavaScript
this.provider = this.serverless.getProvider('aws');
this.region = this.provider.getRegion();
this.stage = this.provider.getStage();
return this.provider.request('DynamoDB',
  'scan',
  { TableName: tableName },
  this.options.stage,
  this.options.region
).then(result => {

})
```
- `serverless.cli.log`メソッドで標準出力に結果を表示しましょう
