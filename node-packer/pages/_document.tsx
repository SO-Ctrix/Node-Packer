import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title>Node Packer</title>
          <meta name="description" content="A place where you can make your own node package.json" />
          <link rel="shortcut icon" href="node-packer\app\favicon.ico" type="image/x-icon" />
          <link rel="icon" href="node-packer\app\favicon.ico" type="image/x-icon" />
          {/* Add other global head elements here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
