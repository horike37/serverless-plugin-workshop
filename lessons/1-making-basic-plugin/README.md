## Overview
この章では、Serverless Frameworkプラグインの開発の基本について学びましょう。

Serverless Frameworkはプラグインを開発することで、その機能を自由に拡張することが可能です。コマンドとそれに対応する処理がライフサイクルイベントという仕組みで実装されており、コアに存在する処理はそれを通して”プラグイン”の形式で実装されています。

コアの開発チームの中では、コアに存在するプラグインをinternalプラグイン、そしてコミュニティの皆さんが開発して公開しているプラグインをexternalプラグインと呼んでいます。

また、Serverless FrameworkはAWSだけでなく、AzureやGoogle、Cloudflareといった様々なプロバイダーで使用が可能です。ライフサイクルイベントには全プロバイダーに対して有効なグローバルなイベントと各プロバイダーでのみ有効なサブライフサイクルイベントに分かれます。

例えば、'sls package'の際に走る`package:finalize`イベントはすべてのプロバイダーで有効ですが、`aws:package:finalize:mergeCustomProviderResources`はAWSのみで有効です。

## プラグインの公開
プラグインはnpmのパッケージとして公開して、[プラグインリポジトリ](https://github.com/serverless/plugins)に登録することで、`serverless plugin install`コマンドを通してインストールできるようになります。

なにか開発したら是非、こちらで公開してみてください

## 開発の流れ
開発の流れとしては大きく3つを行います。
- プラグインの専用classの追加
- コマンドの定義
- ライフサイクルイベントを使った処理の追加

また、既存のコマンドの機能を拡張する場合は、既存のライフサイクルイベントに対してのみ処理を追加していきます

### プラグインの専用classの追加
以下のようなコンストラクタを定義したclassを追加します。`serverless`変数にServerless Frameworkのコアのメソッドやserverless.ymlで設定した内容が渡されるので、それらを元にして開発を行います。
`options`変数にはコマンドから引き渡されたオプションデータが格納されています。

```JavaScript
class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    // ...
  }
  // ...
}
```

### コマンドの定義

コンストラクタの中にコマンドをJSONで定義していきます。以下で`serverless welcome`コマンドを定義しています。usageには`serverless --help`で表示される説明を記載します。

```JavaSript
class ServerlessPlugin {
  constructor(serverless, options) {
    // ...
    this.commands = {
      welcome: {
        usage: 'Helps you start your first Serverless plugin',
        lifecycleEvents: [
          'hello',
          'world',
        ],
        // ...
      },
    };
  }
}
```


さらに以下のように`options`で`serverless welcome --message \'My Message\'`というようにオプションを定義します。

```JavaScript
this.commands = {
  welcome: {
    usage: 'Helps you start your first Serverless plugin',
    lifecycleEvents: [
      'hello',
      'world',
    ],
    options: {
      message: {
        usage:
          'Specify the message you want to deploy '
          + '(e.g. "--message \'My Message\'" or "-m \'My Message\'")',
        required: true,
        shortcut: 'm',
      },
    },
  },
};

```

### ライフサイクルイベントへの処理の追加
上記で定義したようにこのプラグインは、`welcome:hello`と`welcome:world`というイベントを通ります。
ここにメソッドを追加することでプラグインとしての処理を追加していきます。

```JavaScript
class ServerlessPlugin {
  constructor(serverless, options) {
    // ...
    this.hooks = {
      'before:welcome:hello': this.beforeWelcome.bind(this),
      'welcome:hello': this.welcomeUser.bind(this),
      'welcome:world': this.displayHelloMessage.bind(this),
      'after:welcome:world': this.afterHelloWorld.bind(this),
    };
  }
}
```

```JavaScript
class ServerlessPlugin {
  // ...

  beforeWelcome() {
    this.serverless.cli.log('Hello from Serverless!');
  }

  welcomeUser() {
    this.serverless.cli.log('Your message:');
  }

  displayHelloMessage() {
    this.serverless.cli.log(`${this.options.message}`);
  }

  afterHelloWorld() {
    this.serverless.cli.log('Please come again!');
  }
}
```

## Step1. ここまでで解説したServerless Welcomeプラグインを作ってみましょう
`sls-plugin`配下がプラグイン開発用のServerlessプロジェクトです。`.serverless_plugins`配下のsls-plugin.jsを編集してserverless welcomeコマンドを動かしてみてください


プロジェクトのルートディレクトリに戻って、`serverless --help`で`serverless welcome`が表示されていれば正しく動いています。そして、`serverless welcome --message hello`で動作確認をしてみましょう
