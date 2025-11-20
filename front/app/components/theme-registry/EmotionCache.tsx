'use client';
import * as React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import createCache from '@emotion/cache';

export default function NextAppDirEmotionCacheProvider(props: any) {
  const { options, children } = props;
  const [cache] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    );
  });

  return <main {...props}>{children}</main>;
}