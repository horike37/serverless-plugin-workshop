## Step3. x-rayの設定を有効化するプラグインを作ってみよう

### 仕様
serverless.ymlに以下のような有効化、無効化のフラグを立てて、有効の場合はLambdaのx-rayを有効化するプラグインを開発してください

```yaml
custom:
  trace: true
```

### 開発の手引き
- CloudFormationのLambdaファンクションの設定を行う箇所にてx-rayの設定を行います
- Lambdaにx-rayを使用するためのポリシーを追加するのを忘れずに
- `after:package:compileFunctions`イベントにて生成済みのCloudFomationのJSONが`serverless.service.provider.compiledCloudFormationTemplate
  .Resources`で取得できます
