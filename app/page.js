import AuthForm from '@/components/auth-form';

export default async function Home({ searchParams }) {
  // 로그인, 회원가입 모드 체크
  const formMode = searchParams.mode || 'login'; //searchParams.mode가 falsy하면 login

  return <AuthForm mode={formMode} />;
}
