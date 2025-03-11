'use client';

import { postDevLogin } from '@/apis/dev/postDevLogin';
import { postDevSignUp } from '@/apis/dev/postDevSignUp';
import { ROUTES } from '@/constants/route';
import { notifySuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { buttonStyle, formStyle, inputStyle, labelStyle } from './page.css';

export default function DevLoginPage() {
  const useInputRef = useRef<HTMLInputElement>(null);
  const usePasswordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleLogin = async () => {
    if (!useInputRef.current || !usePasswordRef.current) {
      return;
    }

    try {
      await postDevLogin({
        name: useInputRef.current.value,
        password: usePasswordRef.current.value,
      });
      router.push(ROUTES.HOME);
    } catch {
      /**Empty */
    }
  };

  const handleSignUp = async () => {
    if (!useInputRef.current || !usePasswordRef.current) {
      return;
    }

    try {
      await postDevSignUp({
        name: useInputRef.current.value,
        password: usePasswordRef.current.value,
      });
      notifySuccess('회원가입이 되었습니다. \n 로그인을 해주세요.');
    } catch {
      /**Empty */
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className={formStyle}
    >
      <label htmlFor="id" className={labelStyle}>
        아이디
      </label>
      <input
        id="id"
        type="text"
        autoComplete="on"
        className={inputStyle}
        ref={useInputRef}
      />

      <label htmlFor="password" className={labelStyle}>
        비밀번호
      </label>
      <input
        id="password"
        type="password"
        autoComplete="on"
        className={inputStyle}
        ref={usePasswordRef}
      />

      <button type="submit" className={buttonStyle} onClick={handleLogin}>
        로그인
      </button>
      <button type="submit" className={buttonStyle} onClick={handleSignUp}>
        회원가입
      </button>
    </form>
  );
}
