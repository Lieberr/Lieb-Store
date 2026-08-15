import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import CategoryDropDrawer from './category-drop';
import Search from './search';

const Header = () => {
    return (
        <header
            className="
                w-full
                h-16
                border-b
                border-border/50
                bg-background
            "
        >
            <div className="wrapper h-full">
                <div className="flex h-full items-center justify-between gap-4">

                    {/* Logo + Categories */}
                    <div className="flex shrink-0 items-center gap-3">

                        <CategoryDropDrawer />

                        <Link
                            href="/"
                            className="group flex items-center gap-2"
                        >
                            <Image
                                src="/images/logo.svg"
                                alt={`${APP_NAME} logo`}
                                height={38}
                                width={38}
                                priority
                                className="
                                    transition-transform
                                    duration-200
                                    group-hover:scale-105
                                "
                            />

                            <span
                                className="
                                    hidden
                                    sm:block
                                    text-xl
                                    lg:text-2xl
                                    font-bold
                                    tracking-tight
                                "
                            >
                                {APP_NAME}
                            </span>
                        </Link>

                    </div>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 justify-center px-6">
                        <Search />
                    </div>

                    {/* Menu */}
                    <Menu />

                </div>
            </div>
        </header>
    );
};

export default Header;