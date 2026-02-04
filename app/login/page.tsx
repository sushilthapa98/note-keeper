import Image from 'next/image';
import LoginForm from '../ui/login-form';

export default function Login() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="w-full max-w-[400px] mx-auto">
        <div className="mb-4">
          <Image src="/next.svg" alt="Logo" width={100} height={100} priority />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
