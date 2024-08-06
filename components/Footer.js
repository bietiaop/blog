import { useConfig } from '@/lib/config';
import beian from '@/assets/beian.png';
import Image from 'next/image';
const Footer = ({ fullWidth }) => {
  const BLOG = useConfig();

  const d = new Date();
  const y = d.getFullYear();
  const from = +BLOG.since;
  return (
    <div
      className={`mt-6 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 transition-all ${
        !fullWidth ? 'max-w-2xl px-4' : 'px-4 md:px-24'
      }`}
    >
      <hr className='border-gray-200 dark:border-gray-600' />
      <div className='my-4 text-sm leading-6'>
        <div className='flex align-baseline justify-between flex-wrap'>
          <p>
            © {BLOG.author} {from === y || !from ? y : `${from} - ${y}`}
          </p>
          <div className='flex flex-col items-end'>
            <p>
              <a
                href='https://beian.miit.gov.cn/'
                target='_blank'
              >
                苏ICP备2022027042号-1
              </a>
            </p>
            <p className='flex items-center'>
              <Image
                src={beian}
                className='inline-block w-4 h-4 mr-1'
                alt='beian'
              />
              <a
                href='https://beian.mps.gov.cn/#/query/webSearch?code=32038202000777'
                rel='noreferrer'
                target='_blank'
              >
                苏公网安备32038202000777
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
