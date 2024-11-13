'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import handleButtonClick2 from '../app/components/KakaoMap'
export default function Header({ searchAuto, setInputValue }) {
    const router = useRouter();

    const [searchVisible, setSearchVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const openSearch = () => {
        setSearchVisible(true);
    }
    const closeSearch = () => {
        setSearchVisible(false);
    }


    return (
        <>
            <header>
                <div className="left_nav">
                    <Link href="/" className="logo" onClick=
                    {
                        useEffect( () => {
                            router.push('/')
                        }, [])
                        
                    }>
                        <img src="../images/logo.png" alt="" />
                    </Link>
                    <ul>
                        <li>
                            <Link href="#">대여소 안내</Link>
                        </li>
                        <li>
                            <Link href="#">이용권 구매</Link>
                        </li>
                    </ul>
                </div>

                <div className="right_nav">
                    <ul>
                        <li>
                            <Link href="" className="search-bike" onClick={openSearch}>
                                <svg data-v-d955b8b8="" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M15.4508 8.90796C15.4508 12.4977 12.5396 15.408 8.94985 15.408C5.3611 15.408 2.45081 12.4977 2.45081 8.90796C2.45081 5.31825 5.3611 2.40796 8.94985 2.40796C12.5396 2.40796 15.4508 5.31825 15.4508 8.90796Z" stroke="#A5A5A5" strokeWidth="2"></path><path d="M14.0474 13.6536L19.7904 19.2229" stroke="#A5A5A5" strokeWidth="2" strokeLinecap="round"></path></svg>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="search-wrap" style={{ display: searchVisible ? 'flex' : 'none' }}>
                    <div className="search-input">
                        <input type="text" placeholder='찾으시는 저장소를 검색해보세요.'
                            onChange={
                                (e) => { setInputValue(e.target.value), searchAuto() }
                            }
                            onKeyDown={
                                (e) => {
                                    if (e.key === 'Enter') {
                                        // handleSearchClick();
                                        searchAuto();
                                    }
                                }
                            }
                        />
                        <ul className="auto-lists">
                        </ul>
                    </div>

                    <div className="search-close" onClick={closeSearch}>
                        <button>
                            <img src="/images/close.png" alt="" />
                        </button>
                    </div>
                </div>
            </header>

        </>

    );
}
