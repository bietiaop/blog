import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useConfig } from '@/lib/config';
import { useLocale } from '@/lib/locale';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const NavBar = () => {
  const BLOG = useConfig();
  const locale = useLocale();
  const route = useRouter().pathname;
  const { theme, setTheme } = useTheme();
  const links = [
    { id: 0, name: locale.NAV.INDEX, to: BLOG.path || '/', show: true },
    { id: 1, name: locale.NAV.ABOUT, to: '/about', show: BLOG.showAbout },
    { id: 2, name: locale.NAV.RSS, to: '/feed', show: true, external: true },
    { id: 3, name: locale.NAV.SEARCH, to: '/search', show: true },
  ];
  return (
    <div className='flex-shrink-0'>
      <ul className='flex flex-row'>
        {links.map(
          link =>
            link.show && (
              <li
                key={link.id}
                className={classNames(
                  'block ml-4 nav relative after:content-[attr(data-active)] after:absolute after:rounded-md after:bottom-0 after:left-0 after:h-1 after:bg-black after:dark:bg-gray-50',
                  route === link.to
                    ? 'text-black dark:text-gray-50 after:w-full'
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-50 after:w-0'
                )}
              >
                <Link
                  href={link.to}
                  target={link.external ? '_blank' : null}
                >
                  {link.name}
                </Link>
              </li>
            )
        )}
        <li className='ml-4'>
          <button
            className='block p-1 bg-night hover:bg-day dark:bg-day dark:hover:bg-night rounded-full duration-300 overflow-hidden text-day dark:text-night hover:text-night dark:hover:text-day'
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label='toggle Dark Mode'
            type='button'
          >
            {theme === 'light' ? (
              <MdDarkMode className='w-5 h-5' />
            ) : (
              <MdLightMode className='w-5 h-5' />
            )}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default function Header({ navBarTitle, fullWidth }) {
  const BLOG = useConfig();
  const { theme } = useTheme();

  // Favicon

  const resolveFavicon = fallback =>
    !fallback && theme === 'dark' ? '/favicon.dark.png' : '/favicon.png';
  const [favicon, _setFavicon] = useState(resolveFavicon());
  const setFavicon = fallback => _setFavicon(resolveFavicon(fallback));

  useEffect(
    () => setFavicon(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const useSticky = !BLOG.autoCollapsedNavBar;
  const navRef = useRef(/** @type {HTMLDivElement} */ undefined);
  const sentinelRef = useRef(/** @type {HTMLDivElement} */ undefined);
  const handler = useCallback(
    ([entry]) => {
      if (useSticky && navRef.current) {
        navRef.current?.classList.toggle(
          'sticky-nav-full',
          !entry.isIntersecting
        );
      } else {
        navRef.current?.classList.add('remove-sticky');
      }
    },
    [useSticky]
  );

  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    const observer = new window.IntersectionObserver(handler);
    observer.observe(sentinelEl);

    return () => {
      sentinelEl && observer.unobserve(sentinelEl);
    };
  }, [handler, sentinelRef]);

  const titleRef = useRef(/** @type {HTMLParagraphElement} */ undefined);

  function handleClickHeader(/** @type {MouseEvent} */ ev) {
    if (![navRef.current, titleRef.current].includes(ev.target)) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  return (
    <>
      <div
        className='observer-element h-4 md:h-12'
        ref={sentinelRef}
      ></div>
      <div
        className={`sticky-nav group m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-6 py-8 bg-opacity-60 ${
          !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
        }`}
        id='sticky-nav'
        ref={navRef}
        onClick={handleClickHeader}
      >
        <svg
          viewBox='0 0 24 24'
          className='caret w-6 h-6 absolute inset-x-0 bottom-0 mx-auto pointer-events-none opacity-30 group-hover:opacity-100 transition duration-100'
        >
          <path
            d='M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z'
            className='fill-black dark:fill-white'
          />
        </svg>
        <div className='flex items-center'>
          <Link
            href='/'
            aria-label={BLOG.title}
          >
            <Image
              src={favicon}
              width={24}
              height={24}
              alt={BLOG.title}
              onError={() => setFavicon(true)}
              className='rounded-full'
            />
          </Link>
          <HeaderName
            ref={titleRef}
            title={BLOG.title}
            postTitle={navBarTitle}
            onClick={handleClickHeader}
          />
        </div>
        <NavBar />
      </div>
    </>
  );
}

const HeaderName = forwardRef(function HeaderName(
  { title, postTitle, onClick },
  ref
) {
  return (
    <p
      ref={ref}
      className='header-name ml-2 font-medium text-gray-600 dark:text-gray-300 capture-pointer-events grid-rows-1 grid-cols-1 items-center'
      onClick={onClick}
    >
      {postTitle && (
        <span className='post-title row-start-1 col-start-1'>{postTitle}</span>
      )}
      <span className='row-start-1 col-start-1'>
        <span className='site-description font-normal'>{title}</span>
      </span>
    </p>
  );
});
