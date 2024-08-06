import { clientConfig } from '@/lib/server/config';

import Container from '@/components/Container';
import BlogPost from '@/components/BlogPost';
import Pagination from '@/components/Pagination';
import { getAllPosts } from '@/lib/notion';
import { useConfig } from '@/lib/config';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export async function getStaticProps() {
  const posts = await getAllPosts({ includePages: false });
  const postsToShow = posts.slice(0, clientConfig.postsPerPage);
  const totalPosts = posts.length;
  const showNext = totalPosts > clientConfig.postsPerPage;
  return {
    props: {
      page: 1, // current page is 1
      postsToShow,
      showNext,
    },
    revalidate: 1,
  };
}

function Avatar() {
  const BLOG = useConfig();
  const { theme } = useTheme();
  const resolveFavicon = fallback =>
    !fallback && theme === 'dark' ? '/favicon.dark.png' : '/favicon.png';
  const [favicon, _setFavicon] = useState(resolveFavicon());
  const setFavicon = fallback => _setFavicon(resolveFavicon(fallback));
  useEffect(
    () => setFavicon(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );
  return (
    <div className='flex flex-col justify-center items-center mb-12 gap-1 text-2xl font-bold'>
      <Image
        width={128}
        height={128}
        src={favicon}
        alt={BLOG.title}
        onError={() => setFavicon(true)}
        className='rounded-full shadow-lg animate-[fluid_24s_ease_0s_infinite] mb-4'
      />
      <div className='drop-shadow-lg'>{BLOG.title}</div>
      <div className='text-base font-normal text-gray-500 dark:text-gray-400'>
        {BLOG.description}
      </div>
    </div>
  );
}

export default function Blog({ postsToShow, page, showNext }) {
  const { title, description } = useConfig();

  return (
    <Container
      title={title}
      description={description}
    >
      <Avatar />
      {postsToShow.map(post => (
        <BlogPost
          key={post.id}
          post={post}
        />
      ))}
      {showNext && (
        <Pagination
          page={page}
          showNext={showNext}
        />
      )}
    </Container>
  );
}
