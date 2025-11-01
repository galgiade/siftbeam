#!/bin/bash
# Lambda Layer作成スクリプト (python-multipart)

# 作業ディレクトリを作成
mkdir -p python-multipart-layer/python

# python-multipartをインストール
pip install python-multipart -t python-multipart-layer/python/

# ZIPファイルを作成
cd python-multipart-layer
zip -r ../python-multipart-layer.zip .
cd ..

echo "✅ Lambda Layer作成完了: python-multipart-layer.zip"
echo ""
echo "次のステップ:"
echo "1. AWSコンソール → Lambda → レイヤー → レイヤーの作成"
echo "2. 名前: python-multipart"
echo "3. python-multipart-layer.zip をアップロード"
echo "4. 互換性のあるランタイム: Python 3.13"
echo "5. Lambda関数にレイヤーを追加"

