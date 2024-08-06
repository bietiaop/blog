import Document, { Html, Head, Main, NextScript } from 'next/document';
import cn from 'classnames';
import { config } from '@/lib/server/config';
import tailwind from '@/tailwind.config';
import CJK from '@/lib/cjk';
import BLOG from '@/blog.config';
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const initialColorScheme = {
      auto: 'color-scheme-unset',
      dark: 'dark',
    }[config.appearance];

    return (
      <Html
        lang={config.lang}
        // className={cn(initialColorScheme)}
        className={BLOG.appearance === 'dark' ? 'dark' : undefined}
      >
        <Head>
          {config.font && config.font === 'serif' ? (
            <>
              <link
                rel='preload'
                href='/fonts/SourceSerif.var.woff2'
                as='font'
                type='font/woff2'
                crossOrigin='anonymous'
              />
              <link
                rel='preload'
                href='/fonts/SourceSerif-Italic.var.woff2'
                as='font'
                type='font/woff2'
                crossOrigin='anonymous'
              />
            </>
          ) : (
            <>
              <link
                rel='preload'
                href='/fonts/IBMPlexSansVar-Roman.woff2'
                as='font'
                type='font/woff2'
                crossOrigin='anonymous'
              />
              <link
                rel='preload'
                href='/fonts/IBMPlexSansVar-Italic.woff2'
                as='font'
                type='font/woff2'
                crossOrigin='anonymous'
              />
            </>
          )}

          {['zh', 'ja', 'ko'].includes(
            config.lang.slice(0, 2).toLocaleLowerCase()
          ) && (
            <>
              <link
                rel='preconnect'
                href='https://fonts.gstatic.com'
                crossOrigin='anonymous'
              />
              <link
                rel='preload'
                as='style'
                href={`https://fonts.googleapis.com/css2?family=Noto+${
                  config.font === 'serif' ? 'Serif' : 'Sans'
                }+${CJK()}:wght@400;500;700&display=swap`}
              />
              <link
                rel='stylesheet'
                href={`https://fonts.googleapis.com/css2?family=Noto+${
                  config.font === 'serif' ? 'Serif' : 'Sans'
                }+${CJK()}:wght@400;500;700&display=swap`}
              />
              <noscript>
                <link
                  rel='stylesheet'
                  href={`https://fonts.googleapis.com/css2?family=Noto+${
                    config.font === 'serif' ? 'Serif' : 'Sans'
                  }+${CJK()}:wght@400;500;700&display=swap`}
                />
              </noscript>
            </>
          )}
          <link
            rel='icon'
            href='/favicon.png'
          />
          <link
            rel='alternate'
            type='application/rss+xml'
            title='RSS 2.0'
            href='/feed'
          ></link>
          {config.appearance === 'auto' ? (
            <>
              <meta
                name='theme-color'
                content={config.lightBackground}
                media='(prefers-color-scheme: light)'
              />
              <meta
                name='theme-color'
                content={config.darkBackground}
                media='(prefers-color-scheme: dark)'
              />
            </>
          ) : (
            <meta
              name='theme-color'
              content={
                config.appearance === 'dark'
                  ? config.darkBackground
                  : config.lightBackground
              }
            />
          )}
        </Head>
        <body className='bg-day dark:bg-night'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
